import fs from "fs/promises";
import { Maze } from "./maze.mjs";

const SEPARATOR_ROWS = "\n";
const SEPARATOR_COLS = "";

export const prepareData = async (file = "./data.txt") => {
  const data = await fs.readFile(file, "utf8");
  return new Maze(data.split(SEPARATOR_ROWS).map((row) => row.split(SEPARATOR_COLS)));
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
      if (matrix[i][j] === "S") start = [i, j];
      if (matrix[i][j] === "E") end = [i, j];
    }
  }
  if (!start || !end) throw new Error("Matrice non valida: S o E mancante");

  const allPaths = [];
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  let minScore = 80000;

  function dfs(row, col, path, direction, currentScore) {
    if (
      row < 0 ||
      row >= rows ||
      col < 0 ||
      col >= cols ||
      matrix[row][col] === "#" ||
      visited[row][col]
    ) {
      return;
    }

    // Calcola il costo di passo e cambio di direzione
    const stepCost = 1;
    const directionChangeCost =
      path.length > 0 && direction !== path[path.length - 1].direction ? 1000 : 0;
    const newScore = currentScore + stepCost + directionChangeCost;

    // Pruning: interrompi la ricerca se il costo supera il minimo
    if (newScore > minScore) return;

    path.push({ row, col, direction });
    visited[row][col] = true;

    // Se la destinazione è raggiunta, salva il percorso e aggiorna minScore
    if (row === end[0] && col === end[1]) {
      console.log("Path found");
      allPaths.push([...path]);
    } else {
      // Esplora le direzioni
      for (let [dRow, dCol, dir] of directions) {
        dfs(row + dRow, col + dCol, path, dir, newScore);
      }
    }

    // Backtracking
    path.pop();
    visited[row][col] = false;
  }

  dfs(start[0], start[1], [], null, 0);
  return allPaths;
}
