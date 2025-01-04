import { expect, prepareData } from "./utils.mjs";

await (async () => {
  const maze = await prepareData("./data.test.1.txt", [6, 6], 12);
  expect({
    text: "Should expect exact map after 12 bytes",
    expected: JSON.stringify(
      ["S..#...", "..#..#.", "....#..", "...#..#", "..#..#.", ".#..#..", "#.#...E"],
      null,
      2
    ),
    result: JSON.stringify(
      maze.map.map((item) => item.join("")),
      null,
      2
    ),
  });

  const { simulation } = await maze.resolve();
  expect({
    text: "Should expect best steps for this maze",
    expected: 22,
    result: simulation.steps,
  });
})();

await (async () => {
  const maze = await prepareData("./data.test.1.txt", [70, 70], 25);
  const { simulation } = await maze.resolve();
  expect({
    text: "Should expect best steps for this maze",
    expected: 146,
    result: simulation.steps,
  });
})();
