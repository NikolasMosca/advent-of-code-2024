const DIRECTION_UP = "^";
const DIRECTION_DOWN = "v";
const DIRECTION_LEFT = "<";
const DIRECTION_RIGHT = ">";

const WALL = "#";
const BOX = "O";
const BIG_BOX = "[]";
const ROBOT = "@";
const EMPTY = ".";

export class Warehouse {
  constructor({ map, moves }) {
    this.map = map;
    this.moves = moves;
    this.currentMove = 0;
    this.cache = new Map();
  }

  types = {
    [EMPTY]: (move) => this.processEmpty(move),
    [BOX]: (move) => this.processBox(move),
    [BIG_BOX[0]]: (move) => this.processBigBox(move),
    [BIG_BOX[1]]: (move) => this.processBigBox(move),
  };

  processMove() {
    const move = this.getMoveAndIncrement();
    const [x, y] = this.findRobot();
    const [nextX, nextY] = this.getNextPosition(x, y, move);
    const type = this.getPosition(nextX, nextY);
    return this.types[type]?.(move);
  }

  //============================================================================
  //============================== EMPTY PROCESS ===============================
  //============================================================================

  processEmpty(move) {
    const [x, y] = this.findRobot();
    const [nextX, nextY] = this.getNextPosition(x, y, move);
    this.changeMap(x, y, EMPTY);
    this.changeMap(nextX, nextY, ROBOT);
  }

  //============================================================================
  //=============================== BOX PROCESS ================================
  //============================================================================

  processBox(move) {
    const [x, y] = this.findRobot();
    const [nextX, nextY] = this.getNextPosition(x, y, move);
    let [newBoxX, newBoxY] = this.getNextPosition(nextX, nextY, move);
    let boxToMove = 1;

    while (![EMPTY, WALL].includes(this.getPosition(newBoxX, newBoxY))) {
      [newBoxX, newBoxY] = this.getNextPosition(newBoxX, newBoxY, move);
      boxToMove++;
    }

    if (this.getPosition(newBoxX, newBoxY) !== EMPTY) {
      return;
    }
    this.changeMap(x, y, EMPTY);
    this.changeMap(nextX, nextY, ROBOT);
    [newBoxX, newBoxY] = this.getNextPosition(nextX, nextY, move);

    while (![WALL].includes(this.getPosition(newBoxX, newBoxY)) && boxToMove > 0) {
      this.changeMap(newBoxX, newBoxY, BOX);
      boxToMove--;
      [newBoxX, newBoxY] = this.getNextPosition(newBoxX, newBoxY, move);
    }
  }

  //============================================================================
  //============================ BIG BOX PROCESS ===============================
  //============================================================================

  processBigBox(move) {
    const [x, y] = this.findRobot();
    const [nextX, nextY] = this.getNextPosition(x, y, move);

    // Se mi muovo in alto o in basso devo prendere ricorsivamente le casse da spostare
    if ([DIRECTION_UP, DIRECTION_DOWN].includes(move)) {
      const coordinates = this.getAllBigBoxPositions(nextX, nextY, move);
      if (coordinates.length === 0) {
        return;
      }

      coordinates.forEach(([x, y, box], _, positions) => {
        const [nextX, nextY] = this.getNextPosition(x, y, move);
        this.changeMap(nextX, nextY, box);

        // Se non fa parte di nessuna posizione successiva delle scatole la metto vuota
        if (
          !positions.find(([checkX, checkY]) => {
            [checkX, checkY] = this.getNextPosition(checkX, checkY, move);
            return x === checkX && y === checkY;
          })
        ) {
          this.changeMap(x, y, EMPTY);
        }
      });

      this.changeMap(x, y, EMPTY);
      this.changeMap(nextX, nextY, ROBOT);
      return;
    }

    // Se le muovo lateralmente il sistema è come le casse normali
    let [newBoxX, newBoxY] = this.getNextPosition(nextX, nextY, move);
    let boxToMove = [this.getPosition(nextX, nextY)];

    while (![EMPTY, WALL].includes(this.getPosition(newBoxX, newBoxY))) {
      boxToMove.push(this.getPosition(newBoxX, newBoxY));
      [newBoxX, newBoxY] = this.getNextPosition(newBoxX, newBoxY, move);
    }

    if (this.getPosition(newBoxX, newBoxY) !== EMPTY) {
      return;
    }
    this.changeMap(x, y, EMPTY);
    this.changeMap(nextX, nextY, ROBOT);
    [newBoxX, newBoxY] = this.getNextPosition(nextX, nextY, move);

    boxToMove.forEach((box) => {
      this.changeMap(newBoxX, newBoxY, box);
      [newBoxX, newBoxY] = this.getNextPosition(newBoxX, newBoxY, move);
    });
  }

