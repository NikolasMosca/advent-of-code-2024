import { prepareData, checkIsValidReport } from "./utils.mjs";

const dataParsed = await prepareData();
Promise.all([
  (() => {
    const safeReports = dataParsed
      .map((levels) => checkIsValidReport({ levels, type: "PART_1" }))
      .filter((result) => result === true).length;
    console.log("Part 1", { safeReports });
  })(),
  (() => {
    const safeReports = dataParsed
      .map((levels) => checkIsValidReport({ levels, type: "PART_2" }))
      .filter((result) => result === true).length;
    console.log("Part 2", { safeReports });
  })(),
]);
