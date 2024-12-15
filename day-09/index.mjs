import {
  calculateChecksum,
  convertDiskMap,
  moveFileBlocks,
  prepareData,
} from "./utils.mjs";

await Promise.all([
  (async () => {
    const diskMap = await prepareData();
    const blocks = convertDiskMap({ diskMap });
    const sortedBlocks = moveFileBlocks({ blocks });
    const checksum = calculateChecksum({ blocks: sortedBlocks });

    console.log("Part 1", { checksum });
  })(),
  (async () => {
    const diskMap = await prepareData();
    const blocks = convertDiskMap({ diskMap });
    const sortedBlocks = moveFileBlocks({ blocks, mode: "WHOLE_FILE" });
    const checksum = calculateChecksum({ blocks: sortedBlocks });

    console.log("Part 2", { checksum });
  })(),
]);
