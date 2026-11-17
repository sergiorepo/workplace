/*
* Exercise: Async closures and React state

Let's finish with a React example.
* */
import { useState } from "react";

function Counter() {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        setCount(count + 1);

        setTimeout(() => {
            setCount(count + 1);
        }, 1000);
    };

    return (
        <button onClick={handleClick}>
            Count: {count}
        </button>
    );
}

/*
* Assume the initial count is 0 and the button is clicked exactly once.


Correct! The final count is 1. Your answer is correct. This exercise illustrates one of the most important consequences of closures in React: a callback remembers the state from the render in which it was created, even if React has rendered the component again.

Let's examine it step by step, and then fix it using functional state updates. */

//2. Fixing it with functional state updates
import { useState } from "react";

function Counter() {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        setCount(prev => prev + 1);

        setTimeout(() => {
            setCount(prev => prev + 1);
        }, 1000);
    };

    return (
        <button onClick={handleClick}>
            Count: {count}
        </button>
    );
}

/*
* Step 1 — The button is clicked
The first updater is queued:
setCount(prev => prev + 1);
React supplies the pending state, which is initially 0.
The updater returns 1.
React updates the state and renders the component again.

Step 2 — The timeout executes
After approximately one second, the callback calls:
setCount(prev => prev + 1);
Here, React supplies the latest pending state to the updater.
At this point that state is 1.
Therefore:
prev = 1;
return prev + 1; // 2
* */
/*
* Functional update timeline

    Initial state*/
count = 0
/*
* Button clicked*/
setCount(prev => prev + 1)
/*React supplies prev = 0, producing 1.

    React re-renders*/
count = 1
/*Timeout fires*/
setCount(prev => prev + 1)
/*React supplies prev = 1, producing 2.

    Final displayed count

    2*/

/*The important distinction is: */
setCount(count + 1);
/*
* This means: "Set the count to the value I can calculate from the count in my current closure."

Whereas: */
setCount(prev => prev + 1);

/*Means
    "React, take the pending state and calculate the next value using this function."

    Notice that the updater is itself an arrow function, but it uses the prev parameter supplied by React rather than reading the old captured count.
    What changed is that it doesn't rely on the captured count binding when incrementing the state.
    In fact, it could still access other variables from the click handler:*/

const handleClick = () => {
    const incrementAmount = 5;

    setTimeout(() => {
        setCount(prev => prev + incrementAmount);
    }, 1000);
};

/*
Quick exercise: Mixing the two approaches

Before moving into our final chapter on memory management, here's a slightly more challenging example. */
function Counter() {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        setCount(prev => prev + 1);

        setTimeout(() => {
            setCount(count + 5);
        }, 1000);
    };

    return (
        <button onClick={handleClick}>
            Count: {count}
        </button>
    );
}
/*
* Correct! The final count is 5. You've correctly identified that the first state update uses React's pending state, while the second uses a value captured by an earlier closure.

Let's examine the execution step by step. Then we'll finish your study of JavaScript closures with memory management, garbage collection, memory leaks, and performance optimization. */

/*
*Execution summary
* | Moment | Operation | Resulting state |
| --- | --- | --- |
| Initial render | useState(0) | 0 |
| Button clicked | setCount(prev => prev + 1) | 1 |
* | Timeout executes | setCount(count + 5) | 5 |
*
*
The important point is that the second update replaces the state with 5; it doesn't add 5 to the latest state.

If we changed the timeout to:
 */

setTimeout(() => {
    setCount(prev => prev + 5);
}, 1000);

/*
* Then the final result would be 6, because React would supply the latest pending state of 1 to the updater.

This completes the main connection between closures, asynchronous callbacks, and React state.
* */