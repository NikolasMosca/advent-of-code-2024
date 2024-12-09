import { prepareData, REGEX_COMBINED } from "./utils.mjs";

await Promise.all([
  (async () => {
    const dataParsed = await prepareData();
    const sumOfMuliply = dataParsed.reduce((prev, [firstNumber, secondNumber]) => {
      return prev + firstNumber * secondNumber;
    }, 0);
    console.log("Part 1", { sumOfMuliply });
  })(),
  (async () => {
    const dataParsed = await prepareData(REGEX_COMBINED);
    const sumOfMuliply = dataParsed.reduce((prev, [firstNumber, secondNumber]) => {
      return prev + firstNumber * secondNumber;
    }, 0);
    console.log("Part 2", { sumOfMuliply });
  })(),
]);
