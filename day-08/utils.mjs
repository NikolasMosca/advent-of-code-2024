import fs from "fs/promises";

const SEPARATOR_ROWS = "\n";
const SEPARATOR_COLUMNS = "";
export const EMPTY = ".";
export const ANTINODE = "#";

export const prepareData = async (file = "./data.txt") => {
  const data = await fs.readFile(file, "utf8");
  return data.split(SEPARATOR_ROWS).map((item) => item.split(SEPARATOR_COLUMNS));
};

export const createAntiNodes = ({ map, mode = "STANDARD" }) => {
  const coordinates = {};

  // Cerco tutti i nodi uguali
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const node = map[y][x];

      // Se è un nodo salvo la coordinata
      if (![EMPTY, ANTINODE].includes(node)) {
        if (!coordinates[node]) {
          coordinates[node] = [];
        }
        coordinates[node].push([y, x]);
      }
    }
  }

  // Esamino tutti i nodi trovati e creo gli antinodi per ciascuno di loro
  Object.entries(coordinates).forEach(([_, coordinates]) => {
    for (let i = 0; i < coordinates.length; i++) {
      // Se sono in mode EXPAND anche le antenne diventano antinodi
      if (mode === "EXPAND") {
        const [y, x] = coordinates[i];
        map[y][x] = ANTINODE;
      }
      for (let j = 0; j < coordinates.length; j++) {
        if (i === j) continue; // Salto il nodo comparato con se stesso
        let [firstY, firstX] = coordinates[i];
        let [secondY, secondX] = coordinates[j];
        let newY = null;
        let newX = null;

        do {
          // Calcolo proiezione nuova posizione antinodo
          newY = secondY + (secondY - firstY);
          newX = secondX + (secondX - firstX);

          // Se esiste il punto in mappa setto l'antinodo
          if (map?.[newY]?.[newX]) {
            map[newY][newX] = ANTINODE;
          }

          // Cambio nodi per replicare il segnale di punto in punto
          // fino alla fine della mappa (mode = EXTEND)
          firstY = secondY;
          firstX = secondX;
          secondY = newY;
          secondX = newX;
        } while (mode === "EXPAND" && map?.[newY]?.[newX]);
      }
    }
  });

  return map;
};