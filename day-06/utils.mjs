import fs from "fs/promises";

export const SEPARATOR_ROWS = "\n";
export const SEPARATOR_COLUMNS = "";
export const GUARD_DIRECTION_UP = "^";
export const GUARD_DIRECTION_RIGHT = ">";
export const GUARD_DIRECTION_LEFT = "<";
export const GUARD_DIRECTION_DOWN = "v";
export const GUARD_CHARACTERS = [GUARD_DIRECTION_UP, GUARD_DIRECTION_RIGHT, GUARD_DIRECTION_LEFT, GUARD_DIRECTION_DOWN];
export const OBSTACLE = "#";
export const EMPTY = ".";
export const VISITED = "X";

export const cache = new Map();

export const prepareData = async (file = "./data.txt") => {
  const cacheKey = `fileLoaded___${file}`;
  if (cache.has(cacheKey)) {
    return JSON.parse(cache.get(cacheKey));
  }
  const data = await fs.readFile(file, "utf8");
  const result = data.split(SEPARATOR_ROWS).map((row) => row.split(SEPARATOR_COLUMNS));
  cache.set(cacheKey, JSON.stringify(result));
  return result;
};

// Cerco la posizione della guardia
export const getPositionGuard = ({ map, prefixCache = "standard" }) => {
  const cacheKey = `${prefixCache}_position_guard`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (GUARD_CHARACTERS.includes(map[y][x])) {
        cache.set(cacheKey, [y, x]);
        return [y, x];
      }
    }
  }
  throw new Error("Guard not found on the map");
};

export const getNextPositionDirection = (guardDirection) =>
  ({
    [GUARD_DIRECTION_UP]: GUARD_DIRECTION_RIGHT,
    [GUARD_DIRECTION_RIGHT]: GUARD_DIRECTION_DOWN,
    [GUARD_DIRECTION_LEFT]: GUARD_DIRECTION_UP,
    [GUARD_DIRECTION_DOWN]: GUARD_DIRECTION_LEFT,
  }[guardDirection]);

export const getNextPositionGuard = ({ guardDirection, x, y }) =>
  ({
    [GUARD_DIRECTION_UP]: [y - 1, x],
    [GUARD_DIRECTION_RIGHT]: [y, x + 1],
    [GUARD_DIRECTION_LEFT]: [y, x - 1],
    [GUARD_DIRECTION_DOWN]: [y + 1, x],
  }[guardDirection]);

export const nextGuardMove = ({ map, prefixCache = "standard" }) => {
  const [y, x] = getPositionGuard({ map, prefixCache });
  const guardDirection = map[y][x];

  // Prevedo la prossima posizione della guardia in base alla direzione
  const [nextY, nextX] = getNextPositionGuard({ guardDirection, x, y });

  // Se siamo oltre i confini della mappa ci fermiamo
  if (!map?.[nextY]?.[nextX]) {
    map[y][x] = VISITED;
    return { map, finish: true, loop: false };
  }

  // Se c'è un ostacolo la guardia deve girarsi a destra
  if (map?.[nextY]?.[nextX] === OBSTACLE) {
    map[y][x] = getNextPositionDirection(guardDirection);
    cache.set(`${prefixCache}_change_direction`, true);
    return { map, finish: false, loop: false };
  }

  // Se tutto quello che ho davanti l'ho già percorso fino all'ostacolo significa che sono in loop
  if (map?.[nextY]?.[nextX] === VISITED && cache.get(`${prefixCache}_change_direction`)) {
    let [checkX, checkY] = [nextX, nextY];
    do {
      [checkY, checkX] = getNextPositionGuard({ guardDirection, x: checkX, y: checkY });
    } while (map?.[checkY]?.[checkX] === VISITED);
    if (map?.[checkY]?.[checkX] === OBSTACLE) {
      let loopDetected = cache.get(`${prefixCache}_loop_detected`) || 0;
      loopDetected++;
      cache.set(`${prefixCache}_loop_detected`, loopDetected);
      if (loopDetected > 3) {
        return { map, finish: true, loop: true };
      }
    }
  }

  // Muovo la guardia
  cache.set(`${prefixCache}_position_guard`, [nextY, nextX]);
  cache.set(`${prefixCache}_change_direction`, false);
  map[nextY][nextX] = guardDirection;
  map[y][x] = VISITED;
  return { map, finish: false, loop: false };
};
