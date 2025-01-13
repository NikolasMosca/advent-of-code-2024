import fs from "fs/promises";
import { Lock } from "./lock.mjs";

const SEPARATOR_BLOCKS = "\n\n";
const SEPARATOR_ROWS = "\n";

export const prepareData = async (file = "./data.txt") => {
  const data = await fs.readFile(file, "utf8");
  return new Lock({
    values: data
      .split(SEPARATOR_BLOCKS)
      .map((block) => block.split(SEPARATOR_ROWS).map((row) => row.split(""))),
  });
};

export const expect = ({ text, result, expected }) => {
  if (result !== expected) {
    console.error("##############");
    console.error(
      `#### ERROR [${text}]\n Test failed: [result = ${result}] !== [expected = ${expected}]`
    );
    console.error("##############");
    console.error("");
  } else {
    console.log("##############");
    console.log(`#### SUCCESS [${text}]`);
    console.log("##############");
    console.log("");
  }
};
