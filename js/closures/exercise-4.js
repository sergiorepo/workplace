/*
Exercise: Understanding closure lifetime

Now let's test your understanding of the relationship between function references and captured environments.
*/

function createBox() {
    let value = 10;

    const getValue = () => value;

    const increase = () => {
        value += 5;
    };

    return { getValue, increase };
}

let box = createBox();

const savedFunction = box.getValue;

box.increase();

box = null;

console.log(savedFunction());

