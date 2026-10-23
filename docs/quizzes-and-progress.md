# Quizzes and progress: architecture

Built in small PRs. Each section says which PR adds it.

## Rules every module follows

- **The database is the gate.** Access, progress and exercises are checked in Postgres
  (row-level security and `security definer` functions), not only in page code. A request that
  skips the website and talks to Supabase directly gets the same answer.
- **Fail closed.** If the database can't answer, only the public Lecture 1 lesson opens.
- **No trust in what users can edit.** Tiers come from `auth.identities` (written by Supabase
  Auth), never from `user_metadata`, which users can change themselves.
- **No service-role key in the app.** Everything runs as the signed-in user, so a bug in page code
  can't reach other users' rows.
- **Gated content is never prebuilt or bundled.** Lesson pages render per request, and
  `src/lib/lessons` imports `server-only`, so lesson content can't end up in public JavaScript.

## 1. Access tiers (PR 1)

| Tier | Who | Opens |
| --- | --- | --- |
| audit | signed out | Lecture 1 lesson |
| guest | any other Microsoft account | Lectures 1 to 3, lessons and exercises |
| cmu | a Microsoft sign-in with a confirmed andrew.cmu.edu, cmu.edu or alumni.cmu.edu email | Lectures 1 to 26, after any unlock date |

- `public.access_tier()` and `public.can_access(lecture, part)` in
  `supabase/migrations/20261023000001_access_tiers.sql` hold the rules.
- CMU status checks the email domain on the Microsoft identity and that Supabase Auth confirmed
  the email. Optionally, setting `cmu_tenant_id` in `private.settings` also requires CMU's own
  tenant, which closes the gap of another tenant putting an unverified CMU address on an account.
- `public.lecture_unlocks` holds optional per-lecture dates for CMU students.
- `src/lib/access.ts` asks the database and returns why a lecture is locked;
  `src/components/Locked.tsx` shows that instead of the content.

## 2. Lesson progress and the lectures dashboard (PR 2)

- `lesson_progress(user_id, lecture, pages_read, page_count, completed_at)`, own rows only,
  writes allowed only where `can_access(lecture, 'lesson')`.
- The lesson player saves the furthest page as you go when signed in (server action
  `saveLessonPage`, which checks the page against the real lesson) and resumes there.
- `lecture_access()` returns what the viewer may open in all 26 lectures in one call, for display.
- `/lectures`: one card per lecture with your difficulty rating (1 blue to 5 red), lock state,
  lesson progress and proficiency. The course map stays a short summary and links here.
- Reset a lecture clears its lesson progress and its exercises.

## 3. Exercises (PR 3)

- Each lecture has a pool of 20 to 30 independent questions in tiers 1 to 3 (tiers are hidden).
- Question and answer images live in a **private** Supabase Storage bucket. Storage policies let
  a user create a short-lived signed link to a question only once it was served to them in a
  round, and to its answer only after they revealed it.
- `exercise_questions` (pool, not readable by users), `exercise_attempts` (own rows),
  `exercise_state` (current tier per lecture).
- `start_round(lecture)`: checks `can_access(lecture, 'exercises')`, then serves 4 questions the
  user has never seen, at their current tier, filling from nearby tiers when one runs low. When
  none are left the lecture's exercises are finished.
- `reveal(attempt)` then `report(attempt, grade)` with grade got it / partly / missed; a report
  is only accepted after the reveal.
- Adaptive: after a round, 75% or better moves up a tier and under 50% moves down
  (got it = 1, partly = 0.5).
- Reset exercises clears a lecture's attempts and tier, so its pool can be served again.

## 4. Proficiency and big ideas (PR 4)

Lecture proficiency, 0 to 100: 25% lesson completion plus 75% exercise score, where tier 2 counts
twice and tier 3 three times as much as tier 1, and later rounds count more than earlier ones.

The five big ideas come from the course syllabus's learning objectives (computational thinking,
programming skills, algorithms and data structures). Each of the course map's 12 ideas maps to
one, and a big idea's score averages the lectures that teach it.

| Big idea | Syllabus objectives | Course map ideas |
| --- | --- | --- |
| Contracts and correctness | contracts, correctness and safety proofs, termination, loop invariants | Contracts, Invariants |
| Complexity and efficiency | big-O, worst-case, average-case and amortized analysis | Complexity |
| Algorithmic strategies | order, divide and conquer, randomness, searching, sorting, hashing, graphs | Order, Divide & conquer, Randomness |
| Abstraction and interfaces | specification vs. implementation, interfaces, data structure invariants, generic data structures | Abstraction & modularity, Design trade-offs |
| Programming in C0 and C | integers as bits, pointers, memory, undefined behavior, compiling and testing in Unix | Data representation, Memory, Safety & undefined behavior, Running programs |

`/progress` shows the five scores and each lecture's share.

## 5. Question pools (PR 5 onwards)

Pools are written with the 15-122 checkin skill, rendered to images, uploaded to the private
bucket, and listed in `exercise_questions` by a migration. Lecture 1 comes first.

## Setup after each migration

Run new files in `supabase/migrations` in order (Supabase SQL editor or `supabase db push`).
Optionally, after PR 1, set CMU's tenant id to make CMU status stricter:

```sql
insert into private.settings values ('cmu_tenant_id', '<tenant id>');
```

The tenant id is the GUID inside `issuer` at
https://login.microsoftonline.com/cmu.edu/v2.0/.well-known/openid-configuration.
