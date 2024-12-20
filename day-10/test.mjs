import { findHikingTrails, findNextPosition, getTrailheads } from "./utils.mjs";

const expect = ({ text, result, expected }) => {
  if (result !== expected) {
    console.error(
      `=== ERROR [${text}]\n Test failed: [result = ${result}] !== [expected = ${expected}]`
    );
  } else {
    console.log(`SUCCESS [${text}]`);
  }
};

expect({
  text: "Test case 1: Should find all trailheads",
  expected: "[[3,0],[7,0],[10,1],[8,2],[4,3],[10,3],[3,4],[7,4],[3,5],[7,5],[3,6],[7,6]]",
  result: JSON.stringify(
    getTrailheads({
      map: [
        "423098301248".split("").map((item) => Number(item)),
        "679898798709".split("").map((item) => Number(item)),
        "476587590467".split("").map((item) => Number(item)),
        "r78209438109".split("").map((item) => Number(item)),
        "423098301248".split("").map((item) => Number(item)),
        "423098301248".split("").map((item) => Number(item)),
        "423098301248".split("").map((item) => Number(item)),
      ],
    })
  ),
});

expect({
  text: "Test case 2: Find next position",
  expected: "[[1,0],[0,1],[2,1],[1,2]]",
  result: JSON.stringify(
    findNextPosition({
      x: 1,
      y: 1,
      value: 2,
      map: [
        "333".split("").map((item) => Number(item)),
        "323".split("").map((item) => Number(item)),
        "333".split("").map((item) => Number(item)),
      ],
    })
  ),
});

expect({
  text: "Test case 3: Find hiking trails",
  expected: 36,
  result: findHikingTrails({
    map: [
      "89010123".split("").map((item) => Number(item)),
      "78121874".split("").map((item) => Number(item)),
      "87430965".split("").map((item) => Number(item)),
      "96549874".split("").map((item) => Number(item)),
      "45678903".split("").map((item) => Number(item)),
      "32019012".split("").map((item) => Number(item)),
      "01329801".split("").map((item) => Number(item)),
      "10456732".split("").map((item) => Number(item)),
    ],
  }).reduce((prev, { choices }) => prev + choices.length, 0),
});

expect({
  text: "Test case 4: Find hiking trails with rating mode",
  expected: 81,
  result: findHikingTrails({
    mode: "RATING",
    map: [
      "89010123".split("").map((item) => Number(item)),
      "78121874".split("").map((item) => Number(item)),
      "87430965".split("").map((item) => Number(item)),
      "96549874".split("").map((item) => Number(item)),
      "45678903".split("").map((item) => Number(item)),
      "32019012".split("").map((item) => Number(item)),
      "01329801".split("").map((item) => Number(item)),
      "10456732".split("").map((item) => Number(item)),
    ],
  }).reduce((prev, { rating }) => prev + rating, 0),
});
