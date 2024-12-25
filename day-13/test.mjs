import { getBestCombination, prepareData } from "./utils.mjs";

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
  const slots = await prepareData("./data.test.1.txt");
  expect({
    text: "Test case: prize 1",
    expected: JSON.stringify({ a: 80, b: 40, cost: 280 }, null, 2),
    result: JSON.stringify(getBestCombination(slots[0]), null, 2),
  });
  expect({
    text: "Test case: prize 2",
    expected: JSON.stringify({ a: 0, b: 0, cost: 0 }, null, 2),
    result: JSON.stringify(getBestCombination(slots[1]), null, 2),
  });
  expect({
    text: "Test case: prize 3",
    expected: JSON.stringify({ a: 38, b: 86, cost: 200 }, null, 2),
    result: JSON.stringify(getBestCombination(slots[2]), null, 2),
  });
  expect({
    text: "Test case: prize 4",
    expected: JSON.stringify({ a: 0, b: 0, cost: 0 }, null, 2),
    result: JSON.stringify(getBestCombination(slots[3]), null, 2),
  });
  expect({
    text: "Test case: best amount of tokens",
    expected: 480,
    result: slots
      .map(getBestCombination)
      .reduce((prev, current) => prev + current.cost, 0),
  });
})();

await (async () => {
  const slots = await prepareData("./data.test.3.txt");
  expect({
    text: "Test case: prize 1",
    expected: 0,
    result: getBestCombination(slots[0]).cost,
  });
  expect({
    text: "Test case: prize 2",
    expected: JSON.stringify({ a: 98, b: 28, cost: 322 }, null, 2),
    result: JSON.stringify(getBestCombination(slots[1]), null, 2),
  });
  expect({
    text: "Test case: prize 3",
    expected: JSON.stringify({ a: 0, b: 0, cost: 0 }, null, 2),
    result: JSON.stringify(getBestCombination(slots[2]), null, 2),
  });
  expect({
    text: "Test case: prize 4",
    expected: JSON.stringify({ a: 0, b: 0, cost: 0 }, null, 2),
    result: JSON.stringify(getBestCombination(slots[3]), null, 2),
  });
  expect({
    text: "Test case: prize 5",
    expected: JSON.stringify({ a: 79, b: 91, cost: 328 }, null, 2),
    result: JSON.stringify(getBestCombination(slots[4]), null, 2),
  });
  expect({
    text: "Test case: prize 6",
    expected: JSON.stringify({ a: 0, b: 0, cost: 0 }, null, 2),
    result: JSON.stringify(getBestCombination(slots[5]), null, 2),
  });
  expect({
    text: "Test case: prize 7",
    expected: JSON.stringify({ a: 0, b: 0, cost: 0 }, null, 2),
    result: JSON.stringify(getBestCombination(slots[6]), null, 2),
  });
  expect({
    text: "Test case: prize 8",
    expected: JSON.stringify({ a: 0, b: 0, cost: 0 }, null, 2),
    result: JSON.stringify(getBestCombination(slots[7]), null, 2),
  });
  expect({
    text: "Test case: prize 9",
    expected: JSON.stringify({ a: 94, b: 20, cost: 302 }, null, 2),
    result: JSON.stringify(getBestCombination(slots[8]), null, 2),
  });
  expect({
    text: "Test case: prize 10",
    expected: JSON.stringify({ a: 60, b: 60, cost: 240 }, null, 2),
    result: JSON.stringify(getBestCombination(slots[9]), null, 2),
  });
  expect({
    text: "Test case: prize 11",
    expected: JSON.stringify({ a: 48, b: 64, cost: 208 }, null, 2),
    result: JSON.stringify(getBestCombination(slots[10]), null, 2),
  });
  expect({
    text: "Test case: prize 12",
    expected: JSON.stringify({ a: 59, b: 47, cost: 224 }, null, 2),
    result: JSON.stringify(getBestCombination(slots[11]), null, 2),
  });
  expect({
    text: "Test case: prize 13",
    expected: JSON.stringify({ a: 8, b: 43, cost: 67 }, null, 2),
    result: JSON.stringify(getBestCombination(slots[12]), null, 2),
  });
  expect({
    text: "Test case: prize 14",
    expected: JSON.stringify({ a: 8, b: 22, cost: 46 }, null, 2),
    result: JSON.stringify(getBestCombination(slots[13]), null, 2),
  });
  expect({
    text: "Test case: prize 15",
    expected: JSON.stringify({ a: 59, b: 61, cost: 238 }, null, 2),
    result: JSON.stringify(getBestCombination(slots[14]), null, 2),
  });
  expect({
    text: "Test case: prize 16",
    expected: JSON.stringify({ a: 0, b: 0, cost: 0 }, null, 2),
    result: JSON.stringify(getBestCombination(slots[15]), null, 2),
  });
  expect({
    text: "Test case: prize 17",
    expected: JSON.stringify({ a: 66, b: 93, cost: 291 }, null, 2),
    result: JSON.stringify(getBestCombination(slots[16]), null, 2),
  });
  expect({
    text: "Test case: prize 18",
    expected: JSON.stringify({ a: 0, b: 0, cost: 0 }, null, 2),
    result: JSON.stringify(getBestCombination(slots[17]), null, 2),
  });
  expect({
    text: "Test case: prize 19",
    expected: JSON.stringify({ a: 59, b: 72, cost: 249 }, null, 2),
    result: JSON.stringify(getBestCombination(slots[18]), null, 2),
  });
  expect({
    text: "Test case: prize 20",
    expected: JSON.stringify({ a: 16, b: 5, cost: 53 }, null, 2),
    result: JSON.stringify(getBestCombination(slots[19]), null, 2),
  });
  expect({
    text: "Test case: prize 21",
    expected: JSON.stringify({ a: 0, b: 0, cost: 0 }, null, 2),
    result: JSON.stringify(getBestCombination(slots[20]), null, 2),
  });
  expect({
    text: "Test case: prize 22",
    expected: JSON.stringify({ a: 10, b: 52, cost: 82 }, null, 2),
    result: JSON.stringify(getBestCombination(slots[21]), null, 2),
  });
  expect({
    text: "Test case: prize 23",
    expected: JSON.stringify({ a: 0, b: 0, cost: 0 }, null, 2),
    result: JSON.stringify(getBestCombination(slots[22]), null, 2),
  });
})();

