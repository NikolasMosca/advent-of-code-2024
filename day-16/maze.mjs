import { findShortestPathInMatrix } from "./utils.mjs ";

const REINDEER = "S";
const END = "E";
const WALL = "#";
const EMPTY = ".";
const UP = "^";
const DOWN = "v";
const LEFT = "<";
const RIGHT = ">";

export class Maze {
  constructor(map) {
    this.map = map;
    this.bestSimulation = null;
    this.cache = new Map();
    this.currentPosition = this.findReindeer();
    this.prevPosition = [this.currentPosition.x - 1, this.currentPosition.y];
    this.choices = new Map();
    this.discarded = new Map();
    this.breadcrumbs = [];
    this.checkpoints = [];
    this.backToCheckpoints = 0;
    this.discardedPaths = 0;
    this.deadEnds = 0;
    this.deadZones = 0;
    this.debug = false;
    // this.interval = setInterval(() => {
    //   console.clear();
    //   console.log(this.printMapSimulation(this.breadcrumbs));
    //   console.log("Simulation in progress... ", {
    //     breadcrumbs: this.breadcrumbs.length,
    //     choices: this.choices.size,
    //     checkpoints: this.checkpoints.length,
    //     backToCheckpoints: this.backToCheckpoints,
    //     discardedPaths: this.discardedPaths,
    //     deadEnds: this.deadEnds,
    //     deadZones: this.deadZones,
    //     bestSimulation: this.bestSimulation,
    //   });
    // }, 250);
  }

  sleep(ms = 0) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async resolve() {
    // Dijkstra
    console.log("Find all possible paths...");
    const simulations = await findShortestPathInMatrix(this.map);
    console.log("Calculate score for all paths...");
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

    console.log("Selecting best paths...");
    this.tiles = new Map();
    bestSimulations.forEach((item, index) => {
      item.forEach(({ x, y }) => this.tiles.set(`${x}-${y}`, true));
      // console.log(`Simulation #${index + 1}`, this.calculateScoreSimulation(item));
      // console.log(this.printMapSimulation(item));
    });
    console.log("Calculate score and number of best tiles...", bestSimulations);
    this.bestSimulation = this.calculateScoreSimulation(bestSimulations[0]);
    return {
      status: "success",
      simulation: this.bestSimulation,
      tiles: this.tiles.size,
    };

    // My pathfinding solution
    await this.sleep(this.debug ? 200 : 0);
    const [prevX, prevY] = this.prevPosition;
    const [x, y] = this.currentPosition;
    const direction = this.getDirection(prevX, prevY, x, y);
    this.breadcrumbs.push({ x, y, direction });
    const options = this.getPossibleMoves(x, y);

    if (this.debug) {
      console.clear();
      console.log(this.printMapSimulation(this.breadcrumbs));
      console.log({
        choices: this.choices.size,
        checkpoints: this.checkpoints.length,
        bestSimulation: this.bestSimulation,
      });
    }

    // Se sono arrivato a destinazione salvo lo score
    if (this.getPosition(x, y) === END) {
      const simulation = this.calculateScoreSimulation(this.breadcrumbs);
      if (!this.bestSimulation || simulation.score < this.bestSimulation.score) {
        this.bestSimulation = simulation;
      }

      // Se ci sono altri checkpoints, li provo per verificare la migliore simulazione
      if (this.checkpoints.length > 0) {
        this.returnToCheckpoint();
        return await this.resolve();
      }

      clearInterval(this.interval);
      return {
        status: "success",
        simulation: this.bestSimulation,
      };
    }

    // Se non ci sono più opzioni e non ho checkpoint mi fermo
    if (options.length === 0 && this.checkpoints.length === 0 && this.bestSimulation) {
      clearInterval(this.interval);
      return {
        status: this.bestSimulation ? "success" : "failed",
        simulation: this.bestSimulation,
      };
    }

    // Se è una deadzone torno al checkpoint fino a che non ritorno in un path valido
    if (this.isDeadZone()) {
      this.returnToCheckpoint();
      return await this.resolve();
    }

    // Se la strada è già non ottimale rispetto alla best simulation provo un'altra strada
    if (this.bestSimulation && this.checkpoints.length > 0) {
      const simulation = this.calculateScoreSimulation(this.breadcrumbs);
      if (simulation.score > this.bestSimulation.score) {
        this.discardedPaths++;
        this.returnToCheckpoint();
        return await this.resolve();
      }
    }

    // Se non ci sono più opzioni torno indietro all'ultimo checkpoint rilevato
    if (options.length === 0 && this.checkpoints.length > 0) {
      this.deadEnds++;
      this.returnToCheckpoint();
      return await this.resolve();
    }

    // Se ho solo una opzione continuo su quella
    if (options.length === 1) {
      this.choose(options[0], direction);
      return await this.resolve();
    }

    // Se nelle multiple opzioni c'è il finale, lo scelgo
    const end = options.find(([x, y]) => this.getPosition(x, y) === END);
    if (end) {
      this.choose(end, direction);
      return await this.resolve();
    }

    // Se ho più opzioni salvo il checkpoint e scelgo la prima
    this.checkpoints.push([x, y]);
    this.choose(this.getBestChoice(options), direction, true);
    await this.resolve();
  }

