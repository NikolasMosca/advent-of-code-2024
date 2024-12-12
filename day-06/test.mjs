import { nextGuardMove } from "./utils.mjs";
import { cache } from "./utils.mjs";
import { getPositionGuard } from "./utils.mjs";
import { prepareData } from "./utils.mjs";

const expect = ({ text, result, expected }) => {
  if (result !== expected) {
    console.error(`=== ERROR [${text}]\n Test failed: [result = ${result}] !== [expected = ${expected}]`);
  } else {
    console.log(`SUCCESS [${text}]`);
  }
};

const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

cache.clear();
await (async () => {
  let map = await prepareData("./data.test.txt");
  expect({
    text: "Can get the correct position of the guard",
    expected: JSON.stringify([6, 4]),
    result: JSON.stringify(getPositionGuard({ map })),
  });

  // Test execution
  let result = null;
  do {
    result = nextGuardMove({ map });
    map = result.map;
  } while (result.finish === false);

  expect({
    text: "Check test map",
    expected: JSON.stringify(
      {
        map: [
          "....#.....",
          "....XXXXX#",
          "....X...X.",
          "..#.X...X.",
          "..XXXXX#X.",
          "..X.X.X.X.",
          ".#XXXXXXX.",
          ".XXXXXXX#.",
          "#XXXXXXX..",
          "......#X..",
        ],
        finish: true,
        loop: false,
      },
      null,
      2
    ),
    result: JSON.stringify({ ...result, map: map.map((row) => row.join("")) }, null, 2),
  });
})();

cache.clear();
await (async () => {
  let map = await prepareData("./data.test.loop.txt");

  // Test execution
  let result = null;
  do {
    result = nextGuardMove({ map });
    map = result.map;
  } while (result.finish === false);

  expect({
    text: "Check loop map",
    expected: JSON.stringify(
      {
        map: [
          "....#.....",
          "....XXXXX#",
          "....X...X.",
          "..#.X...X.",
          "....X..#X.",
          "....X...X.",
          ".#.#^XXXX.",
          "........#.",
          "#.........",
          "......#...",
        ],
        finish: true,
        loop: true,
      },
      null,
      2
    ),
    result: JSON.stringify({ ...result, map: map.map((row) => row.join("")) }, null, 2),
  });
})();

cache.clear();
await (async () => {
  let map = await prepareData("./data.test.loop.2.txt");

  // Test execution
  let result = null;
  do {
    result = nextGuardMove({ map });
    map = result.map;
  } while (result.finish === false);

  expect({
    text: "Check loop map 2",
    expected: JSON.stringify(
      {
        map: [
          "....#.....",
          "....XXXXX#",
          "....X...X.",
          "..#.X...X.",
          "..XXXXX#X.",
          "..X.X.X.X.",
          ".#XXXX<XX.",
          "......#.#.",
          "#.........",
          "......#...",
        ],
        finish: true,
        loop: true,
      },
      null,
      2
    ),
    result: JSON.stringify({ ...result, map: map.map((row) => row.join("")) }, null, 2),
  });
})();

cache.clear();
await (async () => {
  let map = await prepareData("./data.test.loop.3.txt");

  // Test execution
  let result = null;
  do {
    result = nextGuardMove({ map });
    map = result.map;
  } while (result.finish === false);

  expect({
    text: "Check loop map 3",
    expected: JSON.stringify(
      {
        map: [
          "....#.....",
          "....XXXXX#",
          "....X...X.",
          "..#.X...X.",
          "..XXXXX#X.",
          "..X.X.X.X.",
          ".#XXXXXXX.",
          ".XXXXXv##.",
          "#XXXXXX...",
          "......#...",
        ],
        finish: true,
        loop: true,
      },
      null,
      2
    ),
    result: JSON.stringify({ ...result, map: map.map((row) => row.join("")) }, null, 2),
  });
})();

cache.clear();
await (async () => {
  let map = await prepareData("./data.test.loop.4.txt");

  // Test execution
  let result = null;
  do {
    result = nextGuardMove({ map });
    map = result.map;
  } while (result.finish === false);

  expect({
    text: "Check loop map 4",
    expected: JSON.stringify(
      {
        map: [
          "....#.....",
          "....XXXXX#",
          "....X...X.",
          "..#.X...X.",
          "..>XXXX#X.",
          "..X.X.X.X.",
          ".#XXXXXXX.",
          "..X...X.#.",
          "##XXXXX...",
          "......#...",
        ],
        finish: true,
        loop: true,
      },
      null,
      2
    ),
    result: JSON.stringify({ ...result, map: map.map((row) => row.join("")) }, null, 2),
  });
})();

cache.clear();
await (async () => {
  let map = await prepareData("./data.test.loop.5.txt");

  // Test execution
  let result = null;
  do {
    result = nextGuardMove({ map });
    map = result.map;
  } while (result.finish === false);

  expect({
    text: "Check loop map 5",
    expected: JSON.stringify(
      {
        map: [
          "....#.....",
          "....>XXXX#",
          "....X...X.",
          "..#.X...X.",
          "..XXXXX#X.",
          "..X.X.X.X.",
          ".#XXXXXXX.",
          "....X.X.#.",
          "#..#XXX...",
          "......#...",
        ],
        finish: true,
        loop: true,
      },
      null,
      2
    ),
    result: JSON.stringify({ ...result, map: map.map((row) => row.join("")) }, null, 2),
  });
})();

