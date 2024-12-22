import fs from "fs/promises";
export const SEPARATOR_STONE = " ";

export const prepareData = async () => {
  const data = await fs.readFile("./data.txt", "utf8");
  const stones = data.split(SEPARATOR_STONE);
  const stonesMap = new Map();
  stones.forEach((stone) => updateStone(stone, 1, stonesMap));
  return stonesMap;
};

export const countStones = (stones) => {
  let count = 0;
  for (const item of stones.values()) count += item.counter;
  return count;
};

export const updateStone = (stone, counter, stones) => {
  if (stones.has(stone)) {
    const firstStone = stones.get(stone);
    stones.set(stone, {
      ...firstStone,
      counter: firstStone.counter + counter,
    });
  } else {
    stones.set(stone, {
      stone,
      counter,
    });
  }
};

export const blinkStones = (stones) => {
  const currentValues = [...stones.values()];
  for (const item of currentValues) {
    if (item.stone === "0") {
      updateStone("1", item.counter, stones);
      updateStone(item.stone, -item.counter, stones);
      continue;
    }

    if (item.stone.length % 2 === 0) {
      const halfNumber = item.stone.length / 2;
      const first = item.stone.substring(0, halfNumber);
      const second =
        item.stone.substring(halfNumber, item.stone.length).replace(/^0+/, "") || "0";
      updateStone(first, item.counter, stones);
      updateStone(second, item.counter, stones);
      updateStone(item.stone, -item.counter, stones);
      continue;
    }

    const newStone = String(item.stone * 2024);
    updateStone(newStone, item.counter, stones);
    updateStone(item.stone, -item.counter, stones);
  }

  return stones;
};
