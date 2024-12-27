import fs from "fs/promises";
import { Warehouse } from "./warehouse.mjs";

const SEPARATOR_PUZZLE = "\n\n";
const SEPARATOR_ROWS = "\n";
const SEPARATOR_COLS = "";

export const prepareData = async (file = "./data.txt") => {
  const data = await fs.readFile(file, "utf8");
  const [map, moves] = data.split(SEPARATOR_PUZZLE);
  return new Warehouse({
    map: map.split(SEPARATOR_ROWS).map((row) => row.split(SEPARATOR_COLS)),
    moves: moves.replaceAll("\n", "").split(SEPARATOR_COLS),
  });
};
