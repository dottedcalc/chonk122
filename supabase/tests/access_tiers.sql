-- Tests public.access_tier() and public.can_access() against real and lookalike CMU emails.
-- Runs on a throwaway Postgres, never on the Supabase project, because it creates stand-ins
-- for the auth schema that Supabase Auth owns:
--   createdb tier_test && psql -v ON_ERROR_STOP=1 -d tier_test -f supabase/tests/access_tiers.sql
-- It loads the migrations that define these functions from supabase/migrations.

do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated nologin; end if;
end $$;
create schema auth;
create table auth.users (id uuid primary key, email text, email_confirmed_at timestamptz);
create table auth.identities (user_id uuid references auth.users, provider text, identity_data jsonb);
create function auth.uid() returns uuid language sql stable as
  $$ select nullif(current_setting('test.uid', true), '')::uuid $$;
create function auth.jwt() returns jsonb language sql stable as
  $$ select coalesce(nullif(current_setting('test.jwt', true), ''), '{}')::jsonb $$;

\ir ../migrations/20261023000001_access_tiers.sql
\ir ../migrations/20261023000005_strict_cmu_email.sql

\set cmu 'https://login.microsoftonline.com/e36ee38f-91b8-4dca-9b13-caa5360c9714/v2.0'
\set other 'https://login.microsoftonline.com/11111111-2222-3333-4444-555555555555/v2.0'

create temp table cases (
  name text, email text, users_email text, provider text, confirmed boolean, iss text,
  anonymous boolean, want_open text, want_tenant text
);
-- want_open is the tier with no cmu_tenant_id set, want_tenant the tier once it is set.
insert into cases values
  ('Andrew ID', 'kenneth4@andrew.cmu.edu', null, 'azure', true, :'cmu', false, 'cmu', 'cmu'),
  ('Andrew ID in capitals', 'Kenneth4@ANDREW.CMU.EDU', null, 'azure', true, :'cmu', false, 'cmu', 'cmu'),
  ('cmu.edu staff address', 'prof@cmu.edu', null, 'azure', true, :'cmu', false, 'cmu', 'cmu'),
  ('alumni address', 'old@alumni.cmu.edu', null, 'azure', true, :'cmu', false, 'cmu', 'cmu'),
  ('Gmail', 'kenneth4@gmail.com', null, 'azure', true, :'other', false, 'guest', 'guest'),
  ('Outlook', 'kenneth4@outlook.com', null, 'azure', true, 'https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0', false, 'guest', 'guest'),
  ('Pitt', 'abc12@pitt.edu', null, 'azure', true, :'other', false, 'guest', 'guest'),
  ('CMU domain as a prefix', 'x@andrew.cmu.edu.evil.com', null, 'azure', true, :'other', false, 'guest', 'guest'),
  ('CMU domain as a suffix', 'x@evilandrew.cmu.edu', null, 'azure', true, :'other', false, 'guest', 'guest'),
  ('hyphen for a dot', 'x@andrew-cmu.edu', null, 'azure', true, :'other', false, 'guest', 'guest'),
  ('cmu.edu.co', 'x@cmu.edu.co', null, 'azure', true, :'other', false, 'guest', 'guest'),
  ('cmu.com', 'x@cmu.com', null, 'azure', true, :'other', false, 'guest', 'guest'),
  ('trailing dot', 'x@andrew.cmu.edu.', null, 'azure', true, :'other', false, 'guest', 'guest'),
  ('trailing space', 'x@andrew.cmu.edu ', null, 'azure', true, :'other', false, 'guest', 'guest'),
  ('Cyrillic a in andrew', 'x@аndrew.cmu.edu', null, 'azure', true, :'other', false, 'guest', 'guest'),
  ('subdomain of andrew', 'x@cs.andrew.cmu.edu', null, 'azure', true, :'other', false, 'guest', 'guest'),
  ('CMU domain in the middle', 'x@andrew.cmu.edu@evil.com', null, 'azure', true, :'other', false, 'guest', 'guest'),
  ('quoted local part', '"x@andrew.cmu.edu"@evil.com', null, 'azure', true, :'other', false, 'guest', 'guest'),
  ('no local part', '@andrew.cmu.edu', null, 'azure', true, :'other', false, 'guest', 'guest'),
  ('Andrew ID from another tenant', 'kenneth4@andrew.cmu.edu', null, 'azure', true, :'other', false, 'cmu', 'guest'),
  ('Andrew ID with no issuer', 'kenneth4@andrew.cmu.edu', null, 'azure', true, null, false, 'cmu', 'guest'),
  ('Andrew ID from a non-Microsoft provider', 'kenneth4@andrew.cmu.edu', null, 'google', true, :'cmu', false, 'guest', 'guest'),
  ('unconfirmed Andrew ID', 'kenneth4@andrew.cmu.edu', null, 'azure', false, :'cmu', false, 'guest', 'guest'),
  ('account email differs from the Microsoft email', 'kenneth4@andrew.cmu.edu', 'kenneth4@gmail.com', 'azure', true, :'cmu', false, 'guest', 'guest'),
  ('anonymous session', 'kenneth4@andrew.cmu.edu', null, 'azure', true, :'cmu', true, 'audit', 'audit'),
  ('signed out', null, null, null, null, null, false, 'audit', 'audit');

create temp table results (name text, mode text, want text, got text, l1 boolean, l2 boolean, l4 boolean);

do $$
declare
  c record;
  m text;
  uid uuid;
begin
  foreach m in array array['open', 'tenant'] loop
    delete from private.settings;
    if m = 'tenant' then
      insert into private.settings values ('cmu_tenant_id', 'e36ee38f-91b8-4dca-9b13-caa5360c9714');
    end if;
    for c in select * from cases loop
      delete from auth.identities;
      delete from auth.users;
      uid := null;
      if c.email is not null then
        uid := gen_random_uuid();
        insert into auth.users values (uid, coalesce(c.users_email, c.email), case when c.confirmed then now() end);
        insert into auth.identities values (uid, c.provider,
          jsonb_strip_nulls(jsonb_build_object('email', c.email, 'iss', c.iss)));
      end if;
      perform set_config('test.uid', coalesce(uid::text, ''), false);
      perform set_config('test.jwt', jsonb_build_object('is_anonymous', c.anonymous)::text, false);
      insert into results values (c.name, m, case m when 'open' then c.want_open else c.want_tenant end,
        public.access_tier(), public.can_access(1, 'exercises'), public.can_access(2, 'lesson'),
        public.can_access(4, 'lesson'));
    end loop;
  end loop;
end $$;

select case when want = got then 'ok' else 'FAIL' end as result, mode, name, want, got,
  l1 as l1_exercises, l2 as l2_lesson, l4 as l4_lesson
from results order by mode, result, name;

do $$
begin
  if exists (select 1 from results where want <> got) then raise exception 'access tier tests failed'; end if;
  -- Tiers must open the lectures they promise and nothing more.
  if exists (select 1 from results where got = 'audit' and (l1 or l2 or l4))
    or exists (select 1 from results where got = 'guest' and not (l1 and l2 and not l4))
    or exists (select 1 from results where got = 'cmu' and not (l1 and l2 and l4)) then
    raise exception 'can_access opened the wrong lectures';
  end if;
end $$;
