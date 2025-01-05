import { findShortestPathInMatrix } from "./utils.mjs ";

export const START = "S";
export const END = "E";
export const WALL = "#";
export const EMPTY = ".";

export class Maze {
  constructor({ map, simulation = false, maxCheats = 2 }) {
    this.originalMap = map;
    this.map = map;
    this.cheatMaps = [];
    this.bestSimulation = null;
    this.simulations = [];
    this.cache = new Map();
    this.walls = new Map();
    this.empty = new Map();
    this.maxCheats = maxCheats;
    this.debug = false;
    if (!simulation) {
      this.createChatMaps();
    }
  }

  // Posso effettuare un cheat su due muri adiacenti massimo
  createChatMaps() {
    console.log("Creating cheat maps...");
    this.originalMap.forEach((row, y) =>
      row.forEach((item, x) => {
        if (item !== WALL) {
          this.empty.set(`${x}-${y}`, [x, y]);
        }
      })
    );

    [...this.empty.values()].forEach(([startX, startY], startIndex, list) => {
      list.forEach(([endX, endY], endIndex) => {
        if (startIndex === endIndex) return;
        const { distance, path } = this.getManhattanDistance(
          { x: startX, y: startY },
          { x: endX, y: endY }
        );

        if (distance > 1 && distance <= this.maxCheats) {
          const currentMap = JSON.parse(JSON.stringify(this.originalMap));
          path
            .filter(({ x, y }) => currentMap[y][x] === WALL)
            .forEach(({ x, y }) => (currentMap[y][x] = EMPTY));
          this.cheatMaps.push(currentMap);
        }
      });
      // console.log(`Cheat Map Progress...`, startIndex + 1, "/", list.length);
    });
    console.log("Cheat Maps Complete!", this.cheatMaps.length);
    // this.cheatMaps.forEach((map, index) => {
    //   this.map = map;
    //   console.log("Simulation #", index);
    //   console.log(this.printMapSimulation([]));
    //   console.log("");
    // });
  }

  getManhattanDistance(pointA, pointB) {
    const distance = Math.abs(pointA.x - pointB.x) + Math.abs(pointA.y - pointB.y);
    const path = [];
    for (let x = pointA.x; x !== pointB.x; x += Math.sign(pointB.x - pointA.x)) {
      path.push({ x, y: pointA.y });
    }
    for (let y = pointA.y; y !== pointB.y; y += Math.sign(pointB.y - pointA.y)) {
      path.push({ x: pointB.x, y });
    }
    path.push(pointB);
    return { distance, path };
  }

  async resolveCheatMaps() {
    const { simulation } = await this.resolve();
    const originalSteps = simulation.steps;
    let completed = 0;
    const limit = 10;
    const mapsResolved = [];
    for (let i = 0; i < this.cheatMaps.length; i += limit) {
      await Promise.all(
        this.cheatMaps.slice(i, i + limit).map(async (cMap, index) => {
          const maze = new Maze({ map: cMap, simulation: true });
          const { simulation } = await maze.resolve();
          const timeSaved = originalSteps - simulation.steps;
          mapsResolved.push({ ...simulation, timeSaved, path: maze.simulations[0] });
          completed++;
          return true;
        })
      );
    }
    const results = mapsResolved.reduce((prev, current) => {
      const stringPath = JSON.stringify(current.path);
      if (!prev[current.timeSaved]) {
        prev[current.timeSaved] = 0;
      }
      if (!this.cache.has(`map_resolved_${stringPath}`)) {
        this.cache.set(`map_resolved_${stringPath}`, true);
        prev[current.timeSaved]++;
      }
      return prev;
    }, {});

    this.map = this.originalMap;
    return results;
  }

  async resolve() {
    this.simulations = [];
    if (this.debug) console.log(this.printMapSimulation([]));
    // A* Algorithm
    if (this.debug) console.log("Find all possible paths...");
    const simulations = await findShortestPathInMatrix(this.map);
    if (this.debug) console.log("Calculate score for all paths...");
    this.simulations = simulations
      .map((simulation) =>
        simulation.map(({ row, col }) => ({
          x: col,
          y: row,
        }))
      )
      .toSorted((a, b) =>
        this.calculateScoreSimulation(a).score < this.calculateScoreSimulation(b).score
          ? -1
          : 1
      )
      .filter(
        (item, _, [first]) =>
          this.calculateScoreSimulation(item).score ===
          this.calculateScoreSimulation(first).score
      );

    if (this.debug) console.log("Selecting best paths...");
    this.tiles = new Map();
    this.simulations.forEach((item, index) => {
      item.forEach(({ x, y }) => this.tiles.set(`${x}-${y}`, true));
      // console.log(`Simulation #${index + 1}`, this.calculateScoreSimulation(item));
      // console.log(this.printMapSimulation(item));
    });
    if (this.debug) console.log("Calculate score and number of best tiles...");
    this.bestSimulation = this.calculateScoreSimulation(this.simulations[0]);
    if (this.debug) console.log(this.printMapSimulation(this.simulations[0]));
    return {
      status: "success",
      simulation: this.bestSimulation,
      tiles: this.tiles.size,
    };
  }

  findStart() {
    if (this.cache.has("start_position")) {
      return this.cache.get("start_position");
    }
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        if (this.map[y][x] === START) {
          this.cache.set("start_position", [x, y]);
          return [x, y];
        }
      }
    }
  }

  findEnd() {
    if (this.cache.has("end_position")) {
      return this.cache.get("end_position");
    }
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        if (this.map[y][x] === END) {
          this.cache.set("end_position", [x, y]);
          return [x, y];
        }
      }
    }
  }

  coloredBlock(color) {
    const colors = {
      red: "\x1b[31m",
      green: "\x1b[32m",
      yellow: "\x1b[33m",
      blue: "\x1b[34m",
      magenta: "\x1b[35m",
      cyan: "\x1b[36m",
      white: "\x1b[37m",
      reset: "\x1b[0m",
    };

    return `${colors[color] || colors.reset}██${colors.reset}`;
  }

  printMapSimulation(simulation) {
    const cachedSimulation = new Map();
    simulation.forEach(({ x, y }) => cachedSimulation.set(`${x}-${y}`, `██`));

    return this.map
      .reduce((prev, row, y) => {
        prev.push(
          row.reduce(
            (prev, cell, x) =>
              prev +
              (cachedSimulation.has(`${x}-${y}`)
                ? cachedSimulation.get(`${x}-${y}`)
                : {
                    [EMPTY]: "  ",
                    [WALL]: this.coloredBlock("red"),
                    [START]: this.coloredBlock("green"),
                    [END]: this.coloredBlock("green"),
                  }[cell] || cell),
            ""
          )
        );
        return prev;
      }, [])
      .join("\n");
  }

  calculateScoreSimulation(simulation) {
    const [startX, startY] = this.findStart();
    if (simulation[0].x === startX && simulation[0].y === startY) {
      simulation = simulation.slice(1);
    }
    let turns = 0;
    return {
      steps: simulation.length,
      score: simulation.reduce((prev) => prev + 1, 0),
      turns,
    };
  }
}
