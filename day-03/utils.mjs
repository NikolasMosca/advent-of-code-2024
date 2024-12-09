import fs from "fs/promises";

export const REGEX_MUL = /mul\(\d+,\d+\)/g;
export const REGEX_COMBINED = /mul\(\d+,\d+\)|do\(\)|don't\(\)/g;

export const prepareData = async (regex = REGEX_MUL) => {
  const data = await fs.readFile("./data.txt", "utf8");
  let enableMul = true;
  return data
    .match(regex)
    .map((occurence) => {
      occurence = occurence.replace("(", "").replace(")", "");
      if (occurence === "do") {
        enableMul = true;
        return null;
      }
      if (occurence === "don't") {
        enableMul = false;
        return null;
      }
      if (!enableMul) {
        return null;
      }
      return occurence
        .replace("mul", "")
        .split(",")
        .map((number) => Number(number));
    })
    .filter((item) => item !== null);
};
