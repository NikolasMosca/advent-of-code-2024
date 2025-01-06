export const UP = "^";
export const DOWN = "v";
export const LEFT = "<";
export const RIGHT = ">";
export const EMPTY = "";
export const BUTTON = "A";

const cache = new Map();

export class DirectionalKeyboard {
  buttons = {
    [EMPTY]: [0, 0],
    [UP]: [0, 1],
    [BUTTON]: [0, 2],
    [LEFT]: [1, 0],
    [DOWN]: [1, 1],
    [RIGHT]: [1, 2],
  };
  keyboard = [
    [EMPTY, UP, BUTTON],
    [LEFT, DOWN, RIGHT],
  ];

  constructor({ sequence, isHuman = false }) {
    this.type = "directional";
    this.sequence = sequence.split("");
    this.resultSequence = [];
    this.isHuman = isHuman;
    this.position = this.getStartPosition();
  }

  resolve() {
    this.sequence.forEach((buttonToPress) => {
      const destination = [...this.buttons[buttonToPress]];
      const key = `${this.isHuman ? "human" : "robot"}_${this.type}_${this.position.join(
        "-"
      )}_${destination.join("-")}`;
      const [path] = cache.has(key)
        ? cache.get(key)
        : this.findShortestPath(this.buttons[buttonToPress]);
      this.addResultSequence(path);
      this.position = destination;
      cache.set(key, [path]);
    });
  }

  getStartPosition() {
    return this.buttons[BUTTON];
  }

  getResultSequence() {
    return this.resultSequence.join("");
  }

  getScore() {
    return this.resultSequence.join("").length;
  }

  addResultSequence(sequences = []) {
    this.resultSequence = [
      ...this.resultSequence,
      ...sequences.map(({ direction }) => direction),
      BUTTON,
    ];
  }

  getPathScore(path) {
    const key = `sequence_path_score_${path.map(({ direction }) => direction).join("")}`;
    if (cache.has(key)) {
      return cache.get(key);
    }
    const sameMoves = ["<<", "vv", "^^", ">>", "AA"];
    const bestMoves = ["<v", "v^", "v>", ">A", "^A"];
    const worstMoves = ["<^", "^>", "<>", "vA"];
    let score = 0;

    // I movimenti uguali fanno risparmiare una mossa
    sameMoves.forEach((move) => {
      let stringPath = path.map(({ direction }) => direction).join("");
      while (stringPath.includes(move)) {
        score++;
        stringPath = stringPath.replace(move, move[1]);
      }
    });

    // I movimenti migliori hanno il costo di una mossa
    bestMoves.forEach((move) => {
      let stringPath = path.map(({ direction }) => direction).join("");
      while (stringPath.includes(move)) {
        score += 10;
        stringPath = stringPath.replace(move, move[1]);
      }
    });
    bestMoves.forEach((move) => {
      let stringPath = path.map(({ direction }) => direction).join("");
      move = [...move].reverse().join("");
      while (stringPath.includes(move)) {
        score += 10;
        stringPath = stringPath.replace(move, move[1]);
      }
    });
    // I movimenti migliori hanno il costo di due mosse
    worstMoves.forEach((move) => {
      let stringPath = path.map(({ direction }) => direction).join("");
      while (stringPath.includes(move)) {
        score += 100;
        stringPath = stringPath.replace(move, move[1]);
      }
    });
    worstMoves.forEach((move) => {
      let stringPath = path.map(({ direction }) => direction).join("");
      move = [...move].reverse().join("");
      while (stringPath.includes(move)) {
        score += 100;
        stringPath = stringPath.replace(move, move[1]);
      }
    });

    cache.set(key, score);
    return score;
  }

  findShortestPath(end) {
    const matrix = this.keyboard;
    const enableEmpty = this.isHuman;
    const rows = this.keyboard.length;
    const cols = this.keyboard[0].length;

    const directions = [
      [0, 1, RIGHT], // Destra
      [1, 0, DOWN], // Giù
      [0, -1, LEFT], // Sinistra
      [-1, 0, UP], // Su
    ];

    const start = [...this.position];
    const allPaths = [];
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    let minScore = Infinity;

    function dfs(row, col, path, direction, currentScore) {
      if (
        row < 0 ||
        row >= rows ||
        col < 0 ||
        col >= cols ||
        visited[row][col] ||
        (!enableEmpty && matrix[row][col] === EMPTY)
      ) {
        return;
      }

      // Calcola il costo di passo
      const newScore = currentScore + 1;

      // Pruning: interrompi la ricerca se il costo supera il minimo
      if (newScore > minScore) return;

      path.push({ row, col, direction });
      visited[row][col] = true;

      // Se la destinazione è raggiunta, salva il percorso e aggiorna minScore
      if (row === end[0] && col === end[1]) {
        allPaths.push([...path.filter(({ direction }) => direction)]);
        // minScore = newScore;
      } else {
        // Esplora le direzioni
        for (let [dRow, dCol, dir] of directions) {
          dfs(row + dRow, col + dCol, path, dir, newScore);
        }
      }

      // Backtracking
      path.pop();
      visited[row][col] = false;
    }

    dfs(start[0], start[1], [], null, 0);
    return allPaths.toSorted((a, b) =>
      this.getPathScore(a) < this.getPathScore(b) ? -1 : 1
    );
  }
}
