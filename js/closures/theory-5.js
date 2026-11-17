/*
Variable capture and mutation

Variable capture and mutation

We've already seen that closures capture access to variable bindings, rather than frozen snapshots of their values.

Now let's investigate how this interacts with JavaScript's three main variable declaration keywords:

    let
    const
    var

These declarations have different scoping and reassignment rules, which directly affect closure behavior.
*/

/*Closures with let
*
* The let declaration creates a mutable binding.
Both closures access the same binding, and increment() can update it.
This is the pattern we've been using for counters and private state.
* */

function createCounter() {
    let count = 0;

    return {
        increment: () => ++count,
        getCount: () => count
    };
}

const counter = createCounter();

console.log(counter.getCount()); // 0
counter.increment();
console.log(counter.getCount()); // 1

/*
* Closures with const
* */
function createGreeting() {
    const greeting = "Hello";

    return name => `${greeting}, ${name}!`;
}

const greet = createGreeting();

console.log(greet("Alice")); // Hello, Alice!

/*
This works perfectly.
    The closure can read greeting, but the binding cannot be reassigned.*/
const greeting = "Hello";
greeting = "Goodbye"; // TypeError

/*
* Closures with var

Now let's try a similar example:
* */

function createCounter() {
    var count = 0;

    return () => ++count;
}

const counter = createCounter();

console.log(counter()); // 1
console.log(counter()); // 2

/*
* This also works.
So var isn't incompatible with closures.
The major difference is scope.
* */

/*
| Feature | var | let | const |
| --- | --- | --- | --- |
| Scope | Function or global scope | Block scope | Block scope |
| Reassignment in same scope | Generally allowed | Not allowed | Not allowed |
| Redeclaration | Yes | Yes, but uninitialized until declaration executes | Yes, but uninitialized until declaration executes |
| Hoisted | Yes | Yes | No |
| Can be captured by closures | Yes | Yes | Yes |
 * */

/*
* The famous closure problem: var inside loops
*
* */

const functions = [];

for (var i = 0; i < 3; i++) {
    functions.push(() => console.log(i));
}

functions[0]();
functions[1]();
functions[2]();

/*
* What do you think happens? You might expect:

0
1
2

But the actual output is:

3
3
3
*
*
*
* Let's examine why. 3.1. The problem: One shared var binding Because var is function-scoped (or global-scoped at the top level of a script), the loop doesn't create a new binding for i on every iteration.

Instead, all three closures access the same i binding.

Here's what happens:

    The loop starts with i = 0 and creates the first function.
    The loop increments i to 1 and creates the second function.
    The loop increments i to 2 and creates the third function.
    The loop increments i to 3, fails the loop condition, and exits.
    Only now do we invoke the functions.
    *
    *  */

/*
* Solving the problem with let*/

const functions = [];

for (let i = 0; i < 3; i++) {
    functions.push(() => console.log(i));
}

functions[0](); // 0
functions[1](); // 1
functions[2](); // 2

/*
* This time the output is what we originally expected.
Why?
Because let in a standard for loop with a lexical declaration uses a separate per-iteration binding.
Instead of having one shared i, each closure accesses the i belonging to its own iteration.
*
* What happens internally with let?

The ECMAScript specification describes a mechanism called per-iteration environments for lexical bindings in traditional for loops.
*
*
* Iteration 1:
  Environment A
    i = 0
    Closure 1 → Environment A

Iteration 2:
  Environment B
    i = 1
    Closure 2 → Environment B

Iteration 3:
  Environment C
    i = 2
    Closure 3 → Environment C
*
* Each function has access to its corresponding binding.

An important nuance: this isn't the same as capturing a frozen copy of a number. The binding for an iteration is still mutable when declared with let. JavaScript creates separate bindings for the iterations, and each closure can read the current value of its own binding.

That's why the distinction between copying a value and creating a separate variable binding matters.
*
* */

/*What about const in loops?
*
* Traditional for loops

This doesn't work as intended:

for (const i = 0; i < 3; i++) {
  console.log(i);
}

The problem is i++.

Because i was declared with const, the loop cannot reassign it. The first attempted increment throws a TypeError.

For this type of loop, let is usually appropriate.
* */
/*
* for...of loops

However, const works perfectly in for...of loops:

const functions = [];

for (const number of [10, 20, 30]) {
  functions.push(() => console.log(number));
}

functions[0](); // 10
functions[1](); // 20
functions[2](); // 30

    Why?
    Because each iteration of for...of creates a new binding for number.
    The variable isn't reassigned during an iteration; a different binding is initialized for the next one.
    This is why const is commonly used in modern JavaScript iteration.
* */
/*
* Closures and asynchronous callbacks

The loop issue becomes particularly visible when using asynchronous callbacks.

for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 1000);
}

After approximately one second, you get:

3
3
3

The callbacks execute after the synchronous loop has completed. Each one accesses the same var binding, whose value is now 3.
*
* Changing var to let:

for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 1000);
}

Produces:

0
1
2

This is a practical use case for closures: retaining data that an asynchronous callback will need later.

One subtle point: the callbacks are closures in both versions. let doesn't make a function into a closure; it changes which binding each closure captures.
* */

/*
* One last subtlety: A captured value versus a captured variable
*
*
* function createExample() {
  let x = 10;

  const getLiveValue = () => x;

  const snapshot = x;
  const getSnapshot = () => snapshot;

  const update = () => {
    x = 50;
  };

  return {
    getLiveValue,
    getSnapshot,
    update
  };
}

const example = createExample();
example.update();

console.log(example.getLiveValue()); // 50
console.log(example.getSnapshot());  // 10
*
* This is worth understanding carefully.

getLiveValue
    closes over the x binding, which was updated to 50.
getSnapshot
    closes over a different binding, snapshot, which was initialized to 10 and never changed.

The second closure is still a closure. It isn't a special value-capturing function. We explicitly created a new binding initialized from the old value. For primitive values such as numbers, this is a useful way to preserve the value at a particular moment. For objects, however, assigning an object to another variable copies the reference, not the object itself. That distinction will matter when you work with arrays and React state.
*
*
* */