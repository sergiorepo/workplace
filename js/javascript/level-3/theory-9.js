Level 3 — Exercise 9: Passing named arrow functions as callbacks
Now let's distinguish between passing a function reference and calling a function.

Consider:
    const square = x => x * x;

const numbers = [1, 2, 3, 4];

const results = numbers.map(square);


Notice that we write map(square), not map(square()).

    This works because .map() needs a function to call for each element.
