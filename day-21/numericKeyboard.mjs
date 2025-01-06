import { BUTTON, DirectionalKeyboard, EMPTY } from "./directionalKeyboard.mjs";

export class NumericKeyboard extends DirectionalKeyboard {
  buttons = {
    [EMPTY]: [3, 0],
    [BUTTON]: [3, 2],
    0: [3, 1],
    1: [2, 0],
    2: [2, 1],
    3: [2, 2],
    4: [1, 0],
    5: [1, 1],
    6: [1, 2],
    7: [0, 0],
    8: [0, 1],
    9: [0, 2],
  };

  keyboard = [
    ["7", "8", "9"],
    ["4", "5", "6"],
    ["1", "2", "3"],
    [EMPTY, "0", BUTTON],
  ];

  constructor({ sequence }) {
    super({ sequence });
    this.type = "numeric";
    this.sequence = sequence.split("");
    this.resultSequence = [];
    this.position = this.getStartPosition();
    this.totalRobots = 2;
    this.cache = new Map();
  }

  getNumericPart() {
    return parseInt(this.sequence.join(""));
  }

  getLastScore() {
    let sequence = this.getResultSequence();
    const sequenceNumber = [];
    for (let i = 0; i < this.totalRobots; i++) {
      console.log(
        "Resolve sequence in progress...",
        this.sequence.join(""),
        ((i / this.totalRobots) * 100).toFixed(2),
        "%",
        sequenceNumber.at(-1) ?? sequence.length
      );
      const key = `directional_keyboard_${sequence}_${i === 0 ? "human" : "robot"}`;
      if (this.cache.has(key)) {
        sequence = this.cache.get(key);
        continue;
      }
      if (i < 3) {
        const robot = new DirectionalKeyboard({ sequence, isHuman: i === 0 });
        robot.resolve();
        sequence = robot.getResultSequence();
        sequenceNumber.push(sequence.length);
        this.cache.set(key, sequence);
      } else {
        const newLength = this.estimateNextNumber(sequenceNumber);
        sequenceNumber.push(newLength);
      }
    }

    if (sequenceNumber.length > 0) {
      return sequenceNumber.at(-1);
    }
    return sequence.length;
  }

  estimateNextNumber(sequence) {
    const differences = [];
    for (let i = 1; i < sequence.length; i++) {
      differences.push(sequence[i] - sequence[i - 1]);
    }

    const ratio =
      differences[differences.length - 1] / differences[differences.length - 2];
    const nextDiff = differences[differences.length - 1] * ratio;
    const nextValue = sequence[sequence.length - 1] + nextDiff;
    return Math.floor(nextValue);
  }

  getPathScore(path) {
    const key = `sequence_path_score_${path.map(({ direction }) => direction).join("")}`;
    let sequence = path.map(({ direction }) => direction).join("");
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    for (let i = 0; i < this.totalRobots; i++) {
      const key = `directional_keyboard_${sequence}_${i === 0 ? "human" : "robot"}`;
      if (this.cache.has(key)) {
        sequence = this.cache.get(key);
        continue;
      }
      const robot = new DirectionalKeyboard({ sequence, isHuman: i === 0 });
      robot.resolve();
      sequence = robot.getResultSequence();
      this.cache.set(key, sequence);
    }

    this.cache.set(key, sequence.length);
    return sequence.length;
  }
}
