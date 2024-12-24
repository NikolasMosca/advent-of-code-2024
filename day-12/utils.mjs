import fs from "fs/promises";
export const SEPARATOR_ROWS = "\n";
export const SEPARATOR_COLS = "";

export const prepareData = async (file = "./data.txt") => {
  const data = await fs.readFile(file, "utf8");
  return data.split(SEPARATOR_ROWS).map((row) => row.split(SEPARATOR_COLS));
};

export const getTypeOfPlants = (map) => {
  return [...new Set(map.flat())];
};

export const countPerimeterPlant = ({ map, x, y, plant }) => {
  let perimeter = 0;
  if (map?.[y - 1]?.[x] !== plant) perimeter++;
  if (map?.[y + 1]?.[x] !== plant) perimeter++;
  if (map?.[y]?.[x - 1] !== plant) perimeter++;
  if (map?.[y]?.[x + 1] !== plant) perimeter++;
  return perimeter;
};

export const countCornerOnPosition = ({ map, x, y, plant }) => {
  const extCorners = {
    up: false,
    down: false,
    left: false,
    right: false,
  };
  if (map?.[y - 1]?.[x] !== plant) extCorners.up = true;
  if (map?.[y + 1]?.[x] !== plant) extCorners.down = true;
  if (map?.[y]?.[x - 1] !== plant) extCorners.left = true;
  if (map?.[y]?.[x + 1] !== plant) extCorners.right = true;

  let count = 0;
  if (extCorners.up && extCorners.left) count++;
  if (extCorners.up && extCorners.right) count++;
  if (extCorners.down && extCorners.left) count++;
  if (extCorners.down && extCorners.right) count++;

  const intCorners = {
    up: false,
    down: false,
    left: false,
    right: false,
  };
  if (map?.[y - 1]?.[x] === plant) intCorners.up = true;
  if (map?.[y + 1]?.[x] === plant) intCorners.down = true;
  if (map?.[y]?.[x - 1] === plant) intCorners.left = true;
  if (map?.[y]?.[x + 1] === plant) intCorners.right = true;
  if (intCorners.up && intCorners.left && map?.[y - 1]?.[x - 1] !== plant) count++;
  if (intCorners.up && intCorners.right && map?.[y - 1]?.[x + 1] !== plant) count++;
  if (intCorners.down && intCorners.left && map?.[y + 1]?.[x - 1] !== plant) count++;
  if (intCorners.down && intCorners.right && map?.[y + 1]?.[x + 1] !== plant) count++;
  return count;
};

export const calculateAreaAndPerimeter = ({ map, x, y, plant }) => {
  let positions = new Map();
  let area = 0;
  let perimeter = 0;
  let corners = 0;
  while (true) {
    area++;
    perimeter += countPerimeterPlant({ map, x, y, plant });
    corners += countCornerOnPosition({ map, x, y, plant });
    positions.set(`${y}-${x}`, true);

    let foundNextPosition = false;
    const currentPositions = [...positions.keys()];
    main: for (let k = 0; k < currentPositions.length; k++) {
      let [tempY, tempX] = currentPositions[k].split("-").map((item) => Number(item));
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i !== 0 && j !== 0) continue;
          if (
            map?.[tempY + i]?.[tempX + j] === plant &&
            !positions.has(`${tempY + i}-${tempX + j}`)
          ) {
            y = tempY + i;
            x = tempX + j;
            foundNextPosition = true;
            break main;
          }
        }
      }
    }

    if (!foundNextPosition) {
      break;
    }
  }

  return {
    plant,
    area,
    perimeter,
    sides: corners,
    positions: [...positions.keys()],
  };
};

export const getRegionsFromMap = (map) => {
  const regions = [];
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (!regions.find(({ positions }) => positions.includes(`${y}-${x}`))) {
        regions.push(calculateAreaAndPerimeter({ map, x, y, plant: map[y][x] }));
      }
    }
  }
  return regions;
};

export const calculatePrice = (regions, mode = "STANDARD") =>
  regions.reduce(
    (prev, current) =>
      prev +
      current.area * current[{ STANDARD: "perimeter", BULK_DISCOUNT: "sides" }[mode]],
    0
  );
