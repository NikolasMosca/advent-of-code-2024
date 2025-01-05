import fs from "fs/promises";
import { Maze, WALL } from "./maze.mjs";
import { START } from "./maze.mjs";
import { END } from "./maze.mjs";

const SEPARATOR_ROWS = "\n";
const SEPARATOR_COLS = "";

export const prepareData = async (file = "./data.txt", maxCheats = 2) => {
  const data = await fs.readFile(file, "utf8");
  return new Maze({
    map: data.split(SEPARATOR_ROWS).map((row) => row.split(SEPARATOR_COLS)),
    maxCheats
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

export async function findShortestPathInMatrix(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;

  const directions = [
    [0, 1, ">"], // Destra
    [1, 0, "v"], // Giù
    [0, -1, "<"], // Sinistra
    [-1, 0, "^"], // Su
  ];

  let start = null,
    end = null;

  // Trova S (start) ed E (end)
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (matrix[i][j] === START) start = [i, j];
      if (matrix[i][j] === END) end = [i, j];
    }
  }
  if (!start || !end) throw new Error("Matrice non valida: S o E mancante");

  // Funzione per calcolare l'euristica (Manhattan distance)
  function heuristic([x1, y1], [x2, y2]) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }

  const openSet = new Set([`${start[0]}_${start[1]}`]);
  const cameFrom = new Map();
  const gScore = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const fScore = Array.from({ length: rows }, () => Array(cols).fill(Infinity));

  gScore[start[0]][start[1]] = 0;
  fScore[start[0]][start[1]] = heuristic(start, end);

  while (openSet.size > 0) {
    let current = Array.from(openSet).reduce((a, b) => {
      const [aRow, aCol] = a.split("_").map(Number);
      const [bRow, bCol] = b.split("_").map(Number);
      return fScore[aRow][aCol] < fScore[bRow][bCol] ? a : b;
    });

    const [currentRow, currentCol] = current.split("_").map(Number);

    if (currentRow === end[0] && currentCol === end[1]) {
      const path = [];
      let temp = current;
      while (temp) {
        const [row, col] = temp.split("_").map(Number);
        path.unshift({ row, col });
        temp = cameFrom.get(temp);
      }
      return [path];
    }

    openSet.delete(current);

    for (let [dRow, dCol, dir] of directions) {
      const neighborRow = currentRow + dRow;
      const neighborCol = currentCol + dCol;

      if (
        neighborRow < 0 ||
        neighborRow >= rows ||
        neighborCol < 0 ||
        neighborCol >= cols ||
        matrix[neighborRow][neighborCol] === WALL
      ) {
        continue;
      }

      const tentativeGScore = gScore[currentRow][currentCol] + 1;

      if (tentativeGScore < gScore[neighborRow][neighborCol]) {
        cameFrom.set(`${neighborRow}_${neighborCol}`, current);
        gScore[neighborRow][neighborCol] = tentativeGScore;
        fScore[neighborRow][neighborCol] =
          tentativeGScore + heuristic([neighborRow, neighborCol], end);
        openSet.add(`${neighborRow}_${neighborCol}`);
      }
    }
  }

  throw new Error("Nessun percorso trovato");
}
