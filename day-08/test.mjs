import { ANTINODE, createAntiNodes, prepareData } from "./utils.mjs";

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
  const map = await prepareData("./data.test.1.txt");
  expect({
    text: "Test case 1",
    expected: JSON.stringify(
      [
        "..........",
        "...#......",
        "..........",
        "....a.....",
        "..........",
        ".....a....",
        "..........",
        "......#...",
        "..........",
        "..........",
      ],
      null,
      2
    ),
    result: JSON.stringify(
      createAntiNodes({ map }).map((item) => item.join("")),
      null,
      2
    ),
  });
})();

await (async () => {
  const map = await prepareData("./data.test.2.txt");
  expect({
    text: "Test case 2",
    expected: JSON.stringify(
      [
        "..........",
        "...#......",
        "#.........",
        "....a.....",
        "........a.",
        ".....a....",
        "..#.......",
        "......#...",
        "..........",
        "..........",
      ],
      null,
      2
    ),
    result: JSON.stringify(
      createAntiNodes({ map }).map((item) => item.join("")),
      null,
      2
    ),
  });
})();

await (async () => {
  const map = await prepareData("./data.test.3.txt");
  expect({
    text: "Test case 3",
    expected: JSON.stringify(
      [
        "..........",
        "...#......",
        "#.........",
        "....a.....",
        "........a.",
        ".....a....",
        "..#.......",
        "......#...",
        "..........",
        "..........",
      ],
      null,
      2
    ),
    result: JSON.stringify(
      createAntiNodes({ map }).map((item) => item.join("")),
      null,
      2
    ),
  });
})();

await (async () => {
  const map = await prepareData("./data.test.4.txt");
  expect({
    text: "Test case 4",
    expected: JSON.stringify(
      [
        "......#....#",
        "...#....0...",
        "....#0....#.",
        "..#....0....",
        "....0....#..",
        ".#....#.....",
        "...#........",
        "#......#....",
        "........A...",
        ".........A..",
        "..........#.",
        "..........#.",
      ],
      null,
      2
    ),
    result: JSON.stringify(
      createAntiNodes({ map }).map((item) => item.join("")),
      null,
      2
    ),
  });
})();

await (async () => {
  const map = await prepareData("./data.test.5.txt");
  expect({
    text: "Test case 5",
    expected: JSON.stringify(
      [
        "#....#....",
        "...#......",
        ".#....#...",
        ".........#",
        "..#.......",
        "..........",
        "...#......",
        "..........",
        "....#.....",
        "..........",
      ],
      null,
      2
    ),
    result: JSON.stringify(
      createAntiNodes({ map, mode: "EXPAND" }).map((item) => item.join("")),
      null,
      2
    ),
  });
})();

await (async () => {
  const map = await prepareData("./data.test.6.txt");
  expect({
    text: "Test case 6",
    expected: JSON.stringify(
      [
        "##....#....#",
        ".#.#....#...",
        "..#.##....#.",
        "..##...#....",
        "....#....#..",
        ".#...##....#",
        "...#..#.....",
        "#....#.#....",
        "..#.....#...",
        "....#....#..",
        ".#........#.",
        "...#......##",
      ],
      null,
      2
    ),
    result: JSON.stringify(
      createAntiNodes({ map, mode: "EXPAND" }).map((item) => item.join("")),
      null,
      2
    ),
  });
})();

await (async () => {
  const map = await prepareData("./data.test.7.txt");
  expect({
    text: "Test case 7",
    expected: JSON.stringify(["#....", ".#...", "..#..", "...#.", "....#"], null, 2),
    result: JSON.stringify(
      createAntiNodes({ map, mode: "EXPAND" }).map((item) => item.join("")),
      null,
      2
    ),
  });
})();

await (async () => {
  const map = await prepareData("./data.test.8.txt");
  expect({
    text: "Test case 8",
    expected: JSON.stringify(["#....", ".#...", "..#..", "...#.", "....#"], null, 2),
    result: JSON.stringify(
      createAntiNodes({ map, mode: "EXPAND" }).map((item) => item.join("")),
      null,
      2
    ),
  });
})();