import fs from "fs/promises";
import { TowelManager } from "./towelManager.mjs";

const SEPARATOR_BLOCKS = "\n\n";
const SEPARATOR_ROWS = "\n";
const SEPARATOR_COLS = ", ";

export const prepareData = async (file = "./data.txt") => {
  const data = await fs.readFile(file, "utf8");
  const [towels, designs] = data.split(SEPARATOR_BLOCKS);
  return new TowelManager({
    towels: towels.split(SEPARATOR_COLS),
    designs: designs.split(SEPARATOR_ROWS),
  });
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
