import fs from "fs/promises";
export const SEPARATOR_SLOT = "\n\n";
export const SEPARATOR_ROWS = "\n";
export const SEPARATOR_COLS = " ";
export const BUTTON_A_TOKENS = 3;
export const BUTTON_B_TOKENS = 1;
export const MAX_BUTTON_PRESS = 100;

export const prepareData = async (file = "./data.txt") => {
  const data = await fs.readFile(file, "utf8");
  return data
    .replaceAll(":", "")
    .replaceAll(",", "")
    .split(SEPARATOR_SLOT)
    .map((slot) => {
      const [buttonA, buttonB, prize] = slot
        .split(SEPARATOR_ROWS)
        .map((row) => row.split(SEPARATOR_COLS));
      return {
        buttonA: {
          [buttonA[2].split("+")[0].toLowerCase()]: Number(buttonA[2].split("+")[1]),
          [buttonA[3].split("+")[0].toLowerCase()]: Number(buttonA[3].split("+")[1]),
        },
        buttonB: {
          [buttonB[2].split("+")[0].toLowerCase()]: Number(buttonB[2].split("+")[1]),
          [buttonB[3].split("+")[0].toLowerCase()]: Number(buttonB[3].split("+")[1]),
        },
        prize: {
          [prize[1].split("=")[0].toLowerCase()]: Number(prize[1].split("=")[1]),
          [prize[2].split("=")[0].toLowerCase()]: Number(prize[2].split("=")[1]),
        },
      };
    });
};

export const getBestCombination = ({
  buttonA,
  buttonB,
  prize,
  disableMaxButtonPress = false,
}) => {
  const counters = {
    maxA: (() => {
      const maxX = Math.floor(prize.x / buttonA.x);
      const maxY = Math.floor(prize.y / buttonA.y);
      const max = maxX > maxY ? maxY : maxX;
      if (disableMaxButtonPress) return max;
      return max < MAX_BUTTON_PRESS ? max : MAX_BUTTON_PRESS;
    })(),
    maxB: (() => {
      const maxX = Math.floor(prize.x / buttonB.x);
      const maxY = Math.floor(prize.y / buttonB.y);
      const max = maxX > maxY ? maxY : maxX;
      if (disableMaxButtonPress) return max;
      return max < MAX_BUTTON_PRESS ? max : MAX_BUTTON_PRESS;
    })(),
  };

  const max = counters.maxA >= counters.maxB ? counters.maxA : counters.maxB;
  const bestCombination = { a: 0, b: 0, cost: 0 };
  for (let a = max; a >= 0; a--) {
    const remainX = prize.x - buttonA.x * a;
    const remainY = prize.y - buttonA.y * a;
    const b = remainX / buttonB.x;
    const cost = a * BUTTON_A_TOKENS + b * BUTTON_B_TOKENS;
    const totalX = a * buttonA.x + b * buttonB.x;
    const totalY = a * buttonA.y + b * buttonB.y;

    if (totalX !== prize.x || totalY !== prize.y) {
      const maxReduction = 1000000000;
      main: for (let i = maxReduction / 10; i >= 100; i /= 10) {
        let reduction = maxReduction;
        while (reduction > 1000) {
          if (
            (Math.abs(prize.x - totalX) + Math.abs(prize.y - totalY)) / 2.7 >
            (buttonA.x + buttonA.y) * reduction
          ) {
            a -= reduction;
            break main;
          }
          reduction /= i;
        }
      }
      continue;
    }
    if (remainX < 0 || remainY < 0) continue;
    if (remainX % buttonB.x !== 0) continue;
    if (remainY % buttonB.y !== 0) continue;
    if (!disableMaxButtonPress && b > MAX_BUTTON_PRESS) continue;
    if (bestCombination.cost && bestCombination.cost < cost) continue;
    bestCombination.a = a;
    bestCombination.b = b;
    bestCombination.cost = cost;
  }

  return bestCombination;
};