  returnToCheckpoint() {
    this.backToCheckpoints++;
    const [returnX, returnY] = this.checkpoints.at(-1);
    this.currentPosition = [returnX, returnY];
    this.checkpoints.splice(this.checkpoints.length - 1, 1);
    for (let i = this.breadcrumbs.length - 1; i >= 0; i--) {
      const { x, y } = this.breadcrumbs[i];
      if (x === returnX && y === returnY) {
        this.breadcrumbs.splice(i + 1, this.breadcrumbs.length - i);
        break;
      }
    }
    try {
      const { x, y } = this.breadcrumbs.at(-2);
      this.prevPosition = [x, y];
    } catch (e) {
      const [x, y] = this.findReindeer();
      this.prevPosition = [x - 1, y];
    }
  }

  choose(option, direction, save = false) {
    const [nextX, nextY] = option;
    this.prevPosition = [...this.currentPosition];
    this.currentPosition = [nextX, nextY];

    if (save) {
      this.choices.set(this.getKeyChoice([{ x: nextX, y: nextY }]), direction);
    }
  }

  getBestChoice(options) {
    const [endX, endY] = this.findEnd();
    const distances = options
      .map(([x, y]) => ({
        position: [x, y],
        distance: endX - x + (y - endY),
      }))
      .toSorted((a, b) => a.distance - b.distance);
    return distances[0].position;
  }

  getPossibleMoves(x, y) {
    const options = [];
    for (let i = -1; i <= 1; i++) {
      main: for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        if (i !== 0 && j !== 0) continue;
        const nextX = x + i;
        const nextY = y + j;
        if (![EMPTY, END].includes(this.getPosition(nextX, nextY))) continue;
        if (this.choices.has(this.getKeyChoice([{ x: nextX, y: nextY }]))) {
          this.discarded.set(`${nextX}-${nextY}`, true);
          continue;
        }
        for (let k = this.breadcrumbs.length - 1; k >= 0; k--) {
          const { x, y } = this.breadcrumbs[k];
          if (x === nextX && y === nextY) {
            continue main;
          }
        }
        options.push([nextX, nextY]);
      }
    }
    return options;
  }

  isDeadZone() {
    const blocked = {
      up: false,
      left: false,
      right: false,
      down: false,
    };
    for (let j = 0; j < this.breadcrumbs.length; j++) {
      const { x, y } = this.breadcrumbs[j];
      if (!blocked.left) {
        let blockedLeft = true;
        for (let i = x - 1; i >= 0; i--) {
          if (
            this.map[y][i] !== WALL &&
            !this.breadcrumbs.find((b) => b.x === i && b.y === y)
          ) {
            blockedLeft = false;
            break;
          }
        }
        if (blockedLeft) blocked.left = true;
      }

      if (!blocked.up && x < this.map[0].length - 20) {
        let blockedUp = true;
        for (let i = y - 1; i >= 0; i--) {
          if (
            this.map[i][x] !== WALL &&
            !this.breadcrumbs.find((b) => b.x === x && b.y === i)
          ) {
            blockedUp = false;
            break;
          }
        }
        if (blockedUp) blocked.up = true;
      }

      if (blocked.up && blocked.left) {
        this.deadZones++;
        return true;
      }
    }
    return false;
  }

  findReindeer() {
    if (this.cache.has("reindeer_position")) {
      return this.cache.get("reindeer_position");
    }
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        if (this.map[y][x] === REINDEER) {
          this.cache.set("reindeer_position", [x, y]);
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

  getPosition(x, y) {
    return this.map[y][x];
  }

  getDirection(startX, startY, x, y) {
    if (x - startX > 0) {
      return RIGHT;
    } else if (x - startX < 0) {
      return LEFT;
    } else if (y - startY > 0) {
      return DOWN;
    } else {
      return UP;
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

    return `${colors[color] || colors.reset}█${colors.reset}`;
  }

  printMapSimulation(simulation) {
    const cachedSimulation = new Map();
    simulation.forEach(({ x, y }) => cachedSimulation.set(`${x}-${y}`, `█`));

    return this.map
      .reduce((prev, row, y) => {
        prev.push(
          row.reduce(
            (prev, cell, x) =>
              prev +
              (cachedSimulation.has(`${x}-${y}`)
                ? cachedSimulation.get(`${x}-${y}`)
                : this.discarded.has(`${x}-${y}`)
                ? this.coloredBlock("cyan")
                : {
                    [EMPTY]: " ",
                    [WALL]: this.coloredBlock("red"),
                    [END]: this.coloredBlock("green"),
                  }[cell] || cell),
            ""
          )
        );
        return prev;
      }, [])
      .join("\n");
  }

  calculateBestSimulation() {
    return [this.bestSimulation];
  }

  removeDuplicates(simulation) {
    const seen = new Set();
    return simulation.filter((obj, index) => {
      const key = JSON.stringify({ ...obj, direction: null });
      if (seen.has(key) || index === 0) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  getKeyChoice(add = []) {
    return JSON.stringify([
      ...this.removeDuplicates(this.breadcrumbs.slice(-25)).map(({ x, y }) => ({
        x,
        y,
      })),
      ...add,
    ]);
  }

  calculateScoreSimulation(simulation) {
    const [startX, startY] = this.findReindeer();
    // simulation = this.removeDuplicates(simulation);
    if (simulation[0].x === startX && simulation[0].y === startY) {
      simulation = simulation.slice(1);
    }
    let lastDirection = RIGHT;
    let turns = 0;
    return {
      steps: simulation.length,
      score: simulation
        .map((item) => {
          const sameDirection = item.direction === lastDirection;
          lastDirection = item.direction;
          if (sameDirection) {
            return 1;
          } else {
            turns++;
            return 1001;
          }
        })
        .reduce((prev, current) => prev + current, 0),
      turns,
    };
  }
}
