/*
* Call stack, heap, and execution contexts
*
* If a local variable belongs to a function, and that function finishes execution and is removed from the stack, how can
* a closure continue to access that variable?
*
* Key takeaway: The lifetime of captured variables depends on the references that remain reachable, not simply on
* whether the original outer function or returned object still exists.
*
* Stack versus heap memory
* JavaScript engines generally use two important memory regions.
* | Call stack                                           | Heap                                                          |
* | ---------------------------------------------------- | ------------------------------------------------------------- |
* | Tracks active function calls                         | Holds dynamically managed data                                |
* | Usually holds call frames and temporary values       | Typically holds objects, functions, and retained environments |
* | Follows last-in, first-out ordering                  | Managed by the engine and garbage collector                   |
* | A normal function's frame is removed when it returns | Objects may outlive the function that created them            |
*
*
*
*/


function add(a, b) {
    const result = a + b;
    return result;
}

const total = add(5, 10);

/*
* Conceptually:
*    BEFORE CALL              DURING CALL              AFTER RETURN
*
* Call stack               Call stack               Call stack
* ┌─────────────┐          ┌─────────────┐          ┌─────────────┐
* │             │          │ add(5, 10)  │          │             │
* │             │          │ a = 5       │          │             │
* │             │          │ b = 10      │          │             │
* │             │          │ result = 15 │          │             │
* ├─────────────┤          ├─────────────┤          ├─────────────┤
* │ Top-level   │          │ Top-level   │          │ Top-level   │
* └─────────────┘          └─────────────┘          └─────────────┘
*
*                                                      total = 15
*/

/*
What is an execution context? vs Lexical Scope vs scope in stack and heap ????????????????????????????????????
An execution context describes an active invocation. A lexical environment describes bindings and their scope relationships.

Every time JavaScript invokes a function, the language's execution model establishes an execution context.

An execution context is an abstract structure that tracks information necessary to execute code, including:

    Which function is executing.
    Where execution should continue.
    The lexical environment used to resolve identifiers.
    The variable environment used for certain declarations.
    The current realm and other execution state.

The ECMAScript specification defines an execution context stack, with the currently running context at the top.
When third() returns, its execution context is popped. Then second() resumes, returns, and is popped. Finally, first() returns.
This is familiar stack behavior.
But here's the critical distinction:

An execution context describes an active invocation. A lexical environment describes bindings and their scope relationships
*/


/*What is an Environment Record?

An Environment Record is the specification's mechanism for associating identifiers such as count or message with their bindings.



*/
function example() {
  let count = 10;
  const message = "Hello";
}
/*
A simplified representation of the function's environment would be:

Environment Record
──────────────────────────
count       → 10
message     → "Hello"
──────────────────────────
OuterEnv    → Global environment

Each Environment Record has an internal OuterEnv reference, which represents the next enclosing scope.
This is what supports the scope chain from our previous chapter.
A nested function also remembers the environment in which it was created. In the ECMAScript specification, an ordinary function object has an internal slot called Environment.

function outer() {
  let x = 10;

  return function inner() {
    return x;
  };
}

The conceptual relationship is:

inner function object
       │
       │ [[Environment]]
       ▼
outer's Environment Record
       │
       ├── x = 10
       │
       └── [[OuterEnv]]
               │
               ▼
        Global environment

Environment and OuterEnv have different roles:

    Environment connects a function to the environment where it was created.
    OuterEnv connects an environment to its enclosing environment.

Together, these relationships explain how a closure can resolve variables through its lexical scope chain. Neither internal slot is a normal JavaScript property that you can read using something like inner.Environment.
*/

