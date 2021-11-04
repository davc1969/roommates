function sumTwoSmallestNumbers(numbers) {  
    const n= numbers.sort((a, b) => a - b);
    return n[0] + n[1];
}

console.log(sumTwoSmallestNumbers([1, 43, 11, 20, 44, 50]));