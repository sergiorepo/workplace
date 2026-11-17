/*
9. Final exercise: Memory reachability

To wrap up, here's an exercise combining closures and garbage collection.
*/

function createDataHandler() {
    const data = new Array(100000).fill(10);

    return () => data.length;
}

let handlerA = createDataHandler();
let handlerB = handlerA;

handlerA = null;

console.log(handlerB());

handlerB = null;
