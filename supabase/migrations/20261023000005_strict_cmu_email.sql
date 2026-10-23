-- Match the whole CMU email, not just the text after its first @. split_part() saw
-- 'x@andrew.cmu.edu@evil.com' as an andrew.cmu.edu address, and '@andrew.cmu.edu' passed with no
-- name at all. Now the address must be one name, one @ and exactly a CMU domain.
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
        and lower(i.identity_data ->> 'email') ~ '^[a-z0-9._%+-]+@(andrew\.cmu\.edu|cmu\.edu|alumni\.cmu\.edu)$'
        and (s.value is null
          or lower(i.identity_data ->> 'iss') = lower('https://login.microsoftonline.com/' || s.value || '/v2.0'))
    ) then 'cmu'
    else 'guest'
  end
$$;

revoke execute on function public.access_tier() from public;
grant execute on function public.access_tier() to anon, authenticated;
