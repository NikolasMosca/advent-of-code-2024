import fs from "fs/promises";
import { Robot } from "./robot.mjs";
const SEPARATOR_ROWS = "\n";

export const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));
export const prepareData = async (file = "./data.txt", map = [101, 103]) => {
  const data = await fs.readFile(file, "utf8");
  return data.split(SEPARATOR_ROWS).map((row) => {
    const [position, velocity] = row.split(" ");
    return new Robot({
      position: position
        .split("=")[1]
        .split(",")
        .map((item) => Number(item)),
      velocity: velocity
        .split("=")[1]
        .split(",")
        .map((item) => Number(item)),
      map,
    });
  });
};

export const countRobotsForEachQuadrant = ({ map: [width, height], robots }) => {
  const topLeft = {
    minX: 0,
    maxX: Math.floor(width / 2) - 1,
    minY: 0,
    maxY: Math.floor(height / 2) - 1,
    count: 0,
  };
  const topRight = {
    minX: Math.floor(width / 2) + 1,
    maxX: width - 1,
    minY: 0,
    maxY: Math.floor(height / 2) - 1,
    count: 0,
  };
  const bottomLeft = {
    minX: 0,
    maxX: Math.floor(width / 2) - 1,
    minY: Math.floor(height / 2) + 1,
    maxY: height - 1,
    count: 0,
  };
  const bottomRight = {
    minX: Math.floor(width / 2) + 1,
    maxX: width - 1,
    minY: Math.floor(height / 2) + 1,
    maxY: height - 1,
    count: 0,
  };

  robots.forEach((robot) => {
    const [x, y] = robot.getPosition();
    if (
      x >= topLeft.minX &&
      x <= topLeft.maxX &&
      y >= topLeft.minY &&
      y <= topLeft.maxY
    ) {
      topLeft.count++;
      return;
    }
    if (
      x >= topRight.minX &&
      x <= topRight.maxX &&
      y >= topRight.minY &&
      y <= topRight.maxY
    ) {
      topRight.count++;
      return;
    }
    if (
      x >= bottomLeft.minX &&
      x <= bottomLeft.maxX &&
      y >= bottomLeft.minY &&
      y <= bottomLeft.maxY
    ) {
      bottomLeft.count++;
      return;
    }
    if (
      x >= bottomRight.minX &&
      x <= bottomRight.maxX &&
      y >= bottomRight.minY &&
      y <= bottomRight.maxY
    ) {
      bottomRight.count++;
      return;
    }
  });

  return {
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
    safetyFactor: topLeft.count * topRight.count * bottomLeft.count * bottomRight.count,
  };
};

export const printMap = async ({ map: [width, height], robots, debug = false }) => {
  const cachePositions = new Map();
  robots.forEach((robot) =>
    cachePositions.set(`${robot.position[0]}-${robot.position[1]}`, true)
  );
  const rows = [];
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      row.push(cachePositions.has(`${x}-${y}`) ? "x" : ".");
    }
    rows.push(row.join(""));
  }
  if (debug) {
    console.log("=== DEBUG ===");
    console.log(rows);
    console.log("=============");
  }
  return rows;
};

export const keypress = async () => {
  process.stdin.setRawMode(true)
  return new Promise(resolve => process.stdin.once('data', () => {
    process.stdin.setRawMode(false)
    resolve()
  }))
}
