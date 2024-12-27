import { prepareData } from "./utils.mjs";

await Promise.all([
  (async () => {
    const warehouse = await prepareData();
    while (warehouse.hasNextMove()) warehouse.processMove();
    console.log("Part 1", { sumCoordinates: warehouse.sumCoordinatesBox() });
  })(),
  (async () => {
    const warehouse = await prepareData();
    warehouse.transformToWiderMap();
    while (warehouse.hasNextMove()) warehouse.processMove();
    console.log("Part 2", { sumCoordinates: warehouse.sumCoordinatesBox() });
  })(),
]);
