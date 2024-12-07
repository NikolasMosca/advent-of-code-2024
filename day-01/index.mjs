import fs from "fs/promises";
const SEPARATOR_ROWS = "\n";
const SEPARATOR_COLUMNS = "   ";

// Preparazione dati
const data = await fs.readFile("./data.txt", "utf8");
const dataParsed = Object.entries(
  data
    .split(SEPARATOR_ROWS)
    .map((item) => item.split(SEPARATOR_COLUMNS))
    .reduce((prev, current) => {
      current.forEach((number, index) => {
        if (!prev[index]) {
          prev[index] = [];
        }
        prev[index].push(Number(number));
      });
      return prev;
    }, {})
).map(([_, values]) => values.toSorted());

const [firstList, secondList] = dataParsed;
await Promise.all([
  (() => {
    // Part 1
    const totalDistance = firstList
      .map((_, index) => Math.abs(firstList[index] - secondList[index]))
      .reduce((prev, current) => prev + current, 0);

    console.log("Part 1", { totalDistance });
  })(),

  (() => {
    // Part 2
    const similarityScore = firstList
      .map((currentNumber) => {
        return currentNumber * secondList.filter((number) => number === currentNumber).length;
      })
      .reduce((prev, current) => prev + current, 0);

    console.log("Part 2", { similarityScore });
  })(),
]);
