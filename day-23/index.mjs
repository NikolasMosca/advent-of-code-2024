import { ComputerGroups } from "./computerGroup.mjs";
import { prepareData } from "./utils.mjs";

await (async () => {
  const connections = await prepareData();
  const computerGroups = new ComputerGroups(connections);
  computerGroups.generate();
  const groupsWithT = computerGroups.findGroup("t");
  console.log("Part 1", groupsWithT.length);
  console.log("Part 2", computerGroups.getLargestGroup());
})();
