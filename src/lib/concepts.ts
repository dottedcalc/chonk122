// Lecture concept map for 15-122: five big ideas, three parts, Lectures 1–26.

export type IdeaId =
  | "con" | "ptr" | "inv" | "spec" | "test"
  | "rep" | "mem" | "ptrs" | "adv"
  | "dc" | "ord" | "cost" | "amort" | "tree"
  | "mod" | "abs" | "client" | "work" | "gen"
  | "toc" | "impl" | "eq";

export type Idea = { id: IdeaId; name: string };

// question is the enduring understanding; specifics are trusted static HTML that uses only <code>.
export type Category = { id: 1 | 2 | 3 | 4 | 5; name: string; question: string; specifics: string[]; ideas: Idea[] };

export type Part = { name: string; from: number; to: number; band: "p1" | "p2" | "p3" };

export type Lecture = { n: number; title: string; ideas: IdeaId[] };

// The five big ideas, each opened by its enduring understanding.
export const categories: Category[] = [
  {
    id: 1,
    name: "Contracts and invariants",
    question: "A correct program is one you can prove correct, and contracts and invariants are the tools that make that proof possible.",
    specifics: [
      "A contract states what a function needs and what it promises. The precondition (<code>//@requires</code>) limits the inputs the function accepts, and the postcondition (<code>//@ensures</code>) describes the result it must return. (Lecture 1)",
      "A loop invariant is a statement that is true every time the loop guard is checked. You prove it in four steps. You show it holds initially, show that each iteration preserves it, show that it implies the postcondition when the loop exits, and show that the loop terminates. (Lectures 1, 4 and 6)",
      "Point-to reasoning is preferred over operational reasoning. Point-to reasoning justifies a claim by pointing to specific lines, such as a precondition, a loop invariant or a loop guard, that make it true. Operational reasoning traces what the code does step by step, which is easy to get wrong and hard to check. A good proof cites line numbers instead of walking through examples. (Lecture 1)",
      "A data structure invariant describes what a valid structure looks like. Sorted arrays, stacks, binary search trees, AVL heights and heaps all have invariants that every operation must keep true. Libraries check these invariants so that clients never see a broken structure. (Lectures 4, 9 to 16, 25 and 26)",
      "Specification functions make contracts readable and checkable. The <code>arrayutil</code> library gives helpers such as <code>is_in</code>, <code>is_sorted</code>, <code>lt_seg</code> and <code>ge_seg</code>, which state facts about an array segment in one call. You use them in preconditions, postconditions and loop invariants, and you cite them in proofs. Later data structures follow the same pattern with checkers such as <code>is_bst</code> and <code>is_heap</code>. (Lectures 4 to 7, 15 and 26)",
      "The strength of a contract matters. A contract that is too weak lets incorrect code pass, so you should test functions with inputs designed to expose that weakness. (Lectures 4 to 6)",
    ],
    ideas: [
      { id: "con", name: "Contracts" },
      { id: "ptr", name: "Point-to reasoning" },
      { id: "inv", name: "Invariants" },
      { id: "spec", name: "Specification functions" },
      { id: "test", name: "Contract strength and testing" },
    ],
  },
  {
    id: 2,
    name: "Data and memory",
    question: "Every value a program uses is stored as bits at a location in memory, and you must be able to picture exactly what is stored and where.",
    specifics: [
      "Integers are stored in two's complement, so arithmetic wraps around on overflow according to modular arithmetic. Bitwise operations let you manipulate individual bits directly. (Lecture 2)",
      "Arrays live in the heap and are reached through their addresses. When two variables hold the same address, they are aliases, and a change made through one is visible through the other. (Lecture 3)",
      "Structs group fields of different types, and pointers let you link structs together into lists and trees. A NULL pointer refers to nothing, and following it is an error. (Lectures 8 to 10)",
      "Function pointers treat code itself as data that can be stored and passed around. The C0VM shows that a whole program is stored as bytecode in memory. (Lectures 14, 18 and 20)",
    ],
    ideas: [
      { id: "rep", name: "Data representation" },
      { id: "mem", name: "Memory" },
      { id: "ptrs", name: "Structs and pointers" },
      { id: "adv", name: "Advanced memory" },
    ],
  },
  {
    id: 3,
    name: "Algorithms and their cost",
    question: "Every algorithm has a cost, and choosing the right strategy and data structure can turn a slow solution into a fast one.",
    specifics: [
      "Big O notation describes how running time grows as the input grows, and it ignores constant factors. You should know the difference between worst case, average case and amortized cost. (Lecture 5)",
      "Divide and conquer splits a problem in half, solves the halves and combines the results. Binary search, mergesort and quicksort all use this idea. (Lectures 6 and 7)",
      "Order and randomness both make algorithms faster. Sorted data lets binary search run in O(log n). Random pivots make quicksort fast on average, and hash functions spread keys evenly across a table. (Lectures 4, 7 and 12)",
      "Amortized analysis averages the cost of operations over a long sequence. An unbounded array doubles its size when full, so even though one insertion can be expensive, each insertion costs O(1) on average. (Lecture 11)",
      "Trees and graphs organize data so that searching stays fast. Balanced trees such as AVL trees and heaps keep their height at O(log n), and graph algorithms such as depth first search, breadth first search and Kruskal's algorithm find paths and spanning trees. (Lectures 15, 16 and 21 to 25)",
    ],
    ideas: [
      { id: "dc", name: "Divide and conquer" },
      { id: "ord", name: "Order and randomness" },
      { id: "cost", name: "Complexity and trade offs" },
      { id: "amort", name: "Amortized analysis" },
      { id: "tree", name: "Trees and graphs" },
    ],
  },
  {
    id: 4,
    name: "Abstraction and modular design",
    question: "Large programs stay manageable when each piece hides its details behind an interface that other code can rely on.",
    specifics: [
      "Deliberate programming means building small pieces of code and guaranteeing that each one is correct before combining them. (Lecture 4)",
      "A library offers an interface to its clients and keeps its implementation hidden. Because clients use only the interface, the implementation can change at any time without breaking them. (Lectures 8 and 9)",
      "Client functions let the client customize a library. A hash dictionary asks the client for functions that hash and compare keys, and a priority queue asks for a function that compares priorities. (Lectures 13 and 25)",
      "Worklists such as stacks, queues and priority queues share one interface but differ in which element they remove next. Swapping one worklist for another turns depth first search into breadth first search. (Lectures 9, 22 and 25)",
      "Generic types let one library work with many types of data. A <code>void *</code> pointer can hold any pointer, and you cast it back to its real type before using it. In C, you can also cast between number types. (Lectures 13, 14 and 19)",
    ],
    ideas: [
      { id: "mod", name: "Deliberate programming" },
      { id: "abs", name: "Libraries and interfaces" },
      { id: "client", name: "Client functions" },
      { id: "work", name: "Worklists" },
      { id: "gen", name: "Generics and casting" },
    ],
  },
  {
    id: 5,
    name: "From C0 to C",
    question: "C gives you full control over the machine, but it takes away the safety net that C0 provided, so you must keep every invariant yourself.",
    specifics: [
      "C uses a preprocessor for macros, header files and conditional compilation. Contracts become optional macros such as <code>REQUIRES</code> and <code>ENSURES</code> that only run in debug mode. (Lecture 17)",
      "C has no garbage collector. Every block of memory you allocate must be freed exactly once, and reading freed or uninitialized memory is undefined behavior. (Lectures 17 and 18)",
      "C does not check array bounds, and signed overflow is undefined. The sizes of types depend on the implementation, so careful code uses fixed size types and explicit casts. (Lectures 18 and 19)",
      "A program can be compiled, interpreted or run on a virtual machine. The C0VM runs bytecode using an operand stack, local variables and call frames. (Lecture 20)",
      "The data structures from earlier in the course are rebuilt in C. Union find groups vertices into equivalence classes for Kruskal's algorithm, and heaps are stored in arrays with their invariants temporarily broken and then restored. (Lectures 21 to 26)",
    ],
    ideas: [
      { id: "toc", name: "Transition to C" },
      { id: "impl", name: "Implementation techniques" },
      { id: "eq", name: "Equivalence classes" },
    ],
  },
];

