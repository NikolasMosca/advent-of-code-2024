import { prepareData } from "./utils.mjs";

const expect = ({ text, result, expected }) => {
  if (result !== expected) {
    console.error(
      `=== ERROR [${text}]\n Test failed: [result = ${result}] !== [expected = ${expected}]`
    );
  } else {
    console.log(`SUCCESS [${text}]`);
  }
};

await (async () => {
  const maze = await prepareData("./data.test.1.txt");

  expect({
    text: "Test case: reindeer should find correctly",
    expected: JSON.stringify([1, 13]),
    result: JSON.stringify(maze.findReindeer()),
  });

  await maze.resolve();
  const [bestSimulation] = maze.calculateBestSimulation();
  expect({
    text: "Test case: correct best score",
    expected: 7036,
    result: bestSimulation.score,
  });
  expect({
    text: "Test case: correct steps",
    expected: 36,
    result: bestSimulation.steps,
  });
  expect({
    text: "Test case: correct turns",
    expected: 7,
    result: bestSimulation.turns,
  });
  expect({
    text: "Test case: correct best tiles",
    expected: 45,
    result: maze.tiles.size,
  });
})();

await (async () => {
  const maze = await prepareData("./data.test.2.txt");

  expect({
    text: "Test case: reindeer should find correctly",
    expected: JSON.stringify([1, 15]),
    result: JSON.stringify(maze.findReindeer()),
  });

  await maze.resolve();
  const [bestSimulation] = maze.calculateBestSimulation();
  expect({
    text: "Test case: correct best score",
    expected: 11048,
    result: bestSimulation.score,
  });
  expect({
    text: "Test case: correct steps",
    expected: 48,
    result: bestSimulation.steps,
  });
  expect({
    text: "Test case: correct turns",
    expected: 11,
    result: bestSimulation.turns,
  });
  expect({
    text: "Test case: correct best tiles",
    expected: 64,
    result: maze.tiles.size,
  });
})();
