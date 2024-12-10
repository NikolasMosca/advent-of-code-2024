import { prepareData, wordSearch } from "./utils.mjs";

const expect = ({ text, result, expected }) => {
  if (result !== expected) {
    console.error(`=== ERROR [${text}] - Test failed: ${result} !== ${expected}`);
  } else {
    console.log(`SUCCESS [${text}]`);
  }
};

expect({
  text: "It can be search on horizontal way",
  expected: 1,
  result: wordSearch({
    matrix: ["XMAS".split("")],
    x: 0,
    y: 0,
  }),
});

expect({
  text: "It can be search on horizontal way on reversed mode",
  expected: 1,
  result: wordSearch({
    matrix: ["SAMX".split("")],
    x: 3,
    y: 0,
  }),
});

expect({
  text: "It can be search on vertical way",
  expected: 1,
  result: wordSearch({
    matrix: [["X"], ["M"], ["A"], ["S"]],
    x: 0,
    y: 0,
  }),
});

expect({
  text: "It can be search on vertical way on reversed mode",
  expected: 1,
  result: wordSearch({
    matrix: [["S"], ["A"], ["M"], ["X"]],
    x: 0,
    y: 3,
  }),
});

expect({
  text: "It can be search on diagonal way",
  expected: 1,
  result: wordSearch({
    matrix: [["X"], [".", "M"], [".", ".", "A"], [".", ".", ".", "S"]],
    x: 0,
    y: 0,
  }),
});

expect({
  text: "It can be search on diagonal way on reversed mode",
  expected: 1,
  result: wordSearch({
    matrix: [["S"], [".", "A"], [".", ".", "M"], [".", ".", ".", "X"]],
    x: 3,
    y: 3,
  }),
});

expect({
  text: "It can be found all directions",
  expected: 8,
  result: wordSearch({
    matrix: [
      ".S..S..S....".split(""),
      "..A.A.A.....".split(""),
      "...MMM......".split(""),
      ".SAMXMAS....".split(""),
      "...MMM......".split(""),
      "..A.A.A.....".split(""),
      ".S..S..S....".split(""),
    ],
    x: 4,
    y: 3,
  }),
});

await (async () => {
  const matrix = await prepareData("./data.test.txt");
  expect({
    text: "Replicates example results to check if the counter works well",
    expected: 18,
    result: matrix.reduce((counter, row, x) => {
      return (
        counter +
        row.reduce((counter, _, y) => {
          return counter + wordSearch({ matrix, x, y });
        }, 0)
      );
    }, 0),
  });
})();

expect({
  text: "It can be work with the SHAPE mode",
  expected: 1,
  result: wordSearch({
    word: "MAS",
    matrix: ["M.S".split(""), ".A.".split(""), "M.S".split("")],
    x: 1,
    y: 1,
    type: "SHAPE",
  }),
});

await (async () => {
  const matrix = await prepareData("./data.test-2.txt");
  expect({
    text: "Replicates example results for part 2 to check if the counter works well",
    expected: 9,
    result: matrix.reduce((counter, row, x) => {
      return (
        counter +
        row.reduce((counter, _, y) => {
          return counter + wordSearch({ matrix, x, y, word: "MAS", type: "SHAPE" });
        }, 0)
      );
    }, 0),
  });
})();
