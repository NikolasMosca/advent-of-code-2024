import {
  calculateChecksum,
  convertDiskMap,
  moveFileBlocks,
} from "./utils.mjs";

const expect = ({ text, result, expected }) => {
  if (result !== expected) {
    console.error(
      `=== ERROR [${text}]\n Test failed: [result = ${result}] !== [expected = ${expected}]`
    );
  } else {
    console.log(`SUCCESS [${text}]`);
  }
};

expect({
  text: "Test case 1: Convert disk map should convert the string in blocks for files and free spaces correctly",
  expected: "0..111....22222",
  result: convertDiskMap({ diskMap: "12345" }).join(""),
});

expect({
  text: "Test case 2: Another test for convert disk map",
  expected: "00...111...2...333.44.5555.6666.777.888899",
  result: convertDiskMap({ diskMap: "2333133121414131402" }).join(""),
});

expect({
  text: "Test case 3: Move file blocks should move correctly elements in string",
  expected: "022111222......",
  result: moveFileBlocks({ blocks: "0..111....22222".split("") }).join(""),
});

expect({
  text: "Test case 4: Another test for move file blocks",
  expected: "0099811188827773336446555566..............",
  result: moveFileBlocks({
    blocks: "00...111...2...333.44.5555.6666.777.888899".split(""),
  }).join(""),
});

expect({
  text: "Test case 5: Checksum should return the correct value",
  expected: 1928,
  result: calculateChecksum({
    blocks: "0099811188827773336446555566..............".split(""),
  }),
});

expect({
  text: "Test case 6: Move file blocks for part 2",
  expected: "00992111777.44.333....5555.6666.....8888..",
  result: moveFileBlocks({
    blocks: "00...111...2...333.44.5555.6666.777.888899".split(""),
    mode: "WHOLE_FILE",
  }).join(""),
});

expect({
  text: "Test case 6.2: Move file blocks for part 2",
  expected: "021......33333......",
  result: moveFileBlocks({
    blocks: "0...1...2......33333".split(""),
    mode: "WHOLE_FILE",
  }).join(""),
});

expect({
  text: "Test case 7: Checksum should return the correct value for part 2",
  expected: 2858,
  result: calculateChecksum({
    blocks: "00992111777.44.333....5555.6666.....8888..".split(""),
  }),
});
