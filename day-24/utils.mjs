import fs from "fs/promises";
import { Device } from "./device.mjs";

const SEPARATOR_BLOCKS = "\n\n";
const SEPARATOR_ROWS = "\n";

export const prepareData = async (file = "./data.txt") => {
  const data = await fs.readFile(file, "utf8");
  const [initialValues, operations] = data.split(SEPARATOR_BLOCKS);
  return new Device({
    initialValues: initialValues.split(SEPARATOR_ROWS).reduce((prev, row) => {
      const [name, value] = row.split(": ");
      return { ...prev, [name]: Number(value) };
    }, {}),
    operations: operations.split(SEPARATOR_ROWS).map((row, operationIndex) => {
      const [first, operator, second, _, result] = row.split(" ");
      return {
        fields: [first, second],
        operator,
        result,
        operationIndex,
        completed: false,
      };
    }),
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
