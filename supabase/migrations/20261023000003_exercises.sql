-- Exercises: per-lecture pools of image questions, served in adaptive rounds of 4.
--
-- Students never read the pool or write attempts directly. Every step goes through a
-- security definer function that checks can_access(lecture, 'exercises') first:
--   start_round(lecture)        resumes the open round, or serves up to 4 unseen questions
--   reveal_answer(attempt)      marks an attempt revealed and returns its answer image path
--   grade_attempt(attempt, g)   records 'got' | 'partly' | 'missed' after the reveal
--   reset_exercises(lecture)    clears the caller's attempts so the pool can be served again
-- Images live in the private 'exercises' bucket. A student may sign a link to a question
-- image only once it was served to them, and to its answer only after they revealed it.

-- Pool --------------------------------------------------------------------------------

create table if not exists public.exercise_questions (
  id uuid primary key default gen_random_uuid(),
  lecture int not null check (lecture between 1 and 26),
  tier int not null check (tier between 1 and 3),
  question_path text not null unique,
  answer_path text not null unique,
  alt text not null default '',
  source text unique, -- the pool file this came from, so re-running the upload script skips it
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists exercise_questions_lecture on public.exercise_questions (lecture) where active;
-- No policies: the pool, its tiers and its answer paths are unreadable from the API.
alter table public.exercise_questions enable row level security;
revoke all on public.exercise_questions from anon, authenticated;

-- Attempts ----------------------------------------------------------------------------

create table if not exists public.exercise_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  lecture int not null check (lecture between 1 and 26),
  question_id uuid not null references public.exercise_questions (id) on delete cascade,
  round int not null check (round > 0),
  position int not null check (position between 1 and 4),
  tier int not null check (tier between 1 and 3),
  served_at timestamptz not null default now(),
  revealed_at timestamptz,
  grade text check (grade in ('got', 'partly', 'missed')),
  graded_at timestamptz,
  unique (user_id, question_id),
  check (grade is null or revealed_at is not null)
);
create index if not exists exercise_attempts_user_lecture on public.exercise_attempts (user_id, lecture);
alter table public.exercise_attempts enable row level security;
create policy "Read own attempts" on public.exercise_attempts
  for select to authenticated using (user_id = auth.uid());
revoke insert, update, delete on public.exercise_attempts from anon, authenticated;
revoke all on public.exercise_attempts from anon;

-- Where each student is in each lecture: their current tier and whether the pool ran out.
create table if not exists public.exercise_state (
  user_id uuid not null references auth.users (id) on delete cascade,
  lecture int not null check (lecture between 1 and 26),
  tier int not null default 1 check (tier between 1 and 3),
  rounds int not null default 0,
  finished_at timestamptz,
  primary key (user_id, lecture)
);
alter table public.exercise_state enable row level security;
create policy "Read own exercise state" on public.exercise_state
  for select to authenticated using (user_id = auth.uid());
revoke insert, update, delete on public.exercise_state from anon, authenticated;
revoke all on public.exercise_state from anon;

-- Round items as the app sees them. Answer paths appear only once revealed; tiers never.
create or replace function private.round_items(uid uuid, lec int, rnd int)
returns table (attempt_id uuid, "position" int, question_path text, alt text, answer_path text, grade text)
language sql
stable
security definer
set search_path = ''
as $$
  select a.id, a.position, q.question_path, q.alt,
         case when a.revealed_at is not null then q.answer_path end, a.grade
  from public.exercise_attempts a
  join public.exercise_questions q on q.id = a.question_id
  where a.user_id = uid and a.lecture = lec and a.round = rnd
  order by a.position
$$;
revoke all on function private.round_items(uuid, int, int) from public;

-- Serving -----------------------------------------------------------------------------

create or replace function public.start_round(lecture int)
returns table (round int, finished boolean, attempt_id uuid, "position" int, question_path text, alt text, answer_path text, grade text)
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  st public.exercise_state;
  open_round int;
  served int;
begin
  if uid is null or not public.can_access(lecture, 'exercises') then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  -- One round at a time per student and lecture, even with two tabs open.
  perform pg_advisory_xact_lock(hashtextextended(uid::text || ':' || lecture, 0));

  insert into public.exercise_state (user_id, lecture) values (uid, start_round.lecture)
  on conflict do nothing;
  select * into st from public.exercise_state s where s.user_id = uid and s.lecture = start_round.lecture;

  -- Resume a round that still has ungraded questions.
  select max(a.round) into open_round from public.exercise_attempts a
  where a.user_id = uid and a.lecture = start_round.lecture and a.grade is null;
  if open_round is not null then
    return query select open_round, false, r.* from private.round_items(uid, start_round.lecture, open_round) r;
    return;
  end if;

  -- Serve up to 4 unseen questions, nearest the student's tier first, random within a tier.
  insert into public.exercise_attempts (user_id, lecture, question_id, round, position, tier)
  select uid, start_round.lecture, q.id, st.rounds + 1, row_number() over (order by q.dist, q.r), q.tier
  from (
    select q.id, q.tier, abs(q.tier - st.tier) as dist, random() as r
    from public.exercise_questions q
    where q.lecture = start_round.lecture and q.active
      and not exists (select 1 from public.exercise_attempts a where a.user_id = uid and a.question_id = q.id)
    order by dist, r
    limit 4
  ) q;
  get diagnostics served = row_count;

  if served = 0 then
    -- An empty pool isn't finished: the lecture may simply have no exercises yet.
    if st.rounds > 0 then
      update public.exercise_state s set finished_at = coalesce(s.finished_at, now())
      where s.user_id = uid and s.lecture = start_round.lecture;
    end if;
    return query select st.rounds, true, null::uuid, null::int, null::text, null::text, null::text, null::text;
    return;
  end if;

  update public.exercise_state s set rounds = st.rounds + 1
  where s.user_id = uid and s.lecture = start_round.lecture;
  return query select st.rounds + 1, false, r.* from private.round_items(uid, start_round.lecture, st.rounds + 1) r;
