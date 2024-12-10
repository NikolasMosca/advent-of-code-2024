import { prepareData, wordSearch } from "./utils.mjs";

await Promise.all([
  (async () => {
    const matrix = await prepareData();
    const wordCounter = matrix.reduce((counter, row, x) => {
      return (
        counter +
        row.reduce((counter, _, y) => {
          return counter + wordSearch({ matrix, x, y });
        }, 0)
      );
    }, 0);
    console.log("Part 1", { wordCounter });
  })(),
  (async () => {
    const matrix = await prepareData();
    const wordCounter = matrix.reduce((counter, row, x) => {
      return (
        counter +
        row.reduce((counter, _, y) => {
          return counter + wordSearch({ matrix, x, y, word: "MAS", type: "SHAPE" });
        }, 0)
      );
    }, 0);
    console.log("Part 2", { wordCounter });
  })(),
]);
