-- Access tiers: who may open which lecture.
--   audit  signed out: the Lecture 1 lesson only
--   guest  signed in with a non-CMU account: Lectures 1-3, lessons and exercises
--   cmu    signed in with a confirmed andrew.cmu.edu, cmu.edu or alumni.cmu.edu email: every lecture, subject to unlock dates
-- src/lib/access.ts mirrors the one public rule (Lecture 1 lesson) so that page never needs the database.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

-- Server-side settings no client can read. Optional: setting CMU's tenant id makes CMU status
-- also require that CMU's own Microsoft tenant signed the account in:
--   insert into private.settings values ('cmu_tenant_id', '<tenant id>');
-- The id is the GUID in the "issuer" of https://login.microsoftonline.com/cmu.edu/v2.0/.well-known/openid-configuration
create table if not exists private.settings (
  key text primary key,
  value text not null
);
revoke all on private.settings from public, anon, authenticated;

-- Optional dates before which a lecture stays locked for CMU students. Edit in the SQL editor.
create table if not exists public.lecture_unlocks (
  n int primary key check (n between 1 and 26),
  cmu_unlock_at timestamptz not null
);
alter table public.lecture_unlocks enable row level security;
create policy "Unlock dates are public" on public.lecture_unlocks for select using (true);

-- The caller's tier. CMU status needs a Microsoft sign-in whose email is on a CMU domain and
-- confirmed by Supabase Auth. It reads auth.identities and auth.users, which only Supabase Auth
-- writes, never user_metadata, which a user can change for themselves. When cmu_tenant_id is set,
-- the issuer must also be CMU's tenant, since any tenant can put an unverified CMU address on an account.
create or replace function public.access_tier()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when auth.uid() is null then 'audit'
    when coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) then 'audit'
    when exists (
      select 1
      from auth.identities i
      join auth.users u on u.id = i.user_id
      left join private.settings s on s.key = 'cmu_tenant_id'
      where i.user_id = auth.uid()
        and i.provider = 'azure'
        and u.email_confirmed_at is not null
        and lower(u.email) = lower(i.identity_data ->> 'email')
        and lower(split_part(i.identity_data ->> 'email', '@', 2)) in ('andrew.cmu.edu', 'cmu.edu', 'alumni.cmu.edu')
        and (s.value is null
          or lower(i.identity_data ->> 'iss') = lower('https://login.microsoftonline.com/' || s.value || '/v2.0'))
    ) then 'cmu'
    else 'guest'
  end
$$;

-- Whether the caller may open one part ('lesson' or 'exercises') of a lecture.
-- Every later table and storage policy for gated content goes through this function.
create or replace function public.can_access(lecture int, part text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select part in ('lesson', 'exercises') and case public.access_tier()
    when 'audit' then lecture = 1 and part = 'lesson'
    when 'guest' then lecture between 1 and 3
    when 'cmu' then lecture between 1 and 26 and not exists (
      select 1 from public.lecture_unlocks u where u.n = lecture and u.cmu_unlock_at > now()
    )
    else false
  end
$$;

revoke execute on function public.access_tier() from public;
revoke execute on function public.can_access(int, text) from public;
grant execute on function public.access_tier() to anon, authenticated;
grant execute on function public.can_access(int, text) to anon, authenticated;
