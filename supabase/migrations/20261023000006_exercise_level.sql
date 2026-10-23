-- Students choose their exercise level on a slider: Auto (adaptive, the default), Easy, Medium
-- or Hard. A chosen level fixes which tier start_round serves first. The adaptive tier keeps
-- learning in the background, so switching back to Auto picks up where it left off.

alter table public.exercise_state
  add column if not exists chosen_tier int check (chosen_tier between 1 and 3);

-- Sets the caller's level for a lecture: 1, 2 or 3, or null for Auto. Takes effect next round.
create or replace function public.set_exercise_level(lecture int, level int)
returns void
language plpgsql
volatile
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or not public.can_access(lecture, 'exercises') then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  if level is not null and level not between 1 and 3 then
    raise exception 'bad level' using errcode = '22023';
  end if;
  insert into public.exercise_state (user_id, lecture, chosen_tier)
  values (auth.uid(), set_exercise_level.lecture, level)
  on conflict on constraint exercise_state_pkey do update set chosen_tier = excluded.chosen_tier;
end
$$;

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

  -- Serve up to 4 unseen questions nearest the chosen level (or the adaptive tier on Auto),
  -- random within a tier.
  insert into public.exercise_attempts (user_id, lecture, question_id, round, position, tier)
  select uid, start_round.lecture, q.id, st.rounds + 1, row_number() over (order by q.dist, q.r), q.tier
  from (
    select q.id, q.tier, abs(q.tier - coalesce(st.chosen_tier, st.tier)) as dist, random() as r
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

-- Resetting exercises keeps the student's chosen level.
create or replace function public.reset_exercises(lecture int)
returns void
language sql
volatile
security definer
set search_path = ''
as $$
  delete from public.exercise_attempts a where a.user_id = auth.uid() and a.lecture = reset_exercises.lecture;
  update public.exercise_state s set tier = 1, rounds = 0, finished_at = null
  where s.user_id = auth.uid() and s.lecture = reset_exercises.lecture;
$$;

revoke execute on function public.set_exercise_level(int, int) from public;
grant execute on function public.set_exercise_level(int, int) to authenticated;
