/*
Garbage collection and performance

Final chapter: Closures and memory management

We'll now focus on the five questions that matter most when writing real JavaScript applications:

- How does the garbage collector determine whether a closure can be removed?
- How can closures accidentally retain large amounts of memory?
- How should we manage closures used in React effects and event handlers?
- Are closures expensive in terms of performance?
- How can we inspect memory usage in a JavaScript application?


*/
/*
2.1. Garbage collection is based on reachability

JavaScript uses automatic memory management.

In an engine such as V8, garbage collection works by identifying objects that are still reachable from a collection of roots, including active execution state and global references.

The engine follows references from those roots to determine which objects must remain available. Unreachable objects can be reclaimed.
 */
function createCounter() {
    let count = 0;

    return () => ++count;
}

let counter = createCounter();

console.log(counter()); // 1

// Conceptually, we have the following reference chain:
/*
* Reachable root
     │
     ▼
 counter variable
     │
     ▼
 Closure function
     │
     ▼
 Lexical environment
     │
     ▼
  count = 1
*
* As long as counter is reachable, its closure and required captured state remain accessible.

Now execute:
* */
counter = null;

/*
*
* If there are no other references to the closure or its captured environment, those allocations can become eligible for garbage collection.

This is the key principle:

Memory isn't reclaimed simply because a function returns. It is reclaimed when the objects and state are no longer reachable.
* */

/*
* 2.2. Can circular references cause memory leaks?

Not by themselves.
* */

function createCycle() {
    const a = {};
    const b = {};

    a.other = b;
    b.other = a;

    return a;
}

let obj = createCycle();

obj = null;

/*
* The objects still reference one another, but neither is reachable from the program's roots, assuming no other references exist.

Modern tracing garbage collectors can reclaim the entire unreachable cycle.

The same general principle applies to closures involved in circular reference structures.
*
* */

/*
3. How closures can retain unnecessary memory*/
const handlers = [];

function registerHandler() {
    const largeData = new Array(1_000_000).fill(42);

    const handler = () => {
        console.log(largeData.length);
    };

    handlers.push(handler);
}

registerHandler();

// Let's examine the references:
/*
* handlers (global array)
        │
        ▼
   handler function
        │
        ▼
  Lexical environment
        │
        ▼
    largeData
        │
        ▼
  Array with 1,000,000 elements
*
*
* Even though registerHandler() has returned, its callback remains reachable through the handlers array.

Because that callback uses largeData, the array must remain accessible.

If we call registerHandler() hundreds of times, our handlers array will accumulate hundreds of closures, each potentially retaining a large array.

This can cause significant unwanted memory usage.
*
* */

/*
* 3.1. Releasing the references

Suppose we no longer need those callbacks.

We could execute:
* */
handlers.length = 0;

/*
* This removes their references from the handlers array.

If no other references keep those functions or captured arrays reachable, the memory can become eligible for garbage collection.

However, JavaScript doesn't guarantee exactly when it will be reclaimed.

A useful optimization Sometimes a closure doesn't need the original large object at all.
*
* */
function registerHandler() {
    const largeData = new Array(1_000_000).fill(42);
    const length = largeData.length;

    handlers.push(() => console.log(length));
}

/*
* Here, the callback only needs the number stored in length, not the original array.

Because the callback doesn't reference largeData, a JavaScript engine can avoid retaining that array after it becomes otherwise unreachable.

The general principle is to retain only the information your long-lived callbacks actually need.
*
* */
/*
* 4. Closures and memory management in React

React developers encounter this problem most frequently when working with Effects that register long-lived callbacks.
*
* */
import { useEffect } from "react";

function Timer() {
    useEffect(() => {
        const id = setInterval(() => {
            console.log("Tick");
        }, 1000);
    }, []);

    return <div>Timer running</div>;
}

/*
* What's missing?

    The Effect creates an interval, but never clears it.
    After the component is unmounted, the interval can continue running, because the timer registration still holds its callback.

If the callback captures objects, those objects can also remain reachable.
* */
// 4.1. Correct implementation

import { useEffect } from "react";

function Timer() {
    useEffect(() => {
        const id = setInterval(() => {
            console.log("Tick");
        }, 1000);

        return () => {
            clearInterval(id);
        };
    }, []);

    return <div>Timer running</div>;
}

/*
* The returned function is the Effect's cleanup function.

React invokes cleanup when appropriate, including when the component unmounts and before re-running an Effect whose dependencies have changed. In development Strict Mode, React also performs an additional setup-and-cleanup cycle to help expose incorrect cleanup behavior. React


Notice that both callbacks are closures:
* */
() => {
    console.log("Tick");
}
// and
() => {
    clearInterval(id);
}

