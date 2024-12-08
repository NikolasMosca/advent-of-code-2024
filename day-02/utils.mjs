import fs from "fs/promises";

const SEPARATOR_ROWS = "\n";
const SEPARATOR_COLUMNS = " ";
const MIN_DISTANCE = 1;
const MAX_DISTANCE = 3;

export const prepareData = async () => {
  const data = await fs.readFile("./data.txt", "utf8");
  return data.split(SEPARATOR_ROWS).map((row) => row.split(SEPARATOR_COLUMNS).map((item) => Number(item)));
};

export const checkDistance = (prevValue, currentValue) => {
  const distance = Math.abs(currentValue - prevValue);
  return distance >= MIN_DISTANCE && distance <= MAX_DISTANCE;
};

export const checkAllIncreasing = (currentValue, index, levels) =>
  index > 0 ? levels[index - 1] < currentValue && checkDistance(levels[index - 1], currentValue) : true;

export const checkAllDecreasing = (currentValue, index, levels) =>
  index > 0 ? levels[index - 1] > currentValue && checkDistance(levels[index - 1], currentValue) : true;

export const checkIsValidReportAllLevels = (levels) => {
  return (
    levels.map(checkAllIncreasing).every((result) => result === true) ||
    levels.map(checkAllDecreasing).every((result) => result === true)
  );
};

export const checkIsValidReportWhenRemovingOneLevel = (levels) => {
  for (let avoidLevelIndex = 0; avoidLevelIndex < levels.length; avoidLevelIndex++) {
    if (checkIsValidReportAllLevels(levels.filter((_, index) => index !== avoidLevelIndex))) {
      return true;
    }
  }
  return false;
};

export const checkIsValidReport = ({ levels, type = "PART_1" }) =>
  ({
    PART_1: checkIsValidReportAllLevels(levels),
    PART_2: checkIsValidReportWhenRemovingOneLevel(levels),
  }[type]);
