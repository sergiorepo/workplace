/*
* In JavaScript, setTimeout(fn, 0) does not run a function immediately; instead, it defers the function until the
* current call stack is completely empty. Passing 0 milliseconds tells the runtime to run the code as soon as possible
* after all currently running synchronous code finishes.
*
* How It Works Under the Hood
*
* Synchronous code runs first. When setTimeout(fn, 0) is called, the browser or runtime hands the timer off to its Web
* APIs and continues running the rest of your normal code.
*
* The callback waits in a queue. Once the 0ms timer expires, the callback function is placed into the task queue (macrotask queue).
*
* The event loop clears the stack. According to developer consensus on Stack Overflow, the event loop only moves the
* callback from the queue onto the call stack after all synchronous code has finished executing.
*/

console.log("1. First");

setTimeout(() => {
    console.log("2. Second (inside setTimeout 0)");
}, 0);

console.log("3. Third");

// Output:
// 1. First
// 3. Third
// 2. Second (inside setTimeout 0)

/*
* Common Use Cases
*
* Allowing DOM updates to render. Browsers usually wait until your JavaScript finishes running before repainting the
* screen. Deferring a task lets the browser apply visual changes or focus an element first.
*
* Breaking up heavy tasks. Splitting a large computation into chunks using setTimeout(..., 0) prevents the main thread
* from freezing, keeping the page responsive to user clicks.
*
* Waiting for event bubbling. If you attach an event listener inside another click handler, wrapping it in
* setTimeout(..., 0) prevents it from catching the very same click event that is currently bubbling up.
*
* Important Caveats & Alternatives
*
* The 4ms minimum clamp. According to MDN Web Docs, if you nest setTimeout calls more than 5 levels deep, browsers
* enforce a minimum delay of 4 milliseconds instead of 0ms to prevent CPU abuse.
*
* Background tab throttling. Browsers throttle timers in inactive tabs to 1 second or more to save battery.
*
* Modern alternatives. If you just want code to run right after the current function without waiting for a browser
* repaint, use Promise.resolve().then(fn) or queueMicrotask(fn). If you are scheduling visual animations, use requestAnimationFrame(fn) instead.
*/