end
$$;

create or replace function public.reveal_answer(attempt uuid)
returns text
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  a public.exercise_attempts;
  path text;
begin
  select * into a from public.exercise_attempts x where x.id = attempt and x.user_id = auth.uid();
  if not found or not public.can_access(a.lecture, 'exercises') then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  update public.exercise_attempts x set revealed_at = coalesce(x.revealed_at, now()) where x.id = attempt;
  select q.answer_path into path from public.exercise_questions q where q.id = a.question_id;
  return path;
end
$$;

-- Records a self-reported grade. When it completes the round, moves the student's tier:
-- up after 75% or better, down under 50%, where got = 1 and partly = 0.5.
create or replace function public.grade_attempt(attempt uuid, grade text)
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  a public.exercise_attempts;
  left_in_round int;
  score numeric;
begin
  if grade is null or grade not in ('got', 'partly', 'missed') then
    raise exception 'bad grade' using errcode = '22023';
  end if;
  select * into a from public.exercise_attempts x where x.id = attempt and x.user_id = auth.uid();
  if not found or not public.can_access(a.lecture, 'exercises') then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  if a.revealed_at is null then
    raise exception 'reveal the answer first' using errcode = '22023';
  end if;
  if a.grade is not null then
    return;
  end if;
  perform pg_advisory_xact_lock(hashtextextended(a.user_id::text || ':' || a.lecture, 0));

  update public.exercise_attempts x set grade = grade_attempt.grade, graded_at = now() where x.id = attempt;

  select count(*) filter (where x.grade is null),
         avg(case x.grade when 'got' then 1 when 'partly' then 0.5 else 0 end)
    into left_in_round, score
  from public.exercise_attempts x
  where x.user_id = a.user_id and x.lecture = a.lecture and x.round = a.round;

  if left_in_round = 0 then
    update public.exercise_state s
    set tier = case when score >= 0.75 then least(s.tier + 1, 3)
                    when score < 0.5 then greatest(s.tier - 1, 1)
                    else s.tier end
    where s.user_id = a.user_id and s.lecture = a.lecture;
  end if;
end
$$;

create or replace function public.reset_exercises(lecture int)
returns void
language sql
volatile
security definer
set search_path = ''
as $$
  delete from public.exercise_attempts a where a.user_id = auth.uid() and a.lecture = reset_exercises.lecture;
  delete from public.exercise_state s where s.user_id = auth.uid() and s.lecture = reset_exercises.lecture;
$$;

-- Per-lecture counts for the dashboard: questions graded and pool size (never the pool itself).
create or replace function public.exercise_summary()
returns table (lecture int, graded int, pool int, finished boolean)
language sql
stable
security definer
set search_path = ''
as $$
  select p.lecture,
         (select count(*)::int from public.exercise_attempts a
          where a.user_id = auth.uid() and a.lecture = p.lecture and a.grade is not null),
         p.n::int,
         exists (select 1 from public.exercise_state s
                 where s.user_id = auth.uid() and s.lecture = p.lecture and s.finished_at is not null)
  from (select q.lecture, count(*) as n from public.exercise_questions q where q.active group by q.lecture) p
  where auth.uid() is not null and public.can_access(p.lecture, 'exercises')
$$;

revoke execute on function public.start_round(int) from public;
revoke execute on function public.reveal_answer(uuid) from public;
revoke execute on function public.grade_attempt(uuid, text) from public;
revoke execute on function public.reset_exercises(int) from public;
revoke execute on function public.exercise_summary() from public;
grant execute on function public.start_round(int) to authenticated;
grant execute on function public.reveal_answer(uuid) to authenticated;
grant execute on function public.grade_attempt(uuid, text) to authenticated;
grant execute on function public.reset_exercises(int) to authenticated;
grant execute on function public.exercise_summary() to authenticated;

-- Images ------------------------------------------------------------------------------

-- Whether the caller may read one object in the exercises bucket.
create or replace function public.can_read_exercise_image(object_name text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.exercise_attempts a
    join public.exercise_questions q on q.id = a.question_id
    where a.user_id = auth.uid()
      and public.can_access(a.lecture, 'exercises')
      and (q.question_path = object_name or (q.answer_path = object_name and a.revealed_at is not null))
  )
$$;
revoke execute on function public.can_read_exercise_image(text) from public;
grant execute on function public.can_read_exercise_image(text) to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('exercises', 'exercises', false, 2097152, array['image/png', 'image/webp'])
on conflict (id) do update set public = false;

create policy "Read served exercise images" on storage.objects
  for select to authenticated
  using (bucket_id = 'exercises' and public.can_read_exercise_image(name));
