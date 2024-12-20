import { findHikingTrails, prepareData } from "./utils.mjs";

await Promise.all([
  (async () => {
    const map = await prepareData();
    const sumOfScores = findHikingTrails({ map }).reduce(
      (prev, { choices }) => prev + choices.length,
      0
    );
    console.log("Part 1", { sumOfScores });
  })(),
  (async () => {
    const map = await prepareData();
    const sumOfScores = findHikingTrails({ map }).reduce(
      (prev, { rating }) => prev + rating,
      0
    );
    console.log("Part 2", { sumOfScores });
  })(),
]);
