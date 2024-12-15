import fs from "fs/promises";

const FREE_SPACE = ".";

export const prepareData = async (file = "./data.txt") => fs.readFile(file, "utf8");

export const isFileBlock = (index) => index % 2 === 0;
export const isFreeSpaceBlock = (index) => index % 2 === 1;

export const convertDiskMap = ({ diskMap }) => {
  return [...diskMap].reduce(
    ({ blocks, idNumber }, numberOfBlocks, index) => {
      const blockValue = isFileBlock(index) ? idNumber : FREE_SPACE;
      for (let i = 0; i < numberOfBlocks; i++) {
        blocks.push(blockValue);
      }

      return {
        blocks,
        idNumber: isFileBlock(index) ? idNumber + 1 : idNumber,
      };
    },
    {
      blocks: [],
      idNumber: 0,
    }
  ).blocks;
};

const isValidPositionToMove = ({ blocksFreeSpace, blocksToMove }) => {
  for (let j = 0; j < blocksToMove.length; j++) {
    const freeSpaceIndex = blocksFreeSpace[j];
    const blockToMoveIndex = blocksToMove[j];
    if (freeSpaceIndex > blockToMoveIndex) {
      return false;
    }
  }
  return true;
};

//6304576712958 too high
//6304576012713
const moveFileBlocksWholeFile = ({ blocks }) => {
  let lastIndex = blocks.length;
  let prevLastIndex
  do {
    prevLastIndex = lastIndex;
    const blocksToMove = [];
    for (let j = lastIndex - 1; j > 0; j--) {
      if (blocks[j] === FREE_SPACE && blocksToMove.length === 0) continue;
      if (blocks[j] === FREE_SPACE && blocksToMove.length > 0) break;
      if (
        blocks[j] !== FREE_SPACE &&
        blocksToMove.length > 0 &&
        blocks[j] !== blocks[blocksToMove?.[0]]
      )
        break;
      blocksToMove.push(j);
      lastIndex = j;
    }

    for (let i = 0; i < lastIndex; i++) {
      if (blocks[i] !== FREE_SPACE) continue;
      const blocksFreeSpace = [];
      for (let j = i; j < lastIndex; j++) {
        if (blocks[j] !== FREE_SPACE) break;
        blocksFreeSpace.push(j);
      }

      if (
        blocksToMove.length <= blocksFreeSpace.length &&
        isValidPositionToMove({ blocksToMove, blocksFreeSpace })
      ) {
        for (let j = 0; j < blocksToMove.length; j++) {
          const freeSpaceIndex = blocksFreeSpace[j];
          const blockToMoveIndex = blocksToMove[j];
          blocks[freeSpaceIndex] = blocks[blockToMoveIndex];
          blocks[blockToMoveIndex] = FREE_SPACE;
        }
      }
    }
  } while (lastIndex !== prevLastIndex);

  return blocks;
};

export const moveFileBlocks = ({ blocks, mode = "STANDARD" }) => {
  if (mode === "WHOLE_FILE") {
    return moveFileBlocksWholeFile({ blocks });
  }

  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i] !== FREE_SPACE) continue;
    let foundBlock = false;
    for (let j = blocks.length - 1; j > i; j--) {
      if (blocks[j] === FREE_SPACE) continue;
      blocks[i] = blocks[j];
      blocks[j] = FREE_SPACE;
      foundBlock = true;
      break;
    }
    if (!foundBlock) break;
  }

  return blocks;
};

export const calculateChecksum = ({ blocks }) =>
  blocks.reduce(
    (prev, block, index) => (block !== FREE_SPACE ? prev + Number(index * block) : prev),
    0
  );
