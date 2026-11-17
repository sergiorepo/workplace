/*
Practical closure patterns
*/

/*
* Practical pattern: Private state

    One of the most useful applications of closures is encapsulation: allowing a function to manage internal variables without exposing them directly.
    Consider a bank account implementation.
* */

function createBankAccount(initialBalance) {
    let balance = initialBalance;

    return {
        deposit(amount) {
            if (amount <= 0) {
                throw new Error("Amount must be positive");
            }

            balance += amount;
        },

        withdraw(amount) {
            if (amount <= 0 || amount > balance) {
                throw new Error("Invalid withdrawal");
            }

            balance -= amount;
        },

        getBalance() {
            return balance;
        }
    };
}

const account = createBankAccount(100);

account.deposit(50);
account.withdraw(20);

console.log(account.getBalance()); // 130

/*
* Why is this useful?

The variable balance isn't a property of the returned object. Consequently:
*
* */

console.log(account.balance); // undefined

account.balance = 9999;

console.log(account.getBalance()); // Still 130

/*
* What's happening internally?

All three methods are closures created during the same invocation of createBankAccount().

They share access to one environment containing balance.

Every time we call createBankAccount(), JavaScript establishes a new environment with an independent balance.

This pattern is commonly called a closure-based module or a factory with private state.
When should you use it?

It's useful when you want to maintain internal state and expose only a controlled API.

Modern JavaScript also supports classes with #privateFields, which are another suitable option for encapsulation. Closures are particularly convenient for small factories and function-oriented code.
* */

/*
Practical pattern: Function factories
A function factory is a function that creates and returns another function, often customized using the outer function's arguments.

*/
function createMultiplier(factor) {
    return number => number * factor;
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(10)); // 20
console.log(triple(10)); // 30

/*
createMultiplier() creates a customized function based on the supplied factor.

createMultiplier(2)
    └── double()
          Captures factor = 2

createMultiplier(3)
    └── triple()
          Captures factor = 3
 */

/*A more realistic example: Configurable validators
* Suppose you need several functions to validate whether numbers fall within different ranges.
* */
function createRangeValidator(min, max) {
    return value => value >= min && value <= max;
}

const isPercentage = createRangeValidator(0, 100);
const isAdultAge = createRangeValidator(18, 120);

console.log(isPercentage(85));  // true
console.log(isPercentage(150)); // false

console.log(isAdultAge(25));    // true
console.log(isAdultAge(15));    // false

/*
This is useful because the returned functions retain their configuration.

    You configure the function once: */
const isPercentage = createRangeValidator(0, 100);

// Then reuse it without repeatedly supplying the limits:
isPercentage(50);
isPercentage(75);
isPercentage(120);

/*
* Function factories appear frequently in functional programming, validation libraries, event handling, and application configuration.

A useful distinction: Every function factory can return a closure, but not every closure is necessarily part of a factory pattern.
* */

/*
4. Practical pattern: Callbacks
You already studied callbacks while reviewing asynchronous JavaScript. Now let's connect that knowledge with closures.

A callback is a function passed to another function to be invoked by that function, either immediately or later.

A closure is a function together with its access to its lexical environment.

These concepts describe different things, but they frequently work together.
4.1. An asynchronous callback


*/
function scheduleMessage(name) {
    const message = `Hello, ${name}!`;

    setTimeout(() => {
        console.log(message);
    }, 1000);
}

scheduleMessage("Alice");
scheduleMessage("Bob");
/*
* After approximately one second, the messages appear.
The important part is what happens when scheduleMessage() returns.
Both calls have already finished before their timers execute. However, each callback retains access to its own message binding.
* */

/* Conceptually:





This works for the same reason that our counter functions worked: the callback's lexical environment remains accessible even after the surrounding function returns.


| Callback | Captured binding |
| --- | --- |
| Timer callback 1 | message = "Hello, Alice!" |
| RTimer callback 2 | message = "Hello, Bob!" |

*/
/*
* An event-handler factory

Here's an example that's especially relevant to frontend development.
* */

function createClickHandler(productId) {
    return () => {
        console.log(`Selected product: ${productId}`);
    };
}

