import fs from "fs/promises";
export const TRAILHEAD = 0;
export const TRAILEND = 9;
const REGEX_RESULT = /\[\d+,\d+\]/g;
const SEPARATOR_ROWS = "\n";
const SEPARATOR_COLUMNS = "";

export const prepareData = async () => {
  const data = await fs.readFile("./data.txt", "utf8");
  return data
    .split(SEPARATOR_ROWS)
    .map((row) => row.split(SEPARATOR_COLUMNS).map((item) => Number(item)));
};

export const getTrailheads = ({ map }) => {
  const results = [];
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === TRAILHEAD) {
        results.push([x, y]);
      }
    }
  }
  return results;
};

export const findNextPosition = ({ x, y, map, value, mode = "DIRECTIONAL_ONLY" }) => {
  const nextValue = value + 1;
  const choices = [];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (mode === "DIRECTIONAL_ONLY" && i !== 0 && j !== 0) continue;
      if (Number(map?.[y + i]?.[x + j]) === Number(nextValue)) {
        choices.push([x + j, y + i]);
      }
    }
  }
  return choices;
};

export const findHikingTrails = ({ map, mode = "STANDARD" }) => {
  const trailheads = getTrailheads({ map });
  return trailheads.map((startPosition) => {
    const scan = (position) => {
      if (Array.isArray(position[0])) {
        return position.map(scan);
      }
      const [x, y] = position;
      return findNextPosition({ x, y, value, map });
    };

    let value = 0;
    let choices = [startPosition];
    do {
      choices = choices.map(scan);
      value++;
    } while (value < TRAILEND && choices.length > 0);

    const scanRating = (prev, current) => {
      if (current?.[0] && Array.isArray(current[0])) {
        prev += current.reduce(scanRating, 0);
      } else if (current.length === 2) {
        prev++;
      }
      return prev;
    };
    return {
      value,
      choices: [...new Set(JSON.stringify(choices).match(REGEX_RESULT))],
      rating: choices.reduce(scanRating, 0),
    };
  });
};
