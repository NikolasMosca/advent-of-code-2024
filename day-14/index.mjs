import { countRobotsForEachQuadrant, keypress, prepareData, printMap } from "./utils.mjs";

await Promise.all([
  (async () => {
    const map = [101, 103];
    const robots = await prepareData("./data.txt", map);
    robots.forEach((robot) => robot.repeatMove(100));
    console.log("Part 1", countRobotsForEachQuadrant({ map, robots }));
  })(),
  (async () => {
    const map = [101, 103];
    const robots = await prepareData("./data.txt", map);
    for (let i = 0; i < 1000000000; i++) {
      robots.forEach((robot) => robot.move());
      const rows = await printMap({ map, robots });
      if (i % 1000 === 0) {
        console.clear();
        console.log(`${i + 1} seconds`);
      }
      if (rows.join("\n").includes("xxxxxxxx")) {
        console.clear();
        console.log(`${i + 1} seconds`);
        await printMap({ map, robots, debug: true });
        console.log("program still running, press any key to continue");
        await keypress();
      }
    }
  })(),
]);
