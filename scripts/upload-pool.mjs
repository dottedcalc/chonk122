// Uploads one lecture's exercise pool to the private "exercises" bucket and lists it in
// public.exercise_questions. Run it from your own machine, never from the deployed site:
//
//   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/upload-pool.mjs 1 ~/pools/L01
//
// The folder holds the images and a manifest.json such as
//   [{ "question": "q01.png", "answer": "a01.png", "tier": 1, "alt": "Short description" }, ...]
// Keep pools out of this repository: anything committed here is public.
// Files get random names in storage, so a link reveals neither its tier nor its answer.
// Questions already uploaded (same lecture and question file) are skipped. To swap in rebuilt
// images for questions that are already uploaded, list their question files after --replace:
//
//   node scripts/upload-pool.mjs 3 ~/pools/L03 --replace q08.png,q16.png
//
// Each replaced question keeps its row, gets new images, tier and alt, and its old images are deleted.
//
// --sync makes the database match the folder without a list. It adds new questions, replaces any
// question whose images differ from the stored ones (compared by SHA-256), updates a changed tier
// or alt in place, and turns off questions that left the manifest (active = false, so students'
// attempts and scores stay). A question that comes back is turned on again. Add --dry-run to
// print what would change without changing anything.
//
//   node scripts/upload-pool.mjs 1 ~/pools/L01 --sync --dry-run

import { createClient } from "@supabase/supabase-js";
import { createHash, randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

const args = process.argv.slice(2);
const [lectureArg, dir] = args;
const flags = args.slice(2);
const sync = flags.includes("--sync");
const dryRun = flags.includes("--dry-run");
const replaceAt = flags.indexOf("--replace");
const replace = new Set(replaceAt >= 0 && flags[replaceAt + 1] ? flags[replaceAt + 1].split(",") : []);
const known = flags.every((f, i) => ["--sync", "--dry-run", "--replace"].includes(f) || flags[i - 1] === "--replace");
const lecture = Number(lectureArg);
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (
  !Number.isInteger(lecture) || lecture < 1 || lecture > 26 || !dir || !url || !key || !known ||
  (replaceAt >= 0 && !replace.size) || (sync && replace.size) || (dryRun && !sync)
) {
  console.error(
    "Usage: NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/upload-pool.mjs <lecture> <folder> [--replace q01.png,... | --sync [--dry-run]]",
  );
  process.exit(1);
}

const types = { ".png": "image/png", ".webp": "image/webp" };
const supabase = createClient(url, key, { auth: { persistSession: false } });
const manifest = JSON.parse(await readFile(path.join(dir, "manifest.json"), "utf8"));
const prefix = `L${String(lecture).padStart(2, "0")}`;

async function upload(file) {
  const type = types[path.extname(file).toLowerCase()];
  if (!type) throw new Error(`${file}: only .png and .webp are allowed`);
  const name = `${prefix}/${randomUUID()}${path.extname(file).toLowerCase()}`;
  const { error } = await supabase.storage
    .from("exercises")
    .upload(name, await readFile(path.join(dir, file)), { contentType: type });
  if (error) throw new Error(`${file}: ${error.message}`);
  return name;
}

const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");

// True when the local file and the stored object hold the same bytes.
async function same(file, stored) {
  const { data, error } = await supabase.storage.from("exercises").download(stored);
  if (error) return false;
  return sha(Buffer.from(await data.arrayBuffer())) === sha(await readFile(path.join(dir, file)));
}

for (const q of manifest) {
  if (![1, 2, 3].includes(q.tier) || !q.question || !q.answer) throw new Error(`Bad entry: ${JSON.stringify(q)}`);
}
for (const file of replace) {
  if (!manifest.some((q) => q.question === file)) throw new Error(`${file}: not in manifest.json`);
}

const { data: rows, error: listError } = await supabase
  .from("exercise_questions")
  .select("id, source, tier, alt, active, question_path, answer_path")
  .eq("lecture", lecture);
if (listError) throw new Error(listError.message);
const bySource = new Map(rows.map((r) => [r.source, r]));

let added = 0;
let replaced = 0;
let updated = 0;
let removed = 0;
const say = (verb, file) => dryRun && console.log(`${verb} ${file}`);

for (const q of manifest) {
  const source = `${prefix}/${q.question}`;
  const alt = q.alt ?? "";
  const existing = bySource.get(source);

  if (!existing) {
    say("add", q.question);
    if (!dryRun) {
      const row = {
        lecture,
        tier: q.tier,
        alt,
        source,
        question_path: await upload(q.question),
        answer_path: await upload(q.answer),
      };
      const { error } = await supabase.from("exercise_questions").insert(row);
      if (error) throw new Error(`${q.question}: ${error.message}`);
    }
    added++;
    continue;
  }

  const changedImages = sync
    ? !(await same(q.question, existing.question_path)) || !(await same(q.answer, existing.answer_path))
    : replace.has(q.question);
  if (changedImages) {
    say("replace", q.question);
    if (!dryRun) {
      const row = {
        tier: q.tier,
        alt,
        active: true,
        question_path: await upload(q.question),
        answer_path: await upload(q.answer),
      };
      const { error } = await supabase.from("exercise_questions").update(row).eq("id", existing.id);
      if (error) throw new Error(`${q.question}: ${error.message}`);
      await supabase.storage.from("exercises").remove([existing.question_path, existing.answer_path]);
    }
    replaced++;
    continue;
  }

  if (sync && (existing.tier !== q.tier || existing.alt !== alt || !existing.active)) {
    say("update", q.question);
    if (!dryRun) {
      const { error } = await supabase
        .from("exercise_questions")
        .update({ tier: q.tier, alt, active: true })
        .eq("id", existing.id);
      if (error) throw new Error(`${q.question}: ${error.message}`);
    }
    updated++;
  }
}

if (sync) {
  const inManifest = new Set(manifest.map((q) => `${prefix}/${q.question}`));
  for (const r of rows) {
    if (!r.active || inManifest.has(r.source)) continue;
    say("turn off", r.source);
    if (!dryRun) {
      const { error } = await supabase.from("exercise_questions").update({ active: false }).eq("id", r.id);
      if (error) throw new Error(`${r.source}: ${error.message}`);
    }
    removed++;
  }
}

const would = dryRun ? "would have " : "";
console.log(`Lecture ${lecture}: ${would}added ${added} of ${manifest.length} questions.`);
if (replace.size) console.log(`Lecture ${lecture}: replaced ${replaced} of ${replace.size} listed questions.`);
if (sync) {
  console.log(`Lecture ${lecture}: ${would}replaced ${replaced}, updated ${updated} and turned off ${removed} questions.`);
}
