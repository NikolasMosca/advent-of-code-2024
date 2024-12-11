import { prepareData, checkPageRules, movePage, fixPageUpdates } from "./utils.mjs";

const expect = ({ text, result, expected }) => {
  if (result !== expected) {
    console.error(`=== ERROR [${text}]\n Test failed: [result = ${result}] !== [expected = ${expected}]`);
  } else {
    console.log(`SUCCESS [${text}]`);
  }
};

const { rules, pageUpdates } = await prepareData("./data.test.txt");

expect({
  text: "First page rule should be fine",
  expected: true,
  result: checkPageRules({
    pages: pageUpdates[0],
    rules,
  }),
});

expect({
  text: "Second page rule should be fine",
  expected: true,
  result: checkPageRules({
    pages: pageUpdates[1],
    rules,
  }),
});

expect({
  text: "Third page rule should be fine",
  expected: true,
  result: checkPageRules({
    pages: pageUpdates[2],
    rules,
  }),
});

expect({
  text: "Fourth page rule should be invalid",
  expected: false,
  result: checkPageRules({
    pages: pageUpdates[3],
    rules,
  }),
});

expect({
  text: "Fifth page rule should be invalid",
  expected: false,
  result: checkPageRules({
    pages: pageUpdates[4],
    rules,
  }),
});

expect({
  text: "Last page rule should be invalid",
  expected: false,
  result: checkPageRules({
    pages: pageUpdates[5],
    rules,
  }),
});

expect({
  text: "Check swap pages function",
  expected: JSON.stringify([75, 47, 61, 97, 53]),
  result: JSON.stringify(
    movePage({
      pages: [75, 97, 47, 61, 53],
      sourceIndex: 1,
      destinationIndex: 3,
    })
  ),
});

expect({
  text: "Check swap pages function",
  expected: JSON.stringify([97, 47, 61, 53, 75]),
  result: JSON.stringify(
    movePage({
      pages: [75, 97, 47, 61, 53],
      sourceIndex: 0,
      destinationIndex: 4,
    })
  ),
});

expect({
  text: "Fix page updates case 1",
  expected: JSON.stringify([97, 75, 47, 61, 53]),
  result: JSON.stringify(
    fixPageUpdates({
      pages: [75, 97, 47, 61, 53],
      rules,
    })
  ),
});

expect({
  text: "Fix page updates case 2",
  expected: JSON.stringify([61, 29, 13]),
  result: JSON.stringify(
    fixPageUpdates({
      pages: [61, 13, 29],
      rules,
    })
  ),
});

expect({
  text: "Fix page updates case 3",
  expected: JSON.stringify([97, 75, 47, 29, 13]),
  result: JSON.stringify(
    fixPageUpdates({
      pages: [97, 13, 75, 29, 47],
      rules,
    })
  ),
});
