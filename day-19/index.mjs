import { prepareData } from "./utils.mjs";

await (async () => {
  const towelManager = await prepareData();
  const { validDesigns, validWays } = await towelManager.resolve();
  console.log("Part 1", validDesigns);
  console.log("Part 2", validWays);
})();
