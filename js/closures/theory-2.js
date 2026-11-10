/*
*
* 2. Internal memory mechanics of closures
* Now we arrive at your original question:
*
* If a local variable belongs to a function, and that function finishes execution and is removed from the stack, how can a closure continue to access that variable?
* To answer properly, we need to distinguish two things:
*  1. JavaScript's language model: How the ECMAScript specification defines execution contexts, lexical environments, bindings, and closures.
*  2. The actual implementation: How an engine such as V8 represents these concepts using stack memory, heap memory, references, and garbage collection.
* These models are related, but they aren't identical.
*
*/
