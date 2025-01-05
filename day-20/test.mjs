import { expect, prepareData } from "./utils.mjs";

await (async () => {
  const maze = await prepareData("./data.test.1.txt");
  const { simulation } = await maze.resolve();
  expect({
    text: "Should expect best steps for this maze",
    expected: 84,
    result: simulation.steps,
  });

  const results = await maze.resolveCheatMaps();
  expect({
    text: "There are 14 cheats that save 2 picoseconds",
    expected: 14,
    result: results["2"],
  });
  expect({
    text: "There are 14 cheats that save 4 picoseconds",
    expected: 14,
    result: results["4"],
  });
  expect({
    text: "There are 2 cheats that save 6 picoseconds",
    expected: 2,
    result: results["6"],
  });
  expect({
    text: "There are 4 cheats that save 8 picoseconds",
    expected: 4,
    result: results["8"],
  });
  expect({
    text: "There are 2 cheats that save 10 picoseconds",
    expected: 2,
    result: results["10"],
  });
  expect({
    text: "There are 3 cheats that save 12 picoseconds",
    expected: 3,
    result: results["12"],
  });
  expect({
    text: "There are 1 cheats that save 20 picoseconds",
    expected: 1,
    result: results["20"],
  });
  expect({
    text: "There are 1 cheats that save 36 picoseconds",
    expected: 1,
    result: results["36"],
  });
  expect({
    text: "There are 1 cheats that save 38 picoseconds",
    expected: 1,
    result: results["38"],
  });
  expect({
    text: "There are 1 cheats that save 40 picoseconds",
    expected: 1,
    result: results["40"],
  });
  expect({
    text: "There are 1 cheats that save 64 picoseconds",
    expected: 1,
    result: results["64"],
  });
})();