  //============================================================================
  //=========================== CHALLENGE RESULT ===============================
  //============================================================================

  sumCoordinatesBox() {
    let sum = 0;
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        if ([BOX, BIG_BOX[0]].includes(this.getPosition(x, y))) {
          sum += y * 100 + x;
        }
      }
    }
    return sum;
  }

  //============================================================================
  //============================== UTILITIES ===================================
  //============================================================================

  getPosition(x, y) {
    return this.map[y][x];
  }

  getNextPosition(x, y, move) {
    return {
      [DIRECTION_UP]: [x, y - 1],
      [DIRECTION_DOWN]: [x, y + 1],
      [DIRECTION_LEFT]: [x - 1, y],
      [DIRECTION_RIGHT]: [x + 1, y],
    }[move];
  }

  findRobot() {
    if (this.cache.has("robot_position")) {
      return this.cache.get("robot_position");
    }
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        if (this.map[y][x] === ROBOT) {
          this.cache.set("robot_position", [x, y]);
          return [x, y];
        }
      }
    }
  }

  changeMap(x, y, type) {
    this.map[y][x] = type;
    if (type === ROBOT) {
      this.cache.set("robot_position", [x, y]);
    }
  }

  transformToWiderMap() {
    const wideMap = [];
    for (let y = 0; y < this.map.length; y++) {
      const row = [];
      for (let x = 0; x < this.map[y].length; x++) {
        const items = {
          [WALL]: [WALL, WALL],
          [BOX]: [...BIG_BOX],
          [EMPTY]: [EMPTY, EMPTY],
          [ROBOT]: [ROBOT, EMPTY],
        }[this.map[y][x]];
        items.forEach((item) => row.push(item));
      }
      wideMap.push(row);
    }
    this.map = wideMap;
  }

  getAllBigBoxPositions(x, y, move) {
    const [leftSide] = [...BIG_BOX];
    const positions = new Map();

    // Salvo la posizione della bigbox trovata
    positions.set(`${x}-${y}`, this.getPosition(x, y));
    const nextX = this.getPosition(x, y) === leftSide ? x + 1 : x - 1;
    positions.set(`${nextX}-${y}`, this.getPosition(nextX, y));

    //Cerco nelle posizioni salvate se ci sono altre scatole che si muovono
    for (let i = 0; i < positions.size; i++) {
      const keys = [...positions.keys()];
      let [x, y] = keys[i].split("-").map((item) => Number(item));
      [x, y] = this.getNextPosition(x, y, move);

      // Se trovo un muro non si sposta nulla
      if (this.getPosition(x, y) === WALL) {
        return [];
      }

      if (BIG_BOX.includes(this.getPosition(x, y))) {
        positions.set(`${x}-${y}`, this.getPosition(x, y));
        const nextX = this.getPosition(x, y) === leftSide ? x + 1 : x - 1;
        positions.set(`${nextX}-${y}`, this.getPosition(nextX, y));
      }
    }

    return [...positions.keys()].map((item) => [
      ...item.split("-").map((item) => Number(item)),
      positions.get(item),
    ]);
  }

  printMap() {
    return JSON.stringify(
      this.map.reduce((prev, row) => {
        prev.push(row.reduce((prev, cell) => prev + cell, ""));
        return prev;
      }, []),
      null,
      2
    );
  }

  hasNextMove() {
    return this.currentMove < this.moves.length;
  }

  getMoveAndIncrement() {
    return this.moves[this.currentMove++];
  }
}
