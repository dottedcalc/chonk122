import { redirect } from "next/navigation";

// Progress now lives on the course map.
export default function ProgressPage() {
  redirect("/concepts#progress");
}
