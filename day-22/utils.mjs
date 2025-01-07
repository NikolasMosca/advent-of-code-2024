import fs from "fs/promises";

const SEPARATOR_ROWS = "\n";

export const prepareData = async (file = "./data.txt") => {
  const data = await fs.readFile(file, "utf8");
  return data.split(SEPARATOR_ROWS).map(Number);
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
