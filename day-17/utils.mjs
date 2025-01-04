import fs from "fs/promises";
import { Computer } from "./computer.mjs";
const SEPARATOR_BLOCKS = "\n\n";
const SEPARATOR_ROWS = "\n";
const SEPARATOR_COLS = ": ";

export const prepareData = async (file = "./data.txt") => {
  const data = await fs.readFile(file, "utf8");
  const [registers, program] = data.split(SEPARATOR_BLOCKS);
  const [a, b, c] = registers
    .split(SEPARATOR_ROWS)
    .map((row) => Number(row.split(SEPARATOR_COLS)[1]));
  return new Computer({
    a,
    b,
    c,
    program: program
      .split(SEPARATOR_COLS)[1]
      .split(",")
      .map((code) => Number(code)),
  });
};

export const keypress = async () => {
  process.stdin.setRawMode(true);
  return new Promise((resolve) =>
    process.stdin.once("data", () => {
      process.stdin.setRawMode(false);
      resolve();
    })
  );
};

export const expect = ({ text, result, expected }) => {
  if (result !== expected) {
    console.error(
      `=== ERROR [${text}]\n Test failed: [result = ${result}] !== [expected = ${expected}]`
    );
  } else {
    console.log(`SUCCESS [${text}]`);
  }
};
