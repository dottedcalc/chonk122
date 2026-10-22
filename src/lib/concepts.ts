// Lecture concept map for 15-122: three big ideas, three parts, Lectures 1–26.
// Summaries are trusted static HTML that uses only <b> and <code>.

export type IdeaId = "con" | "inv" | "safe" | "cost" | "ord" | "dc" | "rand" | "trade" | "rep" | "mem" | "abs" | "run";

export type Idea = { id: IdeaId; name: string };

export type Category = { id: 1 | 2 | 3; name: string; question: string; ideas: Idea[] };

export type Part = { name: string; from: number; to: number; band: "p1" | "p2" | "p3" };

export type Lecture = { n: number; title: string; summary: string; ideas: IdeaId[] };

export const categories: Category[] = [
  {
    id: 1,
    name: "Reasoning & safety",
    question: "Is the code right, and is it safe to run?",
    ideas: [
      { id: "con", name: "Contracts" },
      { id: "inv", name: "Invariants" },
      { id: "safe", name: "Safety & undefined behavior" },
    ],
  },
  {
    id: 2,
    name: "Algorithms & trade-offs",
    question: "How fast is it, and what does it cost?",
    ideas: [
      { id: "cost", name: "Complexity" },
      { id: "ord", name: "Order" },
      { id: "dc", name: "Divide & conquer" },
      { id: "rand", name: "Randomness" },
      { id: "trade", name: "Design trade-offs" },
    ],
  },
  {
    id: 3,
    name: "Systems thinking",
    question: "How are data and code stored and run?",
    ideas: [
      { id: "rep", name: "Data representation" },
      { id: "mem", name: "Memory" },
      { id: "abs", name: "Abstraction & modularity" },
      { id: "run", name: "Running programs" },
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
    summary:
      "We are handed a mysterious function and decide what it must do before reading its code. A <b>precondition</b> (<code>requires</code>) restricts its valid inputs, and a <b>postcondition</b> (<code>ensures</code>) describes its result. Loops are hard to follow with <b>operational reasoning</b>, so a <b>loop invariant</b> states a fact that holds at the start of every iteration. <b>Point-to reasoning</b> turns these <b>contracts</b> into a <b>proof</b> that the code is correct.",
    ideas: ["con", "inv"],
  },
  {
    n: 2,
    title: "Ints",
    summary:
      "Computers store all <b>data</b> as binary digits, and place value tells us what each bit means. <b>Two's complement</b> is a design choice for representing negative numbers, and it makes <b>overflow</b> wrap around according to <b>modular arithmetic</b>. <b>Bit-level operations</b> let us pack values such as booleans compactly.",
    ideas: ["rep"],
  },
  {
    n: 3,
    title: "Arrays",
    summary:
      "After a single int, the next step is storing a group of them. An <b>array</b> lives in a simplified model of memory called the <b>heap</b>, and we reach it through its <b>address</b>. Two variables can hold the same address, which is called <b>aliasing</b>. Accessing an element outside the array is a <b>safety violation</b>.",
    ideas: ["mem", "safe", "inv"],
  },
  {
    n: 4,
    title: "Searching arrays",
    summary:
      "This lecture begins <b>deliberate programming</b>, where we build small pieces of code and guarantee that each one is correct. <b>Linear search</b> can stop early when the array is <b>sorted</b>, so <b>order</b> makes searching faster. The simple version then serves as the <b>specification</b> for the faster <b>implementation</b>.",
    ideas: ["con", "ord", "cost"],
  },
  {
    n: 5,
    title: "Big-O",
    summary:
      "<b>Big-O notation</b> compares algorithms by how their running time grows with the input. It ignores constant factors because those depend on system decisions such as the hardware. We build <b>selection sort</b> contract-first and use the <code>arrayutil</code> library to describe <b>array segments</b> in contracts.",
    ideas: ["cost", "con"],
  },
  {
    n: 6,
    title: "Binary search",
    summary:
      "In a sorted array, checking the middle element lets us discard half of what remains. This <b>divide-and-conquer</b> idea gives <b>binary search</b> a running time of <b>O(log n)</b>. Its indices are easy to get wrong, so we rely on careful <b>loop invariants</b> to prove it correct.",
    ideas: ["ord", "dc", "inv", "cost"],
  },
  {
    n: 7,
    title: "Quicksort",
    summary:
      "We apply divide and conquer to sorting using <b>recursion</b>. <b>Quicksort</b> is fast on average, but a bad <b>pivot</b> gives it a quadratic <b>worst case</b>. Choosing the pivot <b>randomly</b> makes that unlikely, and <b>mergesort</b> avoids the problem entirely.",
    ideas: ["dc", "cost", "ord", "rand"],
  },
  {
    n: 8,
    title: "Libraries",
    summary:
      "Code is hard to get right every time, so we rely on <b>libraries</b> and use them only through their <b>interface</b>, because the implementation can change at any time. <b>Structs</b> group values of different types and are how a library defines its data. A struct can be large and its size depends on its fields, so C0 never stores one in a <b>local variable</b>. It lives on the <b>heap</b>, the local variable holds only a <b>pointer</b> to it, and dereferencing <b>NULL</b> becomes a new kind of safety violation.",
    ideas: ["abs", "mem", "safe", "inv"],
  },
  {
    n: 9,
    title: "Stacks and queues",
    summary:
      "A <b>stack</b> removes the element that was added most recently (<b>LIFO</b>), and a <b>queue</b> removes the element that was added earliest (<b>FIFO</b>). Both are <b>worklists</b>, with <code>push</code> and <code>pop</code> for stacks and <code>enq</code> and <code>deq</code> for queues. We write <b>client code</b> for operations the interface does not provide, such as finding the size of a stack, using only the exported functions and their contracts. Code written this way works correctly with any implementation.",
    ideas: ["abs"],
  },
  {
    n: 10,
    title: "Linked lists",
    summary:
      "To add elements without a fixed size limit, we chain nodes together into a <b>linked list</b>. Design decisions matter here, such as whether adding at the front or at the end is more efficient. A list can contain a <b>cycle</b> or fail to end in NULL, so we write stronger <b>data structure invariant</b> checks.",
    ideas: ["inv", "trade", "mem"],
  },
  {
    n: 11,
    title: "Unbounded arrays",
    summary:
      "Arrays give constant-time access but have a fixed size, while linked lists grow freely but take linear time to access. An <b>unbounded array</b> gets the best of both by <b>doubling</b> its storage when it fills up. Some insertions are expensive, but <b>amortized analysis</b> shows that each one costs O(1) over a sequence of insertions.",
    ideas: ["cost", "trade"],
  },
  {
    n: 12,
    title: "Hashing",
    summary:
      "A <b>dictionary</b> retrieves a value from its <b>key</b>, and a <b>hash table</b> implements one by turning each key into an array index. Two keys that land on the same index cause a <b>collision</b>, which <b>separate chaining</b> handles, and the <b>average-case</b> cost of a lookup depends on the <b>load factor</b>. When the table gets too full it doubles in size, so the <b>amortized analysis</b> from unbounded arrays applies again. The table works the same way whatever the keys are, so a <b>user-defined type</b> for keys lets the client choose them, which is the first step toward <b>genericity</b>.",
    ideas: ["cost", "abs", "trade", "rand"],
  },
  {
    n: 13,
    title: "Hash dictionaries",
    summary:
      "A hash table only needs to hash keys and compare them, and both operations depend on the key type. Rather than writing a new library for every key type, we let the <b>client</b> supply the <b>hash</b> and <b>compare</b> functions. The library implements the general behavior once and the client fills in the details, which is why <b>generic</b> libraries make sense. <b>Void pointers</b> (<code>void *</code>) let the library hold elements whose type it does not know.",
    ideas: ["abs", "mem", "rand"],
  },
  {
    n: 14,
    title: "Generic data structures",
    summary:
      "C0 cannot use one library with different types in the same program. The richer language <b>C1</b> adds <b>generic pointers</b> (<code>void *</code>) and <b>function pointers</b>. Together they let one hash table library store integer keys and string keys at the same time.",
    ideas: ["abs", "mem"],
  },
  {
    n: 15,
    title: "Binary search trees",
    summary:
      "A <b>binary search tree</b> is built from linked nodes like a linked list, but each node has two children, so a lookup can skip to the correct half as in binary search. Its <b>ordering invariant</b> keeps smaller keys on the left and larger keys on the right. This gives a new way to implement <b>dictionaries</b>, with a steady <b>O(log n)</b> cost when the tree is balanced. A tree can become <b>unbalanced</b> as keys are added, and the next lecture addresses this.",
    ideas: ["ord", "inv", "cost", "abs", "dc"],
  },
  {
    n: 16,
    title: "AVL trees",
    summary:
      "An <b>AVL tree</b> adds a <b>height invariant</b> that keeps the tree balanced and guarantees O(log n) operations. <b>Rotations</b> restore the balance after an insertion. The guarantee comes at the price of more complex code and invariants, which is a typical <b>trade-off</b>.",
    ideas: ["inv", "cost", "trade", "dc"],
  },
  {
    n: 17,
    title: "Introduction to C",
    summary:
      "We leave the safety of C0 for <b>C</b>. The <b>C preprocessor</b> and its <b>macros</b> let us keep contracts in C code, and we learn how <b>separate compilation</b> works. C never reclaims memory automatically, so every allocation needs a matching <b>free</b> to avoid a <b>memory leak</b>.",
    ideas: ["safe", "mem", "con", "run"],
  },
  {
    n: 18,
    title: "C's memory model",
    summary:
      "C organizes the memory of a running program but also lets code break that organization. <b>Pointer arithmetic</b> and the <b>address-of</b> operator have legitimate uses, but many misuses are <b>undefined behavior</b>. The C standard places no requirements on undefined behavior, so the outcome depends on the compiler.",
    ideas: ["mem", "safe"],
  },
  {
    n: 19,
    title: "Types in C",
    summary:
      "<b>Strings</b> in C are arrays of characters that end with the null character <code>'\\0'</code>. The size of each number type is <b>implementation-defined</b>, and signed <b>overflow</b> is undefined. Code that <b>casts</b> between types must account for these differences.",
    ideas: ["rep", "safe"],
  },
  {
    n: 20,
    title: "Virtual machines",
    summary:
      "A program can run by <b>compiling</b> it to machine code or by <b>interpreting</b> its source, and a <b>virtual machine</b> is a trade-off between the two. The C0 compiler produces <b>bytecode</b>, and the <b>C0VM</b> executes it using an <b>operand stack</b>. An <b>operational semantics</b> describes each instruction, and we treat <b>programs as data</b>.",
    ideas: ["run", "rep"],
  },
  {
    n: 21,
    title: "Graph representation",
    summary:
      "<b>Graphs</b> model many problems, such as the possible moves in a game. We define a minimal graph interface and compare two implementations, <b>adjacency matrices</b> and <b>adjacency lists</b>, which have different costs. Some graphs are <b>implicit</b> and are never stored in full. In C, an adjacency matrix is a <b>heap-allocated</b> two-dimensional array, adjacency lists are an array of <b>pointers</b> to linked lists, and every node must be <b>freed</b> when the graph is no longer needed.",
    ideas: ["trade", "abs", "mem"],
  },
  {
    n: 22,
    title: "Graph search",
    summary:
      "A basic question about a graph is whether one node can reach another. <b>Depth-first search</b> and <b>breadth-first search</b> both answer it, and each has its own advantages. A stack gives DFS and a queue gives BFS, so the worklists from Lecture 9 return. In C, the search records visited nodes in a <b>heap-allocated array</b> of booleans and frees it when the search finishes.",
    ideas: ["trade", "abs", "cost", "mem"],
  },
  {
    n: 23,
    title: "Spanning trees",
    summary:
      "A <b>spanning tree</b> connects every node of a graph without any cycles. When edges carry weights, we want a <b>minimum spanning tree</b>. <b>Kruskal's algorithm</b> considers the edges from lightest to heaviest and adds each edge that does not create a cycle. In C, the edges sit in an array that is sorted by weight with a client-supplied <b>comparison function</b>, reusing the function pointers from Lecture 14.",
    ideas: ["ord", "inv", "abs"],
  },
  {
    n: 24,
    title: "Union-find",
    summary:
      "Kruskal's algorithm must quickly check whether two nodes are already connected. <b>Union-find</b> groups nodes into <b>equivalence classes</b>, and each class has a <b>canonical representative</b>. Finding a representative and merging two classes are both fast. In C, union-find is an <b>array of integers</b> in which each entry stores the parent of a node, so it needs no pointers at all.",
    ideas: ["inv", "cost", "rep"],
  },
  {
    n: 25,
    title: "Priority queues",
    summary:
      "A <b>priority queue</b> always removes the element with the highest priority. A <b>min-heap</b> implements it with a tree that satisfies a <b>shape invariant</b> and an <b>ordering invariant</b>. Insertion temporarily violates these invariants, and the whole heap fits neatly in an <b>array</b>. In C, the heap is a <b>struct</b> that holds a heap-allocated array and its size, and the client supplies a <b>function pointer</b> that decides which of two elements has higher priority.",
    ideas: ["ord", "inv", "abs", "mem"],
  },
  {
    n: 26,
    title: "Restoring invariants",
    summary:
      "We implement a min-heap library using arrays. Its operations <b>temporarily violate</b> the heap invariant, and careful <b>contracts</b> state exactly where the violation is. <b>Sifting</b> up or down restores the invariant, and the same ideas give us <b>heapsort</b>. Because the heap is an array, <b>index arithmetic</b> finds each node's parent and children, so every access needs a <b>safety</b> argument.",
    ideas: ["inv", "con", "mem", "safe"],
  },
];