const handlerA = createClickHandler("A001");
const handlerB = createClickHandler("B002");

document
    .querySelector("#buttonA")
    .addEventListener("click", handlerA);

document
    .querySelector("#buttonB")
    .addEventListener("click", handlerB);

/*
*     Each handler remembers the product ID it was created with.
    We don't need a global variable containing the currently selected product ID. The information is encapsulated in the handler's lexical environment.
    This becomes particularly useful when dynamically generating UI elements.

One caveat
    When an event handler is no longer needed, remove it if its registration would otherwise keep unnecessary objects alive. Retaining closures can also retain their captured data.
* */

/*
* Practical pattern: Memoization

Memoization is a technique for optimizing functions by caching previously computed results.

It is a particularly interesting use of closures because the closure preserves an internal data structure between function calls.
The basic idea

Suppose we have a computationally expensive function.
* */

function expensiveCalculation(n) {
    console.log("Calculating...");
    return n * n;
}

// If we call it repeatedly with the same argument:

expensiveCalculation(5);
expensiveCalculation(5);
expensiveCalculation(5);

/*The same calculation is performed three times. Memoization allows us to compute the result once and reuse it.
    Building a memoization function*/

function memoize(fn) {
    const cache = new Map();

    return value => {
        if (cache.has(value)) {
            return cache.get(value);
        }

        const result = fn(value);

        cache.set(value, result);

        return result;
    };
}

const square = memoize(n => {
    console.log("Calculating...");
    return n * n;
});

console.log(square(5)); // Calculating... 25
console.log(square(5)); // 25 (cached)
console.log(square(8)); // Calculating... 64
console.log(square(8)); // 64 (cached)

/*
*
* Let's examine how the closure works.

The outer function, memoize(), creates a Map named cache.

It then returns an arrow function that:

- Checks whether the argument already exists in the cache.
- If it exists, returns the cached result.
- Otherwise, executes the original function and stores its result.

Even though memoize() finishes executing, the returned function retains access to cache.
* */
/*
* Why use a closure for memoization?

Because we want the cache to have a lifetime independent of individual calls to the returned function.

If we declared cache inside the returned arrow function, it would be recreated every time:
*
* */
function badMemoize(fn) {
    return value => {
        const cache = new Map(); // New Map on every call!
        // ...
    };
}

/*
*
*     That would defeat the purpose of memoization.
    By declaring cache in the outer scope, we create persistent private state accessible to the returned function.
    An additional benefit is that two separately memoized functions can have independent caches.

When should you use memoization?

    Memoization is useful for expensive, repeatable calculations where the same inputs should produce the same outputs.
    Our implementation handles a single argument. More general implementations need a suitable strategy for multiple arguments and cache keys. Also, caching retains data in memory, so unbounded caches can become a problem.
    Avoid memoizing functions with side effects or results that must change between calls, such as Math.random().
* */


/*
* Comparing the four patterns
*
*
* | Pattern | What the closure remembers | Main purpose |
| --- | --- | --- |
| Private state | Internal variables | Right Encapsulation |
| Function factory | Configuration or arguments | Customization |
* | Callback | Variables from its creation scope | Deferred or delegated execution |
* | Memoization | A cache | Performance Example optimization |

*

An important observation: these patterns aren't mutually exclusive.
For example, the memoization function is also a function factory. It returns a customized function with private state.
    The closure mechanism is the same. What changes is how you use it.
    */

/*
* Connection with React

    Since your broader goal is React development, here's where the concepts become relevant.

* | JavaScript closure pattern | React-related use case |
* | - | - |
* | Private state | Custom hooks and persistent values managed through React mechanisms |
* | Function factories | Generating configured event handlers |
* | Callbacks | onClick, effects, timers, and subscriptions |
* | Memoization | useMemo, useCallback, and caching expensive work  |
*
* There is one subtle difference we need to address later
    In ordinary JavaScript, a closure may maintain mutable local state across calls. In React, function components are executed again on re-renders, creating new lexical bindings for each render. That's why a closure created during one render can retain an older state value. Understanding this is essential to understanding stale closures, dependency arrays, and functional state updates. We'll cover that separately rather than mixing React-specific behavior into the JavaScript fundamentals.
*
* */






