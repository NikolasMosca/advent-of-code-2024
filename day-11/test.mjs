import { blinkStones, countStones, SEPARATOR_STONE, updateStone } from "./utils.mjs";

const expect = ({ text, result, expected }) => {
  if (result !== expected) {
    console.error(
      `=== ERROR [${text}]\n Test failed: [result = ${result}] !== [expected = ${expected}]`
    );
  } else {
    console.log(`SUCCESS [${text}]`);
  }
};

const createMap = (param) => {
  const stonesMap = new Map();
  param.split(" ").forEach((stone) => {
    updateStone(stone, 1, stonesMap);
  });
  return stonesMap;
};

expect({
  text: "Test case: Should blink correctly",
  expected: 3,
  result: countStones(blinkStones(createMap("125 17"))),
});

expect({
  text: "Test case: After 1 blink",
  expected: 4,
  result: countStones(blinkStones(createMap("253000 1 7"))),
});
expect({
  text: "Test case: After 2 blink",
  expected: 5,
  result: countStones(blinkStones(createMap("253 0 2024 14168"))),
});
expect({
  text: "Test case: After 3 blink",
  expected: 9,
  result: countStones(blinkStones(createMap("512072 1 20 24 28676032"))),
});
expect({
  text: "Test case: After 4 blink",
  expected: 13,
  result: countStones(blinkStones(createMap("512 72 2024 2 0 2 4 2867 6032"))),
});
expect({
  text: "Test case: After 5 blink",
  expected: 22,
  result: countStones(
    blinkStones(createMap("1036288 7 2 20 24 4048 1 4048 8096 28 67 60 32"))
  ),
});
