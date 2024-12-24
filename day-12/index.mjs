import { calculatePrice, getRegionsFromMap, prepareData } from "./utils.mjs";

await Promise.all([
  (async () => {
    const map = await prepareData();
    const regions = getRegionsFromMap(map);
    console.log("Part 1", {
      numberOfRegions: regions.length,
      price: calculatePrice(regions),
    });
  })(),
  (async () => {
    const map = await prepareData();
    const regions = getRegionsFromMap(map);
    console.log("Part 2", {
      numberOfRegions: regions.length,
      price: calculatePrice(regions, "BULK_DISCOUNT"),
    });
  })(),
]);