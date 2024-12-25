import { getBestCombination, prepareData } from "./utils.mjs";

await Promise.all([
  (async () => {
    const slots = await prepareData();
    console.log("Part 1", {
      numberOfSlots: slots.length,
      tokensAmount: slots
        .map(getBestCombination)
        .reduce((prev, current) => prev + current.cost, 0),
    });
  })(),
  (async () => {
    const slots = await prepareData();
    console.log("Part 2", {
      numberOfSlots: slots.length,
      tokensAmount: slots
        .map((item, index) => {
          const result = getBestCombination({
            disableMaxButtonPress: true,
            ...item,
            prize: {
              x: item.prize.x + 10000000000000,
              y: item.prize.y + 10000000000000,
            },
          });

          console.log(`Slot number ${index + 1}`, result);
          return result;
        })
        .reduce((prev, current) => prev + current.cost, 0),
    });
  })(),
]);
