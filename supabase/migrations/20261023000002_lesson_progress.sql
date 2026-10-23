-- No client can reach private.settings already (schema not exposed, grants revoked); RLS is a third lock.
alter table private.settings enable row level security;

-- Lesson progress: how far each signed-in student has read each lesson.
-- Rows belong to their user. Writes are only allowed for lessons the user may open.

create table if not exists public.lesson_progress (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  lecture int not null check (lecture between 1 and 26),
  pages_read int not null check (pages_read >= 0),
  page_count int not null check (page_count > 0 and pages_read <= page_count),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, lecture)
);
alter table public.lesson_progress enable row level security;

create policy "Read own lesson progress" on public.lesson_progress
  for select to authenticated using (user_id = auth.uid());
create policy "Add own lesson progress" on public.lesson_progress
  for insert to authenticated with check (user_id = auth.uid() and public.can_access(lecture, 'lesson'));
create policy "Update own lesson progress" on public.lesson_progress
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid() and public.can_access(lecture, 'lesson'));
create policy "Reset own lesson progress" on public.lesson_progress
  for delete to authenticated using (user_id = auth.uid());

revoke all on public.lesson_progress from anon;

-- What the caller may open in every lecture, in one call, for the /lectures page.
-- Display only: each lesson and exercise request still checks can_access itself.
create or replace function public.lecture_access()
returns table (lecture int, lesson boolean, exercises boolean, cmu_unlock_at timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select g.n, public.can_access(g.n, 'lesson'), public.can_access(g.n, 'exercises'), u.cmu_unlock_at
  from generate_series(1, 26) as g (n)
  left join public.lecture_unlocks u on u.n = g.n
  order by g.n
$$;

revoke execute on function public.lecture_access() from public;
grant execute on function public.lecture_access() to anon, authenticated;
