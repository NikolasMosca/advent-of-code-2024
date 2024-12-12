import { EMPTY, nextGuardMove, OBSTACLE, prepareData, VISITED } from "./utils.mjs";

await Promise.all([
  (async () => {
    let originalMap = await prepareData();
    let map = [...originalMap];
    let result = null;
    do {
      result = nextGuardMove({ map });
      map = result.map;
    } while (result.finish === false);

    const visitedCells = map.reduce(
      (counter, row) => counter + row.reduce((counter, cell) => counter + Number(cell === VISITED), 0),
      0
    );

    console.log("Part 1", { visitedCells });
  })(),
  (async () => {
    const originalMap = await prepareData();
    const startTime = Date.now();
    let completedSimulations = 0;

    // Simula un ostacolo in ogni posto vuoto per vedere se causa il loop
    const promises = [];
    for (let y = 0; y < originalMap.length; y++) {
      for (let x = 0; x < originalMap[y].length; x++) {
        if (originalMap[y][x] === EMPTY) {
          promises.push(
            (async () => {
              let result = null;
              let map = await prepareData();
              map[y][x] = OBSTACLE;
              do {
                result = nextGuardMove({ map, prefixCache: `simulation_map_${x}_${y}` });
                map = result.map;
              } while (result.finish === false);

              completedSimulations++;
              if (completedSimulations % 25 === 0) {
                console.log(
                  `Simulation progress ${completedSimulations}/${promises.length} - ${(
                    (completedSimulations / promises.length) *
                    100
                  ).toFixed(2)}% - Execution time: ${Math.round((Date.now() - startTime) / 1000)}s`
                );
              }
              return result.loop;
            })()
          );
        }
      }
    }
    const loops = await Promise.all(promises);
    console.log("Part 2", { loops: loops.filter((result) => result === true).length });
  })(),
]);
