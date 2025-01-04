import { Computer } from "./computer.mjs";
import { expect, prepareData } from "./utils.mjs";

await (async () => {
  const computer = new Computer({ a: 5, b: 0, c: 0, program: [0, 2] });
  computer.execute();
  expect({
    text: "Should execute ADV",
    expected: 1,
    result: computer.a,
  });
  expect({
    text: "Should have correct cursor",
    expected: 2,
    result: computer.cursor,
  });
})();

await (async () => {
  const computer = new Computer({ a: 0, b: 5, c: 0, program: [1, 3] });
  computer.execute();
  expect({
    text: "Should execute BXL",
    expected: 6,
    result: computer.b,
  });
  expect({
    text: "Should have correct cursor",
    expected: 2,
    result: computer.cursor,
  });
})();

await (async () => {
  const computer = new Computer({ a: 0, b: 0, c: 9, program: [2, 6] });
  computer.execute();
  expect({
    text: "Should execute BST",
    expected: 1,
    result: computer.b,
  });
  expect({
    text: "Should have correct cursor",
    expected: 2,
    result: computer.cursor,
  });
})();

await (async () => {
  const computer = new Computer({ a: 10, b: 0, c: 0, program: [3, 3] });
  computer.execute();
  expect({
    text: "When execute JNZ should have correct cursor",
    expected: 3,
    result: computer.cursor,
  });
})();

await (async () => {
  const computer = new Computer({ a: 0, b: 0, c: 0, program: [3, 1] });
  computer.execute();
  expect({
    text: "When execute JNZ when a is 0, do nothing",
    expected: 2,
    result: computer.cursor,
  });
})();

await (async () => {
  const computer = new Computer({ a: 0, b: 5, c: 3, program: [4, 1] });
  computer.execute();
  expect({
    text: "Should execute BXC",
    expected: 6,
    result: computer.b,
  });
  expect({
    text: "Should have correct cursor",
    expected: 2,
    result: computer.cursor,
  });
})();

await (async () => {
  const computer = new Computer({ a: 1, b: 5, c: 9, program: [5, 6] });
  computer.execute();
  expect({
    text: "Should execute OUT",
    expected: JSON.stringify([1]),
    result: JSON.stringify(computer.output),
  });
  expect({
    text: "Should have correct cursor",
    expected: 2,
    result: computer.cursor,
  });
})();

await (async () => {
  const computer = new Computer({ a: 5, b: 0, c: 0, program: [6, 2] });
  computer.execute();
  expect({
    text: "Should execute BDV",
    expected: 1,
    result: computer.b,
  });
  expect({
    text: "Should have correct cursor",
    expected: 2,
    result: computer.cursor,
  });
})();

await (async () => {
  const computer = new Computer({ a: 5, b: 0, c: 0, program: [7, 2] });
  computer.execute();
  expect({
    text: "Should execute CDV",
    expected: 1,
    result: computer.c,
  });
  expect({
    text: "Should have correct cursor",
    expected: 2,
    result: computer.cursor,
  });
})();

await (async () => {
  const computer = new Computer({ a: 0, b: 2024, c: 43690, program: [4, 0] });
  computer.execute();
  expect({
    text: "Should execute BXC",
    expected: 44354,
    result: computer.b,
  });
  expect({
    text: "Should have correct cursor",
    expected: 2,
    result: computer.cursor,
  });
})();

await (async () => {
  const computer = new Computer({ a: 0, b: 29, c: 0, program: [1, 7] });
  computer.execute();
  expect({
    text: "Should execute BXL",
    expected: 26,
    result: computer.b,
  });
  expect({
    text: "Should have correct cursor",
    expected: 2,
    result: computer.cursor,
  });
})();

await (async () => {
  const computer = await prepareData("./data.test.1.txt");
  computer.execute();
  expect({
    text: "Test case 1: Check output",
    expected: JSON.stringify([4, 6, 3, 5, 6, 3, 5, 2, 1, 0]),
    result: JSON.stringify(computer.output),
  });
})();

await (async () => {
  const computer = new Computer({ a: 2024, b: 0, c: 0, program: [0, 1, 5, 4, 3, 0] });
  computer.execute();
  expect({
    text: "Should execute OUT",
    expected: JSON.stringify([4, 2, 5, 6, 7, 7, 7, 7, 3, 1, 0]),
    result: JSON.stringify(computer.output),
  });
  expect({
    text: "Should have correct a at the end of the execution",
    expected: 0,
    result: computer.a,
  });
})();

await (async () => {
  const computer = new Computer({
    a: 0,
    b: 0,
    c: 0,
    program: [2, 4, 1, 2, 7, 5, 0, 3, 1, 7, 4, 1, 5, 5, 3, 0],
  });
  computer.execute();
  expect({
    text: "Should execute OUT",
    expected: JSON.stringify([5]),
    result: JSON.stringify(computer.output),
  });
  expect({
    text: "Should have correct a at the end of the execution",
    expected: 0,
    result: computer.a,
  });
})();

await (async () => {
  const computer = new Computer({
    a: 1,
    b: 0,
    c: 0,
    program: [2, 4, 1, 2, 7, 5, 0, 3, 1, 7, 4, 1, 5, 5, 3, 0],
  });
  computer.execute();
  expect({
    text: "Should execute OUT",
    expected: JSON.stringify([4]),
    result: JSON.stringify(computer.output),
  });
  expect({
    text: "Should have correct a at the end of the execution",
    expected: 0,
    result: computer.a,
  });
})();

