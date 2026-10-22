// Little ink doodles for the topic cards.
const ink = {
  stroke: "var(--edge)",
  strokeWidth: 3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ContractDoodle() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" {...ink}>
      <path d="M14 10C26 8 40 9 50 11C49 26 50 42 52 54C40 56 26 55 13 53C15 40 15 24 14 10Z" fill="var(--goose)" />
      <path d="M21 22C28 21 36 22 43 21M21 31C27 30 33 31 38 30" fill="none" strokeWidth="2.2" />
      <path d="M22 43C25 46 27 48 29 49C33 43 38 38 44 34" fill="none" stroke="var(--fence)" strokeWidth="4" />
    </svg>
  );
}

export function PointerDoodle() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" {...ink}>
      <path d="M7 24C14 23 20 24 25 25C25 31 25 36 24 41C18 42 12 41 7 40C8 35 8 29 7 24Z" fill="var(--goose)" />
      <circle cx="16" cy="32" r="3" fill="var(--ink)" />
      <path d="M17 32C26 20 38 18 46 24" fill="none" />
      <path d="M40 19C43 22 46 24 47 25C44 27 42 29 40 31" fill="none" />
      <path d="M38 34C45 33 52 34 58 35C58 42 57 49 58 55C51 56 44 55 37 55C38 48 38 41 38 34Z" fill="var(--beak)" />
    </svg>
  );
}

export function TreeDoodle() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" {...ink}>
      <path d="M32 18C25 28 19 36 15 44M32 18C38 28 44 36 49 44M15 44C12 50 10 54 9 57M15 44C18 50 21 54 23 57" fill="none" />
      <circle cx="32" cy="14" r="7" fill="var(--fence)" />
      <circle cx="15" cy="44" r="6" fill="var(--goose)" />
      <circle cx="49" cy="44" r="6" fill="var(--goose)" />
      <circle cx="9" cy="57" r="4" fill="var(--beak)" />
      <circle cx="23" cy="57" r="4" fill="var(--beak)" />
    </svg>
  );
}

export function EggDoodle() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" {...ink}>
      <path d="M32 6C42 6 49 20 50 33C51 47 43 57 32 58C21 57 13 47 14 33C15 20 22 6 32 6Z" fill="var(--goose)" />
      <path d="M15 34C20 30 23 36 27 31C31 27 34 35 38 30C42 26 45 33 49 31" fill="none" strokeWidth="2.5" />
      <path d="M25 21C28 19 30 22 28 24" fill="none" strokeWidth="2.2" />
      <circle cx="27" cy="23" r="1.6" fill="var(--ink)" stroke="none" />
      <path d="M33 22C38 22 42 24 44 26C40 28 36 28 33 27Z" fill="var(--beak)" strokeWidth="2.2" />
    </svg>
  );
}
