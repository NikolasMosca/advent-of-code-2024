import {
  evalLeftToRight,
  generateCombinations,
  OPERATOR_ADD,
  OPERATOR_COMBINE,
  OPERATOR_MULTIPLY,
  prepareData,
  resolveEquation,
} from "./utils.mjs";

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
  text: "Resolve equation case 1",
  expected: JSON.stringify({ isResolvable: true, possibilities: ["10 * 19"] }, null, 2),
  result: JSON.stringify(
    resolveEquation({
      testValue: 190,
      equations: [10, 19],
    }),
    null,
    2
  ),
});

expect({
  text: "Resolve equation case 2",
  expected: JSON.stringify(
    { isResolvable: true, possibilities: ["81 + 40 * 27", "81 * 40 + 27"] },
    null,
    2
  ),
  result: JSON.stringify(
    resolveEquation({
      testValue: 3267,
      equations: [81, 40, 27],
    }),
    null,
    2
  ),
});

expect({
  text: "Resolve equation case 3",
  expected: JSON.stringify(
    { isResolvable: true, possibilities: ["11 + 6 * 16 + 20"] },
    null,
    2
  ),
  result: JSON.stringify(
    resolveEquation({
      testValue: 292,
      equations: [11, 6, 16, 20],
    }),
    null,
    2
  ),
});

expect({
  text: "Resolve equation case 4",
  expected: JSON.stringify({ isResolvable: true, possibilities: ["15 || 6"] }, null, 2),
  result: JSON.stringify(
    resolveEquation({
      testValue: 156,
      equations: [15, 6],
      operations: [OPERATOR_ADD, OPERATOR_MULTIPLY, OPERATOR_COMBINE],
    }),
    null,
    2
  ),
});

expect({
  text: "Resolve equation case 5",
  expected: JSON.stringify(
    { isResolvable: true, possibilities: ["6 * 8 || 6 * 15"] },
    null,
    2
  ),
  result: JSON.stringify(
    resolveEquation({
      testValue: 7290,
      equations: [6, 8, 6, 15],
      operations: [OPERATOR_ADD, OPERATOR_MULTIPLY, OPERATOR_COMBINE],
    }),
    null,
    2
  ),
});

expect({
  text: "Resolve equation case 6",
  expected: JSON.stringify(
    { isResolvable: true, possibilities: ["17 || 8 + 14"] },
    null,
    2
  ),
  result: JSON.stringify(
    resolveEquation({
      testValue: 192,
      equations: [17, 8, 14],
      operations: [OPERATOR_ADD, OPERATOR_MULTIPLY, OPERATOR_COMBINE],
    }),
    null,
    2
  ),
});

await (async () => {
  const data = await prepareData("./data.test.txt");
  expect({
    text: "Data extracted correctly",
    expected: JSON.stringify({
      83: [17, 5],
      156: [15, 6],
      190: [10, 19],
      192: [17, 8, 14],
      292: [11, 6, 16, 20],
      3267: [81, 40, 27],
      7290: [6, 8, 6, 15],
      21037: [9, 7, 18, 13],
      161011: [16, 10, 13],
    }),
    result: JSON.stringify(data),
  });
  const results = Object.entries(data).filter(
    ([testValue, equations]) =>
      resolveEquation({
        testValue,
        equations,
      }).isResolvable
  );
  expect({
    text: "Resolve equation with test data",
    expected: 3749,
    result: results.reduce((prev, [value]) => prev + Number(value), 0),
  });
})();

await (async () => {
  const data = await prepareData("./data.test.txt");
  const results = Object.entries(data).filter(
    ([testValue, equations]) =>
      resolveEquation({
        testValue,
        equations,
        operations: [OPERATOR_ADD, OPERATOR_MULTIPLY, OPERATOR_COMBINE],
      }).isResolvable
  );
  expect({
    text: "Resolve equation with test data with combine operator",
    expected: 11387,
    result: results.reduce((prev, [value]) => prev + Number(value), 0),
  });
})();

expect({
  text: "Make it sure that generate combinations generate all possible combinations",
  expected: 6561,
  result: generateCombinations({
    equations: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    operations: [OPERATOR_ADD, OPERATOR_MULTIPLY, OPERATOR_COMBINE],
  }).length,
});

expect({
  text: "Make it sure eval is working good 1",
  expected: 1010,
  result: evalLeftToRight("10 || 10"),
});

expect({
  text: "Make it sure eval is working good 2",
  expected: 10101010,
  result: evalLeftToRight("10 || 10 || 10 || 10"),
});

expect({
  text: "Make it sure eval is working good 3",
  expected: 20010,
  result: evalLeftToRight("10 + 10 * 10 || 10"),
});
