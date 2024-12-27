import { prepareData } from "./utils.mjs";

const expect = ({ text, result, expected }) => {
  if (result !== expected) {
    console.error(
      `=== ERROR [${text}]\n Test failed: [result = ${result}] !== [expected = ${expected}]`
    );
  } else {
    console.log(`SUCCESS [${text}]`);
  }
};

await (async () => {
  const warehouse = await prepareData("./data.test.1.txt");

  expect({
    text: "Test case: robot should find correctly",
    expected: JSON.stringify([2, 2]),
    result: JSON.stringify(warehouse.findRobot()),
  });

  const expected = `########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

########
#.@O.O.#
##..O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

########
#.@O.O.#
##..O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

########
#..@OO.#
##..O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

########
#...@OO#
##..O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

########
#...@OO#
##..O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

########
#....OO#
##..@..#
#...O..#
#.#.O..#
#...O..#
#...O..#
########

########
#....OO#
##..@..#
#...O..#
#.#.O..#
#...O..#
#...O..#
########

########
#....OO#
##.@...#
#...O..#
#.#.O..#
#...O..#
#...O..#
########

########
#....OO#
##.....#
#..@O..#
#.#.O..#
#...O..#
#...O..#
########

########
#....OO#
##.....#
#...@O.#
#.#.O..#
#...O..#
#...O..#
########

########
#....OO#
##.....#
#....@O#
#.#.O..#
#...O..#
#...O..#
########

########
#....OO#
##.....#
#.....O#
#.#.O@.#
#...O..#
#...O..#
########

########
#....OO#
##.....#
#.....O#
#.#O@..#
#...O..#
#...O..#
########

########
#....OO#
##.....#
#.....O#
#.#O@..#
#...O..#
#...O..#
########`
    .split("\n\n")
    .map((map) => map.split("\n"));

  let counter = 0;
  while (warehouse.hasNextMove()) {
    warehouse.processMove();
    expect({
      text: `Test case: move ${counter}`,
      expected: JSON.stringify(expected[counter++], null, 2),
      result: warehouse.printMap(),
    });
  }

  expect({
    text: `Test case: sum coordinates`,
    expected: 2028,
    result: warehouse.sumCoordinatesBox(),
  });
})();

await (async () => {
  const warehouse = await prepareData("./data.test.2.txt");
  while (warehouse.hasNextMove()) warehouse.processMove();
  expect({
    text: `Test case: result large example`,
    expected: JSON.stringify(
      [
        "##########",
        "#.O.O.OOO#",
        "#........#",
        "#OO......#",
        "#OO@.....#",
        "#O#.....O#",
        "#O.....OO#",
        "#O.....OO#",
        "#OO....OO#",
        "##########",
      ],
      null,
      2
    ),
    result: warehouse.printMap(),
  });

  expect({
    text: `Test case: sum coordinates`,
    expected: 10092,
    result: warehouse.sumCoordinatesBox(),
  });
})();

await (async () => {
  const warehouse = await prepareData("./data.test.2.txt");
  warehouse.transformToWiderMap();
  expect({
    text: `Test case: result large example`,
    expected: JSON.stringify(
      [
        "####################",
        "##....[]....[]..[]##",
        "##............[]..##",
        "##..[][]....[]..[]##",
        "##....[]@.....[]..##",
        "##[]##....[]......##",
        "##[]....[]....[]..##",
        "##..[][]..[]..[][]##",
        "##........[]......##",
        "####################",
      ],
      null,
      2
    ),
    result: warehouse.printMap(),
  });

  while (warehouse.hasNextMove()) warehouse.processMove();
  expect({
    text: `Test case: sum coordinates`,
    expected: 9021,
    result: warehouse.sumCoordinatesBox(),
  });
})();

await (async () => {
  const warehouse = await prepareData("./data.test.3.txt");
  warehouse.transformToWiderMap();
  expect({
    text: `Test case: result small example for part 2`,
    expected: JSON.stringify(
      [
        "##############",
        "##......##..##",
        "##..........##",
        "##....[][]@.##",
        "##....[]....##",
        "##..........##",
        "##############",
      ],
      null,
      2
    ),
    result: warehouse.printMap(),
  });

  const expected = `##############
##......##..##
##..........##
##...[][]@..##
##....[]....##
##..........##
##############

##############
##......##..##
##..........##
##...[][]...##
##....[].@..##
##..........##
##############

##############
##......##..##
##..........##
##...[][]...##
##....[]....##
##.......@..##
##############

##############
##......##..##
##..........##
##...[][]...##
##....[]....##
##......@...##
##############

##############
##......##..##
##..........##
##...[][]...##
##....[]....##
##.....@....##
##############

##############
##......##..##
##...[][]...##
##....[]....##
##.....@....##
##..........##
##############

##############
##......##..##
##...[][]...##
##....[]....##
##.....@....##
##..........##
##############

##############
##......##..##
##...[][]...##
##....[]....##
##....@.....##
##..........##
##############

##############
##......##..##
##...[][]...##
##....[]....##
##...@......##
##..........##
##############

##############
##......##..##
##...[][]...##
##...@[]....##
##..........##
##..........##
##############

##############
##...[].##..##
##...@.[]...##
##....[]....##
##..........##
##..........##
##############`
    .split("\n\n")
    .map((map) => map.split("\n"));

  let counter = 0;
  while (warehouse.hasNextMove()) {
    warehouse.processMove();
    expect({
      text: `Test case: move ${counter}`,
      expected: JSON.stringify(expected[counter++], null, 2),
      result: warehouse.printMap(),
    });
  }
})();