export const parts: Part[] = [
  { name: "Deliberate programming", from: 1, to: 7, band: "p1" },
  { name: "Data structures", from: 8, to: 16, band: "p2" },
  { name: "Transition to C", from: 17, to: 26, band: "p3" },
];

export const lectures: Lecture[] = [
  {
    n: 1,
    title: "Contracts",
    ideas: ["con", "ptr", "inv"],
  },
  {
    n: 2,
    title: "Ints",
    ideas: ["rep"],
  },
  {
    n: 3,
    title: "Arrays",
    ideas: ["mem", "rep"],
  },
  {
    n: 4,
    title: "Searching arrays",
    ideas: ["mod", "con", "ord", "spec", "test"],
  },
  {
    n: 5,
    title: "Big-O",
    ideas: ["cost", "spec", "con"],
  },
  {
    n: 6,
    title: "Binary search",
    ideas: ["dc", "ord", "inv", "ptr", "test"],
  },
  {
    n: 7,
    title: "Quicksort",
    ideas: ["dc", "ord", "cost", "spec"],
  },
  {
    n: 8,
    title: "Libraries",
    ideas: ["abs", "ptrs", "inv"],
  },
  {
    n: 9,
    title: "Stacks and queues",
    ideas: ["abs", "work", "client"],
  },
  {
    n: 10,
    title: "Linked lists",
    ideas: ["ptrs", "inv", "cost"],
  },
  {
    n: 11,
    title: "Unbounded arrays",
    ideas: ["amort", "cost", "inv"],
  },
  {
    n: 12,
    title: "Hashing",
    ideas: ["ord", "cost", "amort", "abs"],
  },
  {
    n: 13,
    title: "Hash dictionaries",
    ideas: ["client", "gen", "abs"],
  },
  {
    n: 14,
    title: "Generic data structures",
    ideas: ["gen", "adv"],
  },
  {
    n: 15,
    title: "Binary search trees",
    ideas: ["tree", "inv", "ord", "spec"],
  },
  {
    n: 16,
    title: "AVL trees",
    ideas: ["tree", "inv", "cost"],
  },
  {
    n: 17,
    title: "Introduction to C",
    ideas: ["toc", "con", "mem"],
  },
  {
    n: 18,
    title: "C's memory model",
    ideas: ["toc", "mem"],
  },
  {
    n: 19,
    title: "Types in C",
    ideas: ["toc", "rep", "gen"],
  },
  {
    n: 20,
    title: "Virtual machines",
    ideas: ["impl", "adv", "rep"],
  },
  {
    n: 21,
    title: "Graph representation",
    ideas: ["tree", "cost", "abs", "impl"],
  },
  {
    n: 22,
    title: "Graph search",
    ideas: ["tree", "work"],
  },
  {
    n: 23,
    title: "Spanning trees",
    ideas: ["tree", "ord", "eq"],
  },
  {
    n: 24,
    title: "Union-find",
    ideas: ["eq", "impl", "cost"],
  },
  {
    n: 25,
    title: "Priority queues",
    ideas: ["work", "tree", "inv", "client"],
  },
  {
    n: 26,
    title: "Restoring invariants",
    ideas: ["inv", "spec", "impl"],
  },
];