await (async () => {
  const computer = new Computer({
    a: 2,
    b: 0,
    c: 0,
    program: [2, 4, 1, 2, 7, 5, 0, 3, 1, 7, 4, 1, 5, 5, 3, 0],
  });
  computer.execute();
  expect({
    text: "Should execute OUT",
    expected: JSON.stringify([5]),
    result: JSON.stringify(computer.output),
  });
  expect({
    text: "Should have correct a at the end of the execution",
    expected: 0,
    result: computer.a,
  });
})();

await (async () => {
  const computer = new Computer({
    a: 3,
    b: 0,
    c: 0,
    program: [2, 4, 1, 2, 7, 5, 0, 3, 1, 7, 4, 1, 5, 5, 3, 0],
  });
  computer.execute();
  expect({
    text: "Should execute OUT",
    expected: JSON.stringify([7]),
    result: JSON.stringify(computer.output),
  });
  expect({
    text: "Should have correct a at the end of the execution",
    expected: 0,
    result: computer.a,
  });
})();

await (async () => {
  const computer = new Computer({
    a: 4,
    b: 0,
    c: 0,
    program: [2, 4, 1, 2, 7, 5, 0, 3, 1, 7, 4, 1, 5, 5, 3, 0],
  });
  computer.execute();
  expect({
    text: "Should execute OUT",
    expected: JSON.stringify([1]),
    result: JSON.stringify(computer.output),
  });
  expect({
    text: "Should have correct a at the end of the execution",
    expected: 0,
    result: computer.a,
  });
})();

await (async () => {
  const computer = new Computer({
    a: 5,
    b: 0,
    c: 0,
    program: [2, 4, 1, 2, 7, 5, 0, 3, 1, 7, 4, 1, 5, 5, 3, 0],
  });
  computer.execute();
  expect({
    text: "Should execute OUT",
    expected: JSON.stringify([0]),
    result: JSON.stringify(computer.output),
  });
  expect({
    text: "Should have correct a at the end of the execution",
    expected: 0,
    result: computer.a,
  });
})();

await (async () => {
  const computer = new Computer({
    a: 6,
    b: 0,
    c: 0,
    program: [2, 4, 1, 2, 7, 5, 0, 3, 1, 7, 4, 1, 5, 5, 3, 0],
  });
  computer.execute();
  expect({
    text: "Should execute OUT",
    expected: JSON.stringify([3]),
    result: JSON.stringify(computer.output),
  });
  expect({
    text: "Should have correct a at the end of the execution",
    expected: 0,
    result: computer.a,
  });
})();

await (async () => {
  const computer = new Computer({
    a: 7,
    b: 0,
    c: 0,
    program: [2, 4, 1, 2, 7, 5, 0, 3, 1, 7, 4, 1, 5, 5, 3, 0],
  });
  computer.execute();
  expect({
    text: "Should execute OUT",
    expected: JSON.stringify([2]),
    result: JSON.stringify(computer.output),
  });
  expect({
    text: "Should have correct a at the end of the execution",
    expected: 0,
    result: computer.a,
  });
})();

await (async () => {
  const computer = new Computer({
    a: 15, //(8 ** 1 + 7)
    b: 0,
    c: 0,
    program: [2, 4, 1, 2, 7, 5, 0, 3, 1, 7, 4, 1, 5, 5, 3, 0],
  });
  computer.execute();
  expect({
    text: "Should execute OUT",
    expected: JSON.stringify([2, 4]),
    result: JSON.stringify(computer.output),
  });
  expect({
    text: "Should have correct a at the end of the execution",
    expected: 0,
    result: computer.a,
  });
})();

await (async () => {
  const computer = new Computer({
    a: 0o27236017,
    b: 0,
    c: 0,
    program: [2, 4, 1, 2, 7, 5, 0, 3, 1, 7, 4, 1, 5, 5, 3, 0],
  });
  computer.execute();
  expect({
    text: "Should execute OUT",
    expected: JSON.stringify([2, 4, 1, 2, 7, 5, 0, 3, 1, 7]),
    result: JSON.stringify(computer.output),
  });
  expect({
    text: "Should have correct a at the end of the execution",
    expected: 0,
    result: computer.a,
  });
})();

await (async () => {
  const computer = new Computer({
    a: 11361710,
    b: 0,
    c: 0,
    program: [2, 4, 1, 2, 7, 5, 0, 3, 1, 7, 4, 1, 5, 5, 3, 0],
  });
  computer.execute();
  expect({
    text: "Should execute OUT",
    expected: JSON.stringify([1, 7, 4, 1, 5, 5, 3, 0]),
    result: JSON.stringify(computer.output),
  });
  expect({
    text: "Should have correct a at the end of the execution",
    expected: 0,
    result: computer.a,
  });
})();

await (async () => {
  const computer = await prepareData("./data.test.2.txt");
  computer.copyProgram();
  expect({
    text: "Test case Part 2: Check expected A Register for having the same output as program",
    expected: 117440,
    result: computer.expectedA,
  });
})();
