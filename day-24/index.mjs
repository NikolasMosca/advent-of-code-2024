import { prepareData } from "./utils.mjs";

await (async () => {
  const device = await prepareData();
  device.resolve();
  console.log("Part 1", device.getDecimalResult());
  console.log("Part 2", await device.swap());
})();
