import { DirectionalKeyboard } from "./directionalKeyboard.mjs";
import { NumericKeyboard } from "./numericKeyboard.mjs";
import { expect, prepareData } from "./utils.mjs";

(() => {
  const robot = new NumericKeyboard({ sequence: "4" });
  robot.resolve();
  expect({
    text: "It should resolve path without using the empty position",
    expected: `^^<<A`,
    result: robot.getResultSequence(),
  });
})();

(() => {
  const robot = new DirectionalKeyboard({ sequence: "<" });
  robot.resolve();
  expect({
    text: "It should resolve path without using the empty position",
    expected: `v<<A`,
    result: robot.getResultSequence(),
  });
})();

await (async () => {
  const sequences = await prepareData("./data.test.1.txt");

  const totalScore = sequences
    .map((sequence) => {
      console.time("Sequence resolved");
      const robot = new NumericKeyboard({ sequence });
      robot.resolve();
      console.timeEnd("Sequence resolved");
      console.log(sequence);
      return robot.getLastScore() * robot.getNumericPart();
    })
    .reduce((total, score) => total + score, 0);

  expect({
    text: "It should be calculate correct score for test data",
    expected: 126384,
    result: totalScore,
  });
})();

await (async () => {
  const numericRobot = new NumericKeyboard({ sequence: "739A" });
  numericRobot.resolve();
  const humanRobot = new DirectionalKeyboard({
    sequence: numericRobot.getResultSequence(),
    isHuman: true,
  });
  humanRobot.resolve();
  const secondDirectionalRobot = new DirectionalKeyboard({
    sequence: humanRobot.getResultSequence(),
  });
  secondDirectionalRobot.resolve();
  expect({
    text: "It should be calculate correct score for test 739A",
    expected: 78,
    result: secondDirectionalRobot.getScore(),
  });
})();

await (async () => {
  const robot = new NumericKeyboard({ sequence: "739A" });
  robot.resolve();
  expect({
    text: "It should be calculate correct score for test 739A",
    expected: 78,
    result: robot.getLastScore(),
  });
})();
