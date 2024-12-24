import {
  calculatePrice,
  getRegionsFromMap,
  getTypeOfPlants,
  prepareData,
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

await (async () => {
  const map = await prepareData("./data.test.1.txt");
  expect({
    text: "Test case: get type of plants for first example",
    expected: JSON.stringify(["O", "X"]),
    result: JSON.stringify(getTypeOfPlants(map)),
  });
})();

await (async () => {
  const map = await prepareData("./data.test.1.txt");
  expect({
    text: "Test case: calculate price for first example",
    expected: 772,
    result: calculatePrice(getRegionsFromMap(map)),
  });
})();

await (async () => {
  const map = await prepareData("./data.test.2.txt");
  expect({
    text: "Test case: calculate price for second example",
    expected: 1930,
    result: calculatePrice(getRegionsFromMap(map)),
  });
})();

await (async () => {
  const map = await prepareData("./data.test.3.txt");
  expect({
    text: "Test case: calculate correct price with sides",
    expected: 80,
    result: calculatePrice(getRegionsFromMap(map), "BULK_DISCOUNT"),
  });
})();

await (async () => {
  const map = await prepareData("./data.test.3.txt");
  expect({
    text: "Test case: calculate correct price with sides",
    expected: 80,
    result: calculatePrice(getRegionsFromMap(map), "BULK_DISCOUNT"),
  });
})();

await (async () => {
  const map = await prepareData("./data.test.4.txt");
  expect({
    text: "Test case: calculate correct price with sides",
    expected: 236,
    result: calculatePrice(getRegionsFromMap(map), "BULK_DISCOUNT"),
  });
})();

await (async () => {
  const map = await prepareData("./data.test.1.txt");
  expect({
    text: "Test case: calculate correct price with sides",
    expected: 436,
    result: calculatePrice(getRegionsFromMap(map), "BULK_DISCOUNT"),
  });
})();

await (async () => {
  const map = await prepareData("./data.test.5.txt");
  expect({
    text: "Test case: calculate correct price with sides",
    expected: 368,
    result: calculatePrice(getRegionsFromMap(map), "BULK_DISCOUNT"),
  });
})();

await (async () => {
  const map = await prepareData("./data.test.2.txt");
  expect({
    text: "Test case: calculate correct price with sides",
    expected: 1206,
    result: calculatePrice(getRegionsFromMap(map), "BULK_DISCOUNT"),
  });
})();
