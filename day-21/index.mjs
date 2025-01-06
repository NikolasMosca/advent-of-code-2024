import { DirectionalKeyboard } from "./directionalKeyboard.mjs";
import { NumericKeyboard } from "./numericKeyboard.mjs";
import { prepareData } from "./utils.mjs";

await (async () => {
  const sequences = await prepareData();
  const totalScore = sequences
    .map((sequence) => {
      console.log(sequence);
      console.time("Sequence resolved");
      const robot = new NumericKeyboard({ sequence });
      robot.resolve();
      const lastScore = robot.getLastScore();
      console.timeEnd("Sequence resolved");
      console.log({
        score: lastScore,
        getNumericPart: robot.getNumericPart(),
        totalScore: lastScore * robot.getNumericPart(),
      });
      return lastScore * robot.getNumericPart();
    })
    .reduce((total, score) => total + score, 0);

  console.log("Part 1", { totalScore });
  console.log("====");
})();

await (async () => {
  const sequences = await prepareData();
  const totalScore = sequences
    .map((sequence) => {
      console.log(sequence);
      console.time("Sequence resolved");
      const robot = new NumericKeyboard({ sequence });
      robot.totalRobots = 25;
      robot.resolve();
      const lastScore = robot.getLastScore();
      console.timeEnd("Sequence resolved");
      console.log({
        score: lastScore,
        getNumericPart: robot.getNumericPart(),
        totalScore: lastScore * robot.getNumericPart(),
      });
      return lastScore * robot.getNumericPart();
    })
    .reduce((total, score) => total + score, 0);

  console.log("Part 2", { totalScore });
})();

//248684
//1684827155849446 too high
//1677348043501753 too high
//307055584161760

