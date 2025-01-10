import { Device } from "./device.mjs";
import { expect, prepareData } from "./utils.mjs";

await (async () => {
  const device = await prepareData("./data.test.1.txt");
  device.resolve();
  expect({
    text: "Test data 1 should be return 4",
    expected: 4,
    result: device.getDecimalResult(),
  });
})();

await (async () => {
  const device = await prepareData("./data.test.2.txt");
  device.resolve();
  expect({
    text: "Test data 2 should be return 2024",
    expected: 2024,
    result: device.getDecimalResult(),
  });
})();

await (async () => {
  const device = await prepareData("./data.txt");
  // console.log(device.cache)
  // device.swap();
  // console.log(device.values);
  // expect({
  //   text: "Test data 1 for part 2 should be return 24",
  //   expected: 4,
  //   result: device.getDecimalResult(),
  // });
})();
