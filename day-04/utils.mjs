import fs from "fs/promises";

const SEPARATOR_ROWS = "\n";
const SEPARATOR_COLUMNS = "";

export const prepareData = async (file = "./data.txt") => {
  const data = await fs.readFile(file, "utf8");
  return data.split(SEPARATOR_ROWS).map((row) => row.split(SEPARATOR_COLUMNS));
};

export const wordSearch = ({ matrix, x, y, word = "XMAS", type }) => {
  const checks = {
    horizontal: true,
    horizontalReversed: true,
    vertical: true,
    verticalReversed: true,
    diagonal: true,
    diagonalReversed: true,
    otherDiagonal: true,
    otherDiagonalReversed: true,
  };

  switch (type) {
    case "SHAPE":
      checks.horizontal = false;
      checks.horizontalReversed = false;
      checks.vertical = false;
      checks.verticalReversed = false;
      checks.diagonal = false;
      checks.diagonalReversed = false;
      checks.otherDiagonal = false;
      checks.otherDiagonalReversed = false;

      /*
      M.S
      .A.
      M.S
      */
      if (
        matrix?.[y - 1]?.[x - 1] === "M" &&
        matrix?.[y]?.[x] === "A" &&
        matrix?.[y + 1]?.[x + 1] === "S" &&
        matrix?.[y + 1]?.[x - 1] === "M" &&
        matrix?.[y - 1]?.[x + 1] === "S"
      ) {
        return 1;
      }

      /*
      M.M
      .A.
      S.S
      */
      if (
        matrix?.[y - 1]?.[x - 1] === "M" &&
        matrix?.[y]?.[x] === "A" &&
        matrix?.[y + 1]?.[x + 1] === "S" &&
        matrix?.[y + 1]?.[x - 1] === "S" &&
        matrix?.[y - 1]?.[x + 1] === "M"
      ) {
        return 1;
      }

      /*
      S.M
      .A.
      S.M
      */
      if (
        matrix?.[y - 1]?.[x - 1] === "S" &&
        matrix?.[y]?.[x] === "A" &&
        matrix?.[y + 1]?.[x + 1] === "M" &&
        matrix?.[y + 1]?.[x - 1] === "S" &&
        matrix?.[y - 1]?.[x + 1] === "M"
      ) {
        return 1;
      }

      /*
      S.S
      .A.
      M.M
      */
      if (
        matrix?.[y - 1]?.[x - 1] === "S" &&
        matrix?.[y]?.[x] === "A" &&
        matrix?.[y + 1]?.[x + 1] === "M" &&
        matrix?.[y + 1]?.[x - 1] === "M" &&
        matrix?.[y - 1]?.[x + 1] === "S"
      ) {
        return 1;
      }
      break;
    default:
      for (let i = 0; i < word.length; i++) {
        if (matrix?.[y]?.[x + i] !== word[i]) {
          checks.horizontal = false;
        }
        if (matrix?.[y]?.[x - i] !== word[i]) {
          checks.horizontalReversed = false;
        }
        if (matrix?.[y + i]?.[x] !== word[i]) {
          checks.vertical = false;
        }
        if (matrix?.[y - i]?.[x] !== word[i]) {
          checks.verticalReversed = false;
        }
        if (matrix?.[y + i]?.[x + i] !== word[i]) {
          checks.diagonal = false;
        }
        if (matrix?.[y - i]?.[x - i] !== word[i]) {
          checks.diagonalReversed = false;
        }
        if (matrix?.[y - i]?.[x + i] !== word[i]) {
          checks.otherDiagonal = false;
        }
        if (matrix?.[y + i]?.[x - i] !== word[i]) {
          checks.otherDiagonalReversed = false;
        }
      }
      break;
  }

  return Object.values(checks).filter((wordFind) => wordFind === true).length;
};
