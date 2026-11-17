/*
* Closures in asynchronous JavaScript and React
*
* Closures in asynchronous JavaScript

So far, most of our examples have involved functions that execute immediately.

But JavaScript often executes callbacks later, after their surrounding function has finished.

This happens with:

    setTimeout() and setInterval()
    Promises and .then()
    async / await
    Event listeners
    Network requests
    React event handlers and effects

Closures make it possible for these callbacks to access variables from the context where they were created.

The complication is that the value of a captured binding may change before the callback executes.

That is where timing becomes important.
*
* A callback can observe changes made after its creation

Let's start with vanilla JavaScript, using setTimeout().
*
*
*/
function example() {
    let count = 0;

    setTimeout(() => {
        console.log(count);
    }, 1000);

    count = 10;
}

example();

/*
* After approximately one second, JavaScript prints:
* */
10

/*
* Why?

The callback retains access to the count binding, not a frozen copy of its original value.

Although the callback was created when count was 0, the outer function changed the binding to 10 before the callback executed.

Now compare that with this:
* */

function example() {
    let count = 0;

    const snapshot = count;

    setTimeout(() => {
        console.log(snapshot);
    }, 1000);

    count = 10;
}

example(); // Prints 0

/*
* Here, snapshot is a separate binding initialized to the primitive value 0. Updating count doesn't update snapshot.

Both callbacks are closures. The difference is which binding each callback reads.
*
*
* 2.2. Closures with Promises

Promises behave according to the same lexical-scoping rules.
*
*
* */
let status = "pending";

Promise.resolve().then(() => {
    console.log(status);
});

status = "completed";

/*
* Output:
completed
* */

/*
* The .then() callback executes as a microtask after the current synchronous code finishes.
By then, the status binding has already been changed to "completed".
The Promise doesn't copy status into the callback. The closure continues to access the existing binding.
The same principle applies to callbacks that execute after an await.
* */
/*
* 3. Why React closures behave differently

Now we reach the most important part for your React studies.

Recall our earlier JavaScript example:
* */
function createCounter() {
    let count = 0;

    return () => ++count;
}
/*
* The returned function keeps accessing and modifying the same count binding.

However, React's useState() behaves differently.

Consider:
* */
import { useState } from "react";

function Counter() {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        setCount(count + 1);
        console.log(count);
    };

    return (
        <button onClick={handleClick}>
            Count: {count}
        </button>
    );
}
/*
* Suppose the component initially displays Count: 0.

When we click the button, two things happen:

setCount(count + 1) requests a state update to 1, but the subsequent console.log(count) still prints 0.
Why doesn't count change immediately?

Because React state follows a render snapshot model.

Unlike a local variable being directly mutated, calling a React state setter requests another render. It does not modify the count binding belonging to the currently executing render.
*
* 3.1. Every render has its own lexical environment

Conceptually, imagine React executing your component several times.
*
*
* In the ordinary case, you can think of it as:
* */
/*
* Render 1:
  count = 0
  handleClick_1 captures count from Render 1

Render 2:
  count = 1
  handleClick_2 captures count from Render 2

Render 3:
  count = 2
  handleClick_3 captures count from Render 3
*
* */
/*
*
* React maintains the persistent component state outside these individual function executions and supplies the relevant value on each render.

This is the essential distinction:
*
*
* | Ordinary closure counter | React useState |
| --- | -- |
| One mutable count binding can persist across calls | Each render has its own count binding |
| The closure directly modifies count | The setter requests an update in React |
* | Later calls see the modified binding | Existing closures continue to see their render's value |
* | A new outer invocation creates independent state | A re-render normally preserves the component's React state |
*
* */

/*
* The stale closure problem

A stale closure is a function that continues to use values from an earlier render when newer values are needed.

Consider:
* */
import { useState } from "react";

function Counter() {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        setCount(count + 1);

        setTimeout(() => {
            console.log(count);
        }, 3000);
    };

    return (
        <button onClick={handleClick}>
            Count: {count}
        </button>
    );
}

/*
* Suppose we click the button once when the count is 0.

The UI updates to 1.

But three seconds later, the callback prints:
* 0
*
* Why? The timer callback was created by handleClick from the render where count = 0.

The component may have re-rendered since then, but that doesn't change the lexical binding captured by the existing callback.

The React documentation describes this directly: event handlers from earlier renders retain the state values from those renders. React


An important nuance: this isn't necessarily a bug. Sometimes you intentionally want a callback to remember the state at the time an action occurred—for example, the contents of a form when the user pressed Submit.

It becomes a problem when you expect the callback to use the latest state.
*
* */

/*
* 5. Functional state updates: The solution to many stale closure problems

This is where your previous work with arrow functions and setState becomes especially relevant.

Recall the familiar React pattern:
* */
setCount(count + 1);

/*This computes the next value using the count binding belonging to the current render. Now consider: */

function Counter() {
    const [count, setCount] = useState(0);

    const incrementThreeTimes = () => {
        setCount(count + 1);
        setCount(count + 1);
        setCount(count + 1);
    };

    return (
        <button onClick={incrementThreeTimes}>
            Count: {count}
        </button>
    );
}

/*
* If the initial count is zero, clicking the button increments it to 1, not 3.

Why?

All three updates compute:
*
* */
setCount(0 + 1);

