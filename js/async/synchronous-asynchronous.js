/*
* Synchronous example:
*/
console.log("First");
console.log("Second");
console.log("Third");

/*
*
* But some operations take time, such as network requests, file operations, or timers. JavaScript can initiate these
* operations and continue executing other code rather than blocking until they finish.
*/

/*
* Asynchronous example:
* The setTimeout() function schedules the callback to execute after approximately one second, without blocking the
* execution of the remaining code.
*/
console.log("First");

setTimeout(() => {
    console.log("Second");
}, 1000);

console.log("Third");
