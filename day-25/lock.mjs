const EMPTY = ".";
const PIN = "#";

export class Lock {
  constructor({ values }) {
    this.values = values;
    this.pins = [];
    this.keys = [];

    this.values.forEach((item, index) => this.calculateHeights(item, index));
  }

  resolve() {
    const fitKeys = [];
    this.keys.forEach((key) => {
      this.pins.forEach((pin) => {
        if (this.isValidPinWithKey(pin, key)) {
          fitKeys.push({ key, pin });
        }
      });
    });
    return fitKeys;
  }

  isValidPinWithKey(pin, key) {
    return pin.heights.every((value, index) => key.heights[index] + value <= 5);
  }

  calculateHeights(item, index) {
    const heights = [];
    let isPin = true;
    for (let i = 0; i < item[0].length; i++) {
      if (item[0][i] === EMPTY) {
        item = item.reverse();
        isPin = false;
        break;
      }
    }
    for (let x = 0; x < item[0].length; x++) {
      for (let y = 0; y < item.length; y++) {
        const cell = item[y][x];
        if (cell === EMPTY) {
          heights.push(y - 1);
          break;
        }
      }
    }
    if (isPin) {
      this.pins.push({ index, heights });
    } else {
      this.keys.push({ index, heights });
    }
  }
}
