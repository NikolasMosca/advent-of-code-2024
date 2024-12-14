import { ANTINODE, createAntiNodes, prepareData } from "./utils.mjs";

await Promise.all([
  (async () => {
    const map = await prepareData("./data.txt");
    const mapWithAntiNodes = createAntiNodes({ map });
    const totalAntiNodes = mapWithAntiNodes.reduce(
      (prev, current) =>
        prev + current.reduce((prev, current) => prev + Number(current === ANTINODE), 0),
      0
    );

    console.log("Part 1", { totalAntiNodes });
  })(),
  (async () => {
    const map = await prepareData("./data.txt");
    const mapWithAntiNodes = createAntiNodes({
      map,
      mode: "EXPAND",
    });
    const totalAntiNodes = mapWithAntiNodes.reduce(
      (prev, current) =>
        prev + current.reduce((prev, current) => prev + Number(current === ANTINODE), 0),
      0
    );

    console.log(
      "Part 2",
      { totalAntiNodes },
      JSON.stringify(
        mapWithAntiNodes.map((row) => row.join("")),
        null,
        2
      )
    );
  })(),
]);
