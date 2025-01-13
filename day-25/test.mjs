import { expect, prepareData } from "./utils.mjs";

await (async () => {
  const lock = await prepareData("./data.test.1.txt");
  expect({
    text: "It should be convert pin heights correctly",
    expected: JSON.stringify(
      [
        { index: 0, heights: [0, 5, 3, 4, 3] },
        { index: 1, heights: [1, 2, 0, 5, 3] },
      ],
      null,
      2
    ),
    result: JSON.stringify(lock.pins, null, 2),
  });

  expect({
    text: "It should be convert key heights correctly",
    expected: JSON.stringify(
      [
        { index: 2, heights: [5, 0, 2, 1, 3] },
        { index: 3, heights: [4, 3, 4, 0, 2] },
        { index: 4, heights: [3, 0, 2, 0, 1] },
      ],
      null,
      2
    ),
    result: JSON.stringify(lock.keys, null, 2),
  });

  expect({
    text: "It should return all correct fit keys",
    expected: 3,
    result: lock.resolve().length,
  });
})();
