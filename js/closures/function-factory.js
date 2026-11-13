const createMultiplier = factor => {
    return number => number * factor;
};

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(10)); // 20
console.log(triple(10)); // 30
