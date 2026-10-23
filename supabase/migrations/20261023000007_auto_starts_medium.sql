-- Auto starts students at Medium (tier 2) instead of Easy, for new lectures and after a reset.

alter table public.exercise_state alter column tier set default 2;

-- Students who haven't finished a round yet move to the new starting point.
update public.exercise_state set tier = 2 where rounds = 0 and tier = 1;

create or replace function public.reset_exercises(lecture int)
returns void
language sql
volatile
security definer
set search_path = ''
as $$
  delete from public.exercise_attempts a where a.user_id = auth.uid() and a.lecture = reset_exercises.lecture;
  update public.exercise_state s set tier = 2, rounds = 0, finished_at = null
  where s.user_id = auth.uid() and s.lecture = reset_exercises.lecture;
$$;
