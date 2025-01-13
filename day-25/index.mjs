import { prepareData } from "./utils.mjs";

const lock = await prepareData();
const fitKeys = lock.resolve();
console.log("Part 1", fitKeys.length);
