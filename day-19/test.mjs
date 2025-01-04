import { expect, prepareData } from "./utils.mjs";

await (async () => {
  const towelManager = await prepareData("./data.test.1.txt");
  const { validDesigns, validWays } = await towelManager.resolve();
  expect({
    text: "Expect that example has 6 valid designs",
    expected: 6,
    result: validDesigns,
  });
  expect({
    text: "Expect that example has 16 valid ways to do it",
    expected: 16,
    result: validWays,
  });
})();
