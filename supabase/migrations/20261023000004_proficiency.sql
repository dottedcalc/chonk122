-- Proficiency inputs: one exercise score per lecture, computed here so tiers stay hidden.

-- Students may read their own attempts, but no longer the tier column.
revoke select on public.exercise_attempts from authenticated;
grant select (id, user_id, lecture, round, position, served_at, revealed_at, grade, graded_at)
  on public.exercise_attempts to authenticated;

-- Per lecture: how many questions the caller graded, and their mastery from 0 to 1.
-- got = 1, partly = 0.5, missed = 0. A tier-3 question weighs 3 times a tier-1 one, and each
-- round counts 0.85 times the round after it, so recent work matters most.
create or replace function public.exercise_scores()
returns table (lecture int, graded int, mastery numeric)
language sql
stable
security definer
set search_path = ''
as $$
  with a as (
    select x.lecture, x.tier,
           case x.grade when 'got' then 1.0 when 'partly' then 0.5 else 0.0 end as pts,
           power(0.85, max(x.round) over (partition by x.lecture) - x.round) as recency
    from public.exercise_attempts x
    where x.user_id = auth.uid() and x.grade is not null
  )
  select a.lecture, count(*)::int, round(sum(a.pts * a.tier * a.recency) / sum(a.tier * a.recency), 4)
  from a
  group by a.lecture
$$;

revoke execute on function public.exercise_scores() from public;
grant execute on function public.exercise_scores() to authenticated;
