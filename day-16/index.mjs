import { prepareData } from "./utils.mjs";

await Promise.all([
  (async () => {
    const maze = await prepareData();
    const { simulation, tiles } = await maze.resolve();
    console.log("Part 1", simulation);
    console.log("Part 2", tiles);
  })(),
]);
