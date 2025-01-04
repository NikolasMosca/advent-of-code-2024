import { findShortestPathInMatrix } from "./utils.mjs ";

export const START = "S";
export const END = "E";
export const WALL = "#";
export const EMPTY = ".";

export class Maze {
  constructor(wallCoordinates = [], size = [70, 70], bytes = 1024, debug = false) {
    this.size = size;
    this.wallCoordinates = wallCoordinates;
    this.refreshMap(bytes);
    this.bestSimulation = null;
    this.cache = new Map();
  }

  refreshMap(bytes) {
    this.map = this.buildMap(this.wallCoordinates, bytes);
  }

  buildMap(wallCoordinates = [], bytes = 1024) {
    const cachedCoordinates = new Map();
    wallCoordinates
      .slice(0, bytes)
      .forEach(([x, y]) => cachedCoordinates.set(`${x}-${y}`, [x, y]));
    const [width, height] = this.size;
    const map = [];
    for (let y = 0; y <= height; y++) {
      const row = [];
      for (let x = 0; x <= width; x++) {
        if (x === 0 && y === 0) {
          row.push(START);
          continue;
        }
        if (x === width && y === height) {
          row.push(END);
          continue;
        }
        if (cachedCoordinates.has(`${x}-${y}`, [x, y])) {
          row.push(WALL);
          continue;
        }
        row.push(EMPTY);
      }
      map.push(row);
    }
    return map;
  }

  async resolve() {
    if (this.debug) console.log(this.printMapSimulation([]));
    // Dijkstra
    if (this.debug) console.log("Find all possible paths...");
    const simulations = await findShortestPathInMatrix(this.map);
    if (this.debug) console.log("Calculate score for all paths...");
    const bestSimulations = simulations
      .map((simulation) =>
        simulation.map(({ row, col, direction }) => ({
          x: col,
          y: row,
          direction,
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
    bestSimulations.forEach((item, index) => {
      item.forEach(({ x, y }) => this.tiles.set(`${x}-${y}`, true));
      // console.log(`Simulation #${index + 1}`, this.calculateScoreSimulation(item));
      // console.log(this.printMapSimulation(item));
    });
    if (this.debug) console.log("Calculate score and number of best tiles...");
    this.bestSimulation = this.calculateScoreSimulation(bestSimulations[0]);
    if (this.debug) console.log(this.printMapSimulation(bestSimulations[0]));
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
