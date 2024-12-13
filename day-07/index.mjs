import {
  OPERATOR_ADD,
  OPERATOR_COMBINE,
  OPERATOR_MULTIPLY,
  prepareData,
  resolveEquation,
} from "./utils.mjs";

await Promise.all([
  (async () => {
    const data = await prepareData();
    const results = Object.entries(data).filter(
      ([testValue, equations]) =>
        resolveEquation({
          testValue,
          equations,
          debug: false,
        }).isResolvable
    );

    const sumValidEquations = results.reduce((prev, [value]) => prev + Number(value), 0);
    console.log("Part 1", { sumValidEquations });
  })(),
  (async () => {
    const startTime = Date.now();
    const data = await prepareData();
    const results = Object.entries(data).filter(
      ([testValue, equations], index, allValues) => {
        if ((index + 1) % 10 === 0) {
          console.log(
            `Progress: ${index + 1}/${allValues.length} - ${(
              ((index + 1) / allValues.length) *
              100
            ).toFixed(2)}% - ${(Date.now() - startTime) / 1000}s`
          );
        }

        return resolveEquation({
          testValue,
          equations,
          operations: [OPERATOR_ADD, OPERATOR_MULTIPLY, OPERATOR_COMBINE],
          debug: false,
        }).isResolvable;
      }
    );

    const sumValidEquations = results.reduce((prev, [value]) => prev + Number(value), 0);
    console.log("Part 2", { sumValidEquations });
  })(),
]);
