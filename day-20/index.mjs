import { prepareData } from "./utils.mjs";

await (async () => {
  const maze = await prepareData();
  console.log("Total of cheat maps", maze.cheatMaps.length);
  const data = await maze.resolveCheatMaps();
  const numberOfCheats = Object.entries(data).reduce(
    (total, [picoseconds, totalCheats]) => total + (picoseconds >= 100 ? totalCheats : 0),
    0
  );
  console.log("Part 1", numberOfCheats);
})();

// await (async () => {
//   const maze = await prepareData("./data.txt", 20);
//   console.log("Total of cheat maps", maze.cheatMaps.length);
//   const data = await maze.resolveCheatMaps();
//   const numberOfCheats = Object.entries(data).reduce(
//     (total, [picoseconds, totalCheats]) => total + (picoseconds >= 100 ? totalCheats : 0),
//     0
//   );
//   console.log("Part 2", numberOfCheats);
// })();