cache.clear();
await (async () => {
  let map = await prepareData("./data.test.loop.6.txt");

  // Test execution
  let result = null;
  do {
    result = nextGuardMove({ map });
    map = result.map;
  } while (result.finish === false);

  expect({
    text: "Check loop map 6",
    expected: JSON.stringify(
      {
        map: [
          "....#.....",
          "....XXXXX#",
          "....X...X.",
          "..#.X...X.",
          "..XXXXX#X.",
          "..X.X.X.X.",
          ".#XXXXXXX.",
          ".XXXXXXX#.",
          "#XXXXXX<..",
          "......##..",
        ],
        finish: true,
        loop: true,
      },
      null,
      2
    ),
    result: JSON.stringify({ ...result, map: map.map((row) => row.join("")) }, null, 2),
  });
})();

cache.clear();
await (async () => {
  let map = await prepareData("./data.test.loop.7.txt");

  // Test execution
  let result = null;
  do {
    result = nextGuardMove({ map });
    map = result.map;
  } while (result.finish === false);

  expect({
    text: "Check loop map 7",
    expected: JSON.stringify(
      {
        map: [
          "....#.....",
          "....XXXXX#",
          "....X...X.",
          "..#.X...X.",
          "..XXX#.#X.",
          "..X.X...X.",
          ".#XXXXXXX.",
          "....X...#.",
          "#...X.....",
          "....X.#...",
        ],
        finish: true,
        loop: false,
      },
      null,
      2
    ),
    result: JSON.stringify({ ...result, map: map.map((row) => row.join("")) }, null, 2),
  });
})();

cache.clear();
expect({
  text: "Guard can move up",
  expected: JSON.stringify({ map: [".^.".split(""), ".X.".split("")], finish: false, loop: false }),
  result: JSON.stringify(nextGuardMove({ map: ["...".split(""), ".^.".split("")] })),
});
cache.clear();
expect({
  text: "Guard can move down",
  expected: JSON.stringify({ map: [".X.".split(""), ".v.".split("")], finish: false, loop: false }),
  result: JSON.stringify(nextGuardMove({ map: [".v.".split(""), "...".split("")] })),
});
cache.clear();
expect({
  text: "Guard can move right",
  expected: JSON.stringify({ map: [".X>".split("")], finish: false, loop: false }),
  result: JSON.stringify(nextGuardMove({ map: [".>.".split("")] })),
});
cache.clear();
expect({
  text: "Guard can move left",
  expected: JSON.stringify({ map: ["<X.".split("")], finish: false, loop: false }),
  result: JSON.stringify(nextGuardMove({ map: [".<.".split("")] })),
});

cache.clear();
expect({
  text: "If guard find an obstacle on the right, then move to down direction",
  expected: JSON.stringify({ map: [".v#".split("")], finish: false, loop: false }),
  result: JSON.stringify(nextGuardMove({ map: [".>#".split("")] })),
});
cache.clear();
expect({
  text: "If guard find an obstacle on the down, then move to left direction",
  expected: JSON.stringify({ map: [".<.".split(""), ".#.".split("")], finish: false, loop: false }),
  result: JSON.stringify(nextGuardMove({ map: [".v.".split(""), ".#.".split("")] })),
});
cache.clear();
expect({
  text: "If guard find an obstacle on the left, then move to up direction",
  expected: JSON.stringify({ map: ["#^.".split("")], finish: false, loop: false }),
  result: JSON.stringify(nextGuardMove({ map: ["#<.".split("")] })),
});
cache.clear();
expect({
  text: "If guard find an obstacle on the up, then move to right direction",
  expected: JSON.stringify({ map: [".#.".split(""), ".>.".split("")], finish: false, loop: false }),
  result: JSON.stringify(nextGuardMove({ map: [".#.".split(""), ".^.".split("")] })),
});
cache.clear();
expect({
  text: "If guard reaches the end of the map, then returns true",
  expected: JSON.stringify({ map: [".X.".split("")], finish: true, loop: false }),
  result: JSON.stringify(nextGuardMove({ map: [".^.".split("")] })),
});

cache.clear();
cache.set("standard_change_direction", true);
expect({
  text: "Check loop detection",
  expected: JSON.stringify(
    {
      map: [
        "....#.....",
        "....XXXXX#",
        "....X...X.",
        "..#.X...X.",
        "..>XXXX#X.",
        "..X.X.X.X.",
        ".#XXXXXXX.",
        "......#.#.",
        "#.........",
        "......#..."
      ],
      finish: true,
      loop: true,
    },
    null,
    2
  ),
  result: (() => {
    const result = nextGuardMove({
      map: [
        "....#.....".split(""),
        "....XXXXX#".split(""),
        "....X...X.".split(""),
        "..#.X...X.".split(""),
        "..>XXXX#X.".split(""),
        "..X.X.X.X.".split(""),
        ".#XXXXXXX.".split(""),
        "......#.#.".split(""),
        "#.........".split(""),
        "......#...".split(""),
      ],
    });
    return JSON.stringify({ ...result, map: result.map.map((row) => row.join("")) }, null, 2);
  })(),
});
