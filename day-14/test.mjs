import { Robot } from "./robot.mjs";
import { countRobotsForEachQuadrant, prepareData, printMap } from "./utils.mjs";

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
  text: "Test case: robot should move correctly",
  expected: JSON.stringify([2, 3]),
  result: (() => {
    const robot = new Robot({ position: [0, 0], velocity: [2, 3], map: [100, 100] });
    robot.move();
    return JSON.stringify(robot.getPosition());
  })(),
});

expect({
  text: "Test case: robot should teleport on the opposite side of the map",
  expected: JSON.stringify([99, 98]),
  result: (() => {
    const robot = new Robot({ position: [1, 1], velocity: [-2, -3], map: [100, 100] });
    robot.move();
    return JSON.stringify(robot.getPosition());
  })(),
});

expect({
  text: "Test case: robot should teleport on the opposite side of the map inverse",
  expected: JSON.stringify([1, 1]),
  result: (() => {
    const robot = new Robot({ position: [99, 98], velocity: [2, 3], map: [100, 100] });
    robot.move();
    return JSON.stringify(robot.getPosition());
  })(),
});

expect({
  text: "Test case: robot example second 1",
  expected: JSON.stringify([4, 1]),
  result: (() => {
    const robot = new Robot({ position: [2, 4], velocity: [2, -3], map: [11, 7] });
    robot.repeatMove(1);
    return JSON.stringify(robot.getPosition());
  })(),
});
expect({
  text: "Test case: robot example second 2",
  expected: JSON.stringify([6, 5]),
  result: (() => {
    const robot = new Robot({ position: [2, 4], velocity: [2, -3], map: [11, 7] });
    robot.repeatMove(2);
    return JSON.stringify(robot.getPosition());
  })(),
});
expect({
  text: "Test case: robot example second 3",
  expected: JSON.stringify([8, 2]),
  result: (() => {
    const robot = new Robot({ position: [2, 4], velocity: [2, -3], map: [11, 7] });
    robot.repeatMove(3);
    return JSON.stringify(robot.getPosition());
  })(),
});
expect({
  text: "Test case: robot example second 4",
  expected: JSON.stringify([10, 6]),
  result: (() => {
    const robot = new Robot({ position: [2, 4], velocity: [2, -3], map: [11, 7] });
    robot.repeatMove(4);
    return JSON.stringify(robot.getPosition());
  })(),
});
expect({
  text: "Test case: robot example second 5",
  expected: JSON.stringify([1, 3]),
  result: (() => {
    const robot = new Robot({ position: [2, 4], velocity: [2, -3], map: [11, 7] });
    robot.repeatMove(5);
    return JSON.stringify(robot.getPosition());
  })(),
});

await (async () => {
  const robots = await prepareData("./data.test.1.txt", [11, 7]);
  printMap({ map: [11, 7], robots });
  robots.forEach((robot) => robot.repeatMove(100));
  printMap({ map: [11, 7], robots });
  expect({
    text: "Test case: prize 1",
    expected: JSON.stringify(
      {
        topLeft: {
          minX: 0,
          maxX: 4,
          minY: 0,
          maxY: 2,
          count: 1,
        },
        topRight: {
          minX: 6,
          maxX: 10,
          minY: 0,
          maxY: 2,
          count: 3,
        },
        bottomLeft: {
          minX: 0,
          maxX: 4,
          minY: 4,
          maxY: 6,
          count: 4,
        },
        bottomRight: {
          minX: 6,
          maxX: 10,
          minY: 4,
          maxY: 6,
          count: 1,
        },
        safetyFactor: 12,
      },
      null,
      2
    ),
    result: JSON.stringify(countRobotsForEachQuadrant({ map: [11, 7], robots }), null, 2),
  });
})();
