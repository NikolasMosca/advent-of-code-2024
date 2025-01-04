import { prepareData } from "./utils.mjs";

await Promise.all([
  (async () => {
    const maze = await prepareData();
    const data = await maze.resolve();
    console.log("Part 1", data);
  })(),
  (async () => {
    const maze = await prepareData();
    for (let bytes = 1024; bytes < maze.wallCoordinates.length; bytes++) {
      maze.refreshMap(bytes);
      try {
        await maze.resolve();
      } catch (e) {
        console.log("Part 2", bytes - 1, maze.wallCoordinates[bytes - 1]);
        break;
      }
    }
  })(),
]);
