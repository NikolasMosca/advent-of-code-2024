import fs from "fs/promises";
import { Maze } from "./maze.mjs";
import { EMPTY } from "./maze.mjs";
import { WALL } from "./maze.mjs";
import { START } from "./maze.mjs";
import { END } from "./maze.mjs";

const SEPARATOR_ROWS = "\n";
const SEPARATOR_COLS = ",";

export const prepareData = async (file = "./data.txt", size = [70, 70], bytes = 1024) => {
  const data = await fs.readFile(file, "utf8");
  return new Maze(
    data
      .split(SEPARATOR_ROWS)
      .map((row) => row.split(SEPARATOR_COLS).map((item) => Number(item))),
    size,
    bytes
  );
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
        matrix[neighborRow][neighborCol] === "#"
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

// export async function findShortestPathInMatrix(matrix) {
//   let discarded = 0;
//   const rows = matrix.length;
//   const cols = matrix[0].length;

//   const directions = [
//     [0, 1, ">"], // Destra
//     [1, 0, "v"], // Giù
//     [0, -1, "<"], // Sinistra
//     [-1, 0, "^"], // Su
//   ];

//   let start = null,
//     end = null;

//   // Trova S (start) ed E (end)
//   for (let i = 0; i < rows; i++) {
//     for (let j = 0; j < cols; j++) {
//       if (matrix[i][j] === START) start = [i, j];
//       if (matrix[i][j] === END) end = [i, j];
//     }
//   }
//   if (!start || !end) throw new Error("Matrice non valida: S o E mancante");

//   const allPaths = [];
//   const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
//   let minScore = Infinity;
//   let minSteps = Infinity;

//   // Identifica spazi vuoti per evitare computazioni
//   function calculateOpenSpaceCost(row, col) {
//     let score = 1;
//     let increment = 10;
//     for (let i = -1; i <= 1; i++) {
//       for (let j = -1; j <= 1; j++) {
//         if (matrix?.[row + i]?.[col + j] === EMPTY && !visited?.[row + i]?.[col + j]) {
//           score *= increment;
//           increment += 5;
//         }
//       }
//     }
//     return score;
//   }

//   function isLoopPath(row, col) {
//     let counter = 0;
//     const visitUp = visited?.[row - 1]?.[col];
//     const visitDown = visited?.[row + 1]?.[col];
//     const visitLeft = visited?.[row]?.[col - 1];
//     const visitRight = visited?.[row]?.[col + 1];
//     const visitUpLeft = visited?.[row - 1]?.[col - 1];
//     const visitUpRight = visited?.[row - 1]?.[col + 1];
//     const visitDownLeft = visited?.[row + 1]?.[col - 1];
//     const visitDownRight = visited?.[row + 1]?.[col + 1];
//     // if (!visitUp && !visitLeft && visitUpLeft) counter++;
//     // if (!visitUp && !visitRight && visitUpRight) counter++;
//     // if (!visitDown && !visitLeft && visitDownLeft) counter++;
//     // if (!visitDown && !visitRight && visitDownRight) counter++;
//     if (visitUp && visitLeft && visitUpLeft) return true;
//     if (visitUp && visitRight && visitUpRight) return true;
//     if (visitDown && visitLeft && visitDownLeft) return true;
//     if (visitDown && visitRight && visitDownRight) return true;
//     return counter > 0;
//   }

//   function dfs(row, col, path, direction, currentScore) {
//     if (
//       row < 0 ||
//       row >= rows ||
//       col < 0 ||
//       col >= cols ||
//       matrix[row][col] === WALL ||
//       visited[row][col] ||
//       isLoopPath(row, col)
//     ) {
//       return;
//     }

//     // Calcola il costo di passo e cambio di direzione
//     const stepCost = 1 + calculateOpenSpaceCost(row, col);
//     const newScore = currentScore + stepCost;

//     // Pruning: interrompi la ricerca se il costo supera il minimo
//     if (newScore > minScore) {
//       discarded++;
//       visited[row][col] = false;
//       return;
//     }

//     path.push({ row, col, direction });
//     visited[row][col] = true;

//     // Se la destinazione è raggiunta, salva il percorso e aggiorna minScore
//     if (row === end[0] && col === end[1]) {
//       if (path.length <= minSteps) {
//         console.log("Path found", newScore, path.length);
//         allPaths.push([...path]);
//         minScore = newScore;
//         minSteps = path.length;
//       }
//     } else {
//       // Esplora le direzioni
//       for (let [dRow, dCol, dir] of directions) {
//         dfs(row + dRow, col + dCol, path, dir, newScore);
//       }
//     }

//     // Backtracking
//     path.pop();
//     visited[row][col] = false;
//   }

//   dfs(start[0], start[1], [], null, 0);
//   console.log("Discarded paths", discarded);
//   return allPaths;
// }