await (async () => {
  const slots = await prepareData("./data.test.4.txt");
  expect({
    text: "Test case: best amount of tokens",
    expected: 650,
    result: slots
      .map(getBestCombination)
      .reduce((prev, current) => prev + current.cost, 0),
  });
})();

await (async () => {
  const slots = await prepareData("./data.test.5.txt");
  expect({
    text: "Test case: prize 1",
    expected: JSON.stringify({ a: 97, b: 40, cost: 331 }, null, 2),
    result: JSON.stringify(getBestCombination(slots[0]), null, 2),
  });
  expect({
    text: "Test case: prize 2",
    expected: JSON.stringify({ a: 5, b: 9, cost: 24 }, null, 2),
    result: JSON.stringify(getBestCombination(slots[1]), null, 2),
  });
})();

await (async () => {
  const slots = await prepareData("./data.test.6.txt");
  for (let i = 0; i < slots.length; i++) {
    slots[i].prize.x += 10000000000000;
    slots[i].prize.y += 10000000000000;
  }

  expect({
    text: "Test case: best amount of tokens prize 1 for part 2",
    expected: JSON.stringify(
      { a: 103626943010, b: 155440414824, cost: 466321243854 },
      null,
      2
    ),
    result: JSON.stringify(
      getBestCombination({
        disableMaxButtonPress: true,
        ...slots[0],
      }),
      null,
      2
    ),
  });

  expect({
    text: "Test case: best amount of tokens prize 2 for part 2",
    expected: JSON.stringify(
      { a: 141587092819, b: 105367138755, cost: 530128417212 },
      null,
      2
    ),
    result: JSON.stringify(
      getBestCombination({
        disableMaxButtonPress: true,
        ...slots[1],
      }),
      null,
      2
    ),
  });

  expect({
    text: "Test case: best amount of tokens prize 3 for part 2",
    expected: JSON.stringify(
      { a: 0, b: 0, cost: 0 },
      null,
      2
    ),
    result: JSON.stringify(
      getBestCombination({
        disableMaxButtonPress: true,
        ...slots[2],
      }),
      null,
      2
    ),
  });

  expect({
    text: "Test case: best amount of tokens prize 4 for part 2",
    expected: JSON.stringify(
      { a: 108695652194, b: 108695652511, cost: 434782609093 },
      null,
      2
    ),
    result: JSON.stringify(
      getBestCombination({
        disableMaxButtonPress: true,
        ...slots[3],
      }),
      null,
      2
    ),
  });

  expect({
    text: "Test case: best amount of tokens prize 5 for part 2",
    expected: JSON.stringify(
      { a: 0, b: 0, cost: 0 },
      null,
      2
    ),
    result: JSON.stringify(
      getBestCombination({
        disableMaxButtonPress: true,
        ...slots[4],
      }),
      null,
      2
    ),
  });

  expect({
    text: "Test case: best amount of tokens prize 6 for part 2",
    expected: JSON.stringify(
      { a: 0, b: 0, cost: 0 },
      null,
      2
    ),
    result: JSON.stringify(
      getBestCombination({
        disableMaxButtonPress: true,
        ...slots[5],
      }),
      null,
      2
    ),
  });

  expect({
    text: "Test case: best amount of tokens prize 8 for part 2",
    expected: JSON.stringify(
      { a: 116110304882, b: 163280116401, cost: 511611031047 },
      null,
      2
    ),
    result: JSON.stringify(
      getBestCombination({
        disableMaxButtonPress: true,
        ...slots[7],
      }),
      null,
      2
    ),
  });

  expect({
    text: "Test case: best amount of tokens prize 9 for part 2",
    expected: JSON.stringify(
      { a: 0, b: 0, cost: 0 },
      null,
      2
    ),
    result: JSON.stringify(
      getBestCombination({
        disableMaxButtonPress: true,
        ...slots[8],
      }),
      null,
      2
    ),
  });

  expect({
    text: "Test case: best amount of tokens prize 10 for part 2",
    expected: JSON.stringify(
      { a: 0, b: 0, cost: 0 },
      null,
      2
    ),
    result: JSON.stringify(
      getBestCombination({
        disableMaxButtonPress: true,
        ...slots[9],
      }),
      null,
      2
    ),
  });

  expect({
    text: "Test case: best amount of tokens prize 11 for part 2",
    expected: JSON.stringify(
      { a: 104638009070, b: 144230769254, cost: 458144796464 },
      null,
      2
    ),
    result: JSON.stringify(
      getBestCombination({
        disableMaxButtonPress: true,
        ...slots[10],
      }),
      null,
      2
    ),
  });

  expect({
    text: "Test case: best amount of tokens prize 12 for part 2",
    expected: JSON.stringify(
      { a: 109514031683, b: 102669404668, cost: 431211499717 },
      null,
      2
    ),
    result: JSON.stringify(
      getBestCombination({
        disableMaxButtonPress: true,
        ...slots[11],
      }),
      null,
      2
    ),
  });

  expect({
    text: "Test case: best amount of tokens prize 13 for part 2",
    expected: JSON.stringify(
      { a: 0, b: 0, cost: 0 },
      null,
      2
    ),
    result: JSON.stringify(
      getBestCombination({
        disableMaxButtonPress: true,
        ...slots[12],
      }),
      null,
      2
    ),
  });

  expect({
    text: "Test case: best amount of tokens prize 14 for part 2",
    expected: JSON.stringify(
      { a: 123376623473, b: 207792208166, cost: 577922078585 },
      null,
      2
    ),
    result: JSON.stringify(
      getBestCombination({
        disableMaxButtonPress: true,
        ...slots[13],
      }),
      null,
      2
    ),
  });

  expect({
    text: "Test case: best amount of tokens prize 15 for part 2",
    expected: JSON.stringify(
      { a: 135281385398, b: 105519480599, cost: 511363636793 },
      null,
      2
    ),
    result: JSON.stringify(
      getBestCombination({
        disableMaxButtonPress: true,
        ...slots[14],
      }),
      null,
      2
    ),
  });
})();
