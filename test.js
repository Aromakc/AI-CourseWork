fArray = [
  [{ a: 1 }],
  [{ b: 2 }, { c: 3 }],
  [{ d: 6, id:4 }, { d: 5, id: 5 }, { d: 6 }],
];
test = [...fArray[2].filter((state) => state.d === 6)];
console.log(test);
