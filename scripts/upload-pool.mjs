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

import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

const [lectureArg, dir, flag, list] = process.argv.slice(2);
const replace = new Set(flag === "--replace" && list ? list.split(",") : []);
const lecture = Number(lectureArg);
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!Number.isInteger(lecture) || lecture < 1 || lecture > 26 || !dir || !url || !key || (flag && !replace.size)) {
  console.error("Usage: NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/upload-pool.mjs <lecture> <folder> [--replace q01.png,...]");
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

for (const file of replace) {
  if (!manifest.some((q) => q.question === file)) throw new Error(`${file}: not in manifest.json`);
}

let added = 0;
let replaced = 0;
for (const q of manifest) {
  if (![1, 2, 3].includes(q.tier) || !q.question || !q.answer) throw new Error(`Bad entry: ${JSON.stringify(q)}`);
  const source = `${prefix}/${q.question}`;
  const { data: existing } = await supabase
    .from("exercise_questions")
    .select("id, question_path, answer_path")
    .eq("source", source)
    .maybeSingle();
  if (existing && replace.has(q.question)) {
    const row = {
      tier: q.tier,
      alt: q.alt ?? "",
      question_path: await upload(q.question),
      answer_path: await upload(q.answer),
    };
    const { error } = await supabase.from("exercise_questions").update(row).eq("id", existing.id);
    if (error) throw new Error(`${q.question}: ${error.message}`);
    await supabase.storage.from("exercises").remove([existing.question_path, existing.answer_path]);
    replaced++;
    continue;
  }
  if (existing) continue;
  const row = {
    lecture,
    tier: q.tier,
    alt: q.alt ?? "",
    source,
    question_path: await upload(q.question),
    answer_path: await upload(q.answer),
  };
  const { error } = await supabase.from("exercise_questions").insert(row);
  if (error) throw new Error(`${q.question}: ${error.message}`);
  added++;
}
console.log(`Lecture ${lecture}: added ${added} of ${manifest.length} questions.`);
if (replace.size) console.log(`Lecture ${lecture}: replaced ${replaced} of ${replace.size} listed questions.`);
