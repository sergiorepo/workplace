/*
* Your challenge
*
* Convert this traditional function into an arrow function:
*
* function createProduct(id, name, price) {
*    return {
*       id: id,
*       name: name,
*       price: price,
*       available: true
*   };
* }
*
*
* Requirements:
* - Declare it using const and name it createProduct.
* - Accept three parameters: id, name, and price.
* - Use an implicit return.
* - Use object property shorthand wherever possible.
* - Keep available: true.
*/

const createProduct = (id, name, price) => ({id, name, price, available:true});


console.log(createProduct(1, "Keyboard", 50));
/*
Expected output:
{
    id: 1,
        name: 'Keyboard',
    price: 50,
    available: true
}
*/