import { prepareData } from "./utils.mjs";

await Promise.all([
  (async () => {
    const computer = await prepareData();
    computer.execute();
    console.log("Part 1", computer.output.join(","));
  })(),
  // Not completed
  // (async () => {
  //   const computer = await prepareData();
  //   computer.debug = true;
  //   computer.copyProgram();
  //   console.log("Part 2", computer.expectedA);
  // })(),
]);