/*
*
*
* - The first is retained by the interval registration.
 - The second captures the interval ID so it can clean up that registration later.
- This is a useful example of closures helping us manage the lifetime of other closures.
- The same cleanup principle applies to browser event listeners, subscriptions, WebSocket connections, and similar resources.
*
* */


/*
* 5. Are closures expensive?

    Generally, no. Closures are fundamental to JavaScript and modern engines optimize them extensively.
    However, they can introduce costs in certain situations.
*
* */

/*

| Potential cost | Explanation |
| --- | --- |
| Function allocation  | Creating a function can require allocating an object |
| Captured environments | Retained bindings may require additional storage |
| Garbage collection | Creating and retaining many objects adds memory-management work |
| Indirect memory retention | A small closure may keep large objects alive |
| Function identity | New function objects have different identities, which can affect React memoization |

*/
/*The most important practical distinction is between creating many short-lived closures and retaining many long-lived closures.

    For example: */
const doubled = numbers.map(n => n * 2);

/*This creates a callback function, but there is ordinarily no reason for it to remain reachable after .map() finishes.

    There is no need to avoid this idiomatic JavaScript pattern.

    By comparison: */
const callbacks = [];

for (let i = 0; i < 100000; i++) {
    callbacks.push(() => i);
}

/*
This intentionally retains 100,000 function objects and their associated captured bindings. That uses more memory and can increase garbage collection work.

    Short-lived objects are often inexpensive for generational garbage collectors such as V8's. Long-lived allocations are more relevant when evaluating retention costs.

*/
/*5.1. Should you use useCallback() everywhere in React?

    No.

        You might have seen code like: */
const handleClick = useCallback(() => {
    console.log("Clicked");
}, []);

/*
* useCallback() lets React reuse a function reference between renders when its dependencies haven't changed.

This can be useful when passing callbacks to memoized child components or when stable function identity helps avoid unnecessary Effect executions.

However, it doesn't eliminate closures or guarantee that the component performs better. React's current documentation recommends using it for specific optimization needs rather than wrapping every function automatically. It also documents automatic memoization capabilities in React Compiler. React

For ordinary React code, this is usually perfectly fine:
* */
const handleClick = () => {
    console.log("Clicked");
};

/*
* Prefer clear code first. Optimize when there's a measurable reason.
6. Memoization has a memory cost too

Remember our earlier memoization example?
* */

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

/*
* The closure keeps cache accessible.

That improves performance when calculations are expensive and inputs repeat.

But there's a tradeoff: if the function receives thousands of distinct inputs, the cache can grow indefinitely.

One solution is to limit its size.
*
* */
function memoize(fn, maxEntries = 100) {
    const cache = new Map();

    return value => {
        if (cache.has(value)) {
            return cache.get(value);
        }

        const result = fn(value);

        if (maxEntries > 0) {
            if (cache.size >= maxEntries) {
                const oldestKey = cache.keys().next().value;
                cache.delete(oldestKey);
            }

            cache.set(value, result);
        }

        return result;
    };
}

/*
* This implementation limits the cache to a maximum number of entries (assuming a positive integer limit). It removes the oldest inserted entry when full, rather than implementing a true least-recently-used cache.

For caches keyed by objects, a WeakMap can sometimes be appropriate because its keys don't prevent those objects from being collected solely by virtue of being keys. However, it has different semantics and won't work as a direct replacement for every Map.

The lesson is that closures can improve performance by retaining useful data, but retained data consumes memory.
* */
/*
* 7. How to inspect closures in memory

Since you're working with Node.js and browser-based React applications, you can investigate memory rather than relying only on conceptual diagrams.

For example, in Chrome DevTools:
*
*
* - Open DevTools with F12.
- Navigate to the Memory panel.
- Choose Heap snapshot.
- Take a snapshot, perform the interaction you want to investigate, and take another.
- Use the Comparison view and examine retaining paths to understand why objects remain reachable.
*
*
*
* */
/*Heap snapshots can show closure-related context objects, including entries labeled system / Context, although the exact representation depends on the JavaScript engine and its optimizations.

    For further exploration, see Chrome DevTools: Record heap snapshots.

    I'd recommend experimenting with the registerHandler() example from section 3. Try retaining a few handlers, then clearing the array and comparing heap snapshots. Remember that DevTools itself can sometimes keep objects alive through console references and debugging state.

    */
/*
* 8. Final summary: Your closures study

We've now covered the major concepts of JavaScript closures, from their language semantics to practical React applications.
* */

