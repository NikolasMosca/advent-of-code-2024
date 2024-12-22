import { blinkStones, countStones, prepareData } from "./utils.mjs";

await Promise.all([
  (async () => {
    const stones = await prepareData();
    for (let blinks = 1; blinks <= 25; blinks++) {
      blinkStones(stones);
    }
    console.log("Part 1", {
      numberOfStones: countStones(stones),
    });
  })(),
  (async () => {
    const stones = await prepareData();
    for (let blinks = 1; blinks <= 75; blinks++) {
      blinkStones(stones);
    }
    console.log("Part 2", {
      numberOfStones: countStones(stones),
    });
  })(),
]);