//React queues these state updates. They are not immediate mutations to the local count variable.
/*
* Using the functional updater
* Now change the code:
* */
const incrementThreeTimes = () => {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
};

/*This time, the final count is 3.

When you pass a function to the setter, React queues that updater and supplies it with the pending state when processing the update queue. React

The sequence is:

| Updater | Receives prev | Returns |
| :--- | :---: | ---: |
| First | 0 | 1 |
| Second | 1 | 2 |
| Third | 2 | 3 |
 */

/*The important detail is that prev is a function parameter supplied by React.

    It isn't the captured count binding from the surrounding event handler.
Why the two arrow functions aren't the same

Let's revisit something that often causes confusion in React: */
setCount(prev => prev + 1);

/*
* Here:

    - setCount() is React's state setter.
    - prev => prev + 1 is a callback passed to that setter.
    - prev is the pending state supplied by React.
    - The callback calculates and returns the next state.

The updater is technically also a closure, because JavaScript functions have lexical environments. But in this example it doesn't need to read the outer count binding.

React controls the value passed into its prev parameter.

This gives us a useful rule:

When the next state depends on the previous state, prefer a functional updater.

Notice that functional updaters don't magically eliminate closures. Instead, they let us avoid depending on an older captured state value when calculating the next state.
*
* */

/*
* 7. The classic React setInterval() bug

This is probably the most useful practical example for understanding stale closures.

Consider the following component:
* */
import { useState, useEffect } from "react";

function Timer() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setCount(count + 1);
        }, 1000);

        return () => clearInterval(id);
    }, []);

    return <h1>Count: {count}</h1>;
}

// You might expect the counter to increment indefinitely:
// 0 → 1 → 2 → 3 → 4...

/*But instead, it reaches 1 and stops increasing.
*
* 7.1. Why does the interval get stuck?

The Effect establishes an interval using a callback created during the initial render.

That callback closes over count = 0.

Because the dependency array is empty, the Effect does not synchronize again when count changes.

Consequently, each interval tick executes the equivalent of:
* */

setCount(0 + 1);

/*
* The first tick updates state to 1.

Subsequent ticks continue requesting 1, so the displayed count stays there.

This is not because the interval stopped executing. The callback continues running; it simply keeps using the same captured state.
* */
/*
* 7.2. Fixing the interval

Use a functional state update:
* */

import { useState, useEffect } from "react";

function Timer() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setCount(prev => prev + 1);
        }, 1000);

        return () => clearInterval(id);
    }, []);

    return <h1>Count: {count}</h1>;
}

/*
* Now each tick increments the latest pending state.

The interval can continue working without the Effect needing to depend on count.

This is a pattern explicitly recommended in the React documentation for Effects that update state based on its previous value.
*
* */

/*
* 8. Dependency arrays and stale closures

Another way to avoid stale state in an Effect is to declare the values it depends on.

For example:
* */

useEffect(() => {
    const id = setInterval(() => {
        setCount(count + 1);
    }, 1000);

    return () => clearInterval(id);
}, [count]);

/*
* Here, the Effect re-synchronizes whenever count changes.
- Each new interval callback is created in an environment containing the updated count value.
- However, this also means that React cleans up and recreates the interval on every count change.
- For a simple counter that only needs the previous state, the functional updater with [] is generally preferable.
- For Effects that genuinely need to synchronize with changing props or state, those dependencies must be declared. Don't suppress dependency warnings merely to keep an Effect from running again.
*
*
* 8.1. What about useRef()?

A ref is useful when a long-lived callback needs access to a mutable value that persists across renders without itself triggering a re-render.

For example:
*
*/
const latestCount = useRef(0);
/*
The callback can close over the ref object and later read latestCount.current.
Unlike a particular render's count binding, the ref object can remain the same across renders while its .current property changes.
But refs and functional state updates solve different problems:








A functional updater is not a general-purpose way to read the latest value outside a state update. Its purpose is to calculate new state.


* | Need | Appropriate approach3 |
| --- | --- |
| Calculate next state from previous state | Functional updater |
| Re-synchronize an Effect when a value changes | Effect dependencies |
| Store mutable data without triggering renders | useRef() |
| Update an array or object in state | Functional updater with immutable copying when based on previous state |
| Read the current state in the UI | Read state during rendering |
*
* */

/*
* Connecting this to your earlier React exercises

Previously, you were working with state arrays and .map().

Consider:
* */
function updateUser() {
    setUsers(prevUsers =>
        prevUsers.map(user =>
            user.id === 2
                ? { ...user, name: "Robert" }
                : user
        )
    );
}

/*
Now you can understand the two arrow functions more completely.

    The outer arrow function:

prevUsers => ... */

/*
* Receives the pending state array from React. This is how we avoid depending on a possibly outdated users binding captured by the event handler.

The inner arrow function:
*
user => ...
*/
/*
* Is a callback passed to .map(). It receives one element of the array at a time and returns either the modified user object or the original one.
The outer updater also provides the lexical environment in which the inner callback is created, so the inner callback can access variables from that environment if needed.
This brings together arrow functions, callbacks, closures, lexical scoping, functional state updates, and array methods in one practical example.
*
* */



