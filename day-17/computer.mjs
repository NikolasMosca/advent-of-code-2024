const ADV = 0;
const BXL = 1;
const BST = 2;
const JNZ = 3;
const BXC = 4;
const OUT = 5;
const BDV = 6;
const CDV = 7;

export class Computer {
  operation = {
    // Perform division
    [ADV]: () => {
      const numerator = this.a;
      const denominator = 2 ** this.getValue();
      this.a = Math.trunc(numerator / denominator);
    },
    // Bitwise XOR
    [BXL]: () => {
      this.b = this.b ^ this.value[this.getOperand()]();
    },
    // Using modulo
    [BST]: () => {
      this.b = this.getValue() % 8;
    },
    // Jumping cursor
    [JNZ]: () => {
      // Do nothing when a is zero
      if (this.a === 0) return;
      this.cursor = this.getValue();
      this.enableIncrement = false;
    },
    // Bitwise XOR
    [BXC]: () => {
      this.b = this.b ^ this.c;
    },
    // Output the result value
    [OUT]: () => {
      this.output.push(this.getValue() % 8);

      // If the value is invalid then it's a corrupted data, stop instantly
      if (this.output.at(-1) < 0) {
        this.output = [];
        this.cursor = this.program.length;
      }

      // If this is copy program mode, check the sequence number that is expected
      if (
        this.copyProgramEnabled &&
        this.output.at(-1) !== this.program.at(this.output.length - 1)
      ) {
        this.percentage = ((this.output.length / this.program.length) * 100).toFixed(2);
        if (this.debug && this.output.length > Math.floor(this.program.length / 2)) {
          console.log(
            "A: ",
            this.startA,
            "Copy Program",
            this.percentage,
            "%",
            (() => {
              let bar = "";
              for (let i = 0; i < Math.floor(this.percentage / 10); i++)
                bar += this.coloredBlock("green");
              for (let i = 0; i < 10 - Math.floor(this.percentage / 10); i++)
                bar += this.coloredBlock("red");
              return `[${bar}]`;
            })(),
            this.output.join(",")
          );
        }

        this.output = [];
        this.cursor = this.program.length;
      }
    },
    // Perform division
    [BDV]: () => {
      const numerator = this.a;
      const denominator = 2 ** this.getValue();
      this.b = Math.trunc(numerator / denominator);
    },
    [CDV]: () => {
      const numerator = this.a;
      const denominator = 2 ** this.getValue();
      this.c = Math.trunc(numerator / denominator);
    },
  };

  value = {
    0: () => 0,
    1: () => 1,
    2: () => 2,
    3: () => 3,
    4: () => this.a,
    5: () => this.b,
    6: () => this.c,
    7: () => 7,
  };

  constructor({ a, b, c, program, debug = false, copyProgramEnabled = false }) {
    this.startA = a;
    this.a = a;
    this.b = b;
    this.c = c;
    this.program = program;
    this.cursor = 0;
    this.output = [];
    this.expectedA = 35184372088832;
    this.counter = 0;
    this.copyProgramEnabled = copyProgramEnabled;
    this.debug = debug;
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

  getValue() {
    return this.value[this.getOperand()]();
  }

  getOperand() {
    return this.program[this.cursor + 1];
  }

  getOpCode() {
    return this.program[this.cursor];
  }

  getOperation() {
    return this.operation[this.getOpCode()];
  }

  haveInstructions() {
    this.enableIncrement = true;
    return this.program?.[this.cursor] !== undefined;
  }

  execute() {
    while (this.haveInstructions()) {
      const opCode = this.getOpCode();
      this.getOperation()();
      if (this.enableIncrement) {
        this.cursor += 2;
      }

      if (this.debug) {
        console.log({
          operation: {
            [ADV]: "ADV",
            [BXL]: "BXL",
            [BST]: "BST",
            [JNZ]: "JNZ",
            [BXC]: "BXC",
            [OUT]: "OUT",
            [BDV]: "BDV",
            [CDV]: "CDV",
          }[opCode],
          output: this.output.join(","),
          a: this.a,
          b: this.b,
          c: this.c,
        });
      }
    }
  }

  copyProgram() {
    do {
      this.counter++;
      if (this.simulation) this.expectedA++;
      this.simulation = new Computer({
        a: this.expectedA,
        b: this.b,
        c: this.c,
        program: this.program,
        copyProgramEnabled: true,
        debug: false,
      });
      this.simulation.execute();
      if (this.debug && this.simulation.output.length > 0) {
        console.log(this.expectedA, this.simulation.output.join(","));
      }
    } while (this.simulation.output.join(",") !== this.program.join(","));
  }
}
