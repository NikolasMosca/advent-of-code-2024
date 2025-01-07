export class Buyer {
  constructor({ secretNumber }) {
    this.secretNumber = secretNumber;
    this.priceChanges = [];
    this.addPriceChange();
  }

  getNextSecretNumber(times = 1) {
    // Step 1
    this.mix(this.secretNumber * 64);
    this.prune();

    //Step 2
    this.mix(Math.floor(this.secretNumber / 32));
    this.prune();

    // Step 3
    this.mix(this.secretNumber * 2048);
    this.prune();

    this.addPriceChange();
    if (times > 1) {
      return this.getNextSecretNumber(times - 1);
    }
    return this.secretNumber;
  }

  mix(number) {
    this.secretNumber = number ^ this.secretNumber;
  }

  // Gestione numero negativo con modulo
  prune() {
    this.secretNumber = ((this.secretNumber % 16777216) + 16777216) % 16777216;
  }

  getPrice() {
    return Number(String(this.secretNumber).at(-1));
  }

  getAmount() {
    if (this.priceChanges.length === 0) {
      return null;
    }
    return this.getPrice() - this.priceChanges.at(-1).price;
  }

  getPriceChanges() {
    return this.priceChanges;
  }

  addPriceChange() {
    const data = {
      price: this.getPrice(),
      amount: this.getAmount(),
      sequence: (() => {
        if (this.priceChanges.length < 4) {
          return null;
        }
        return [
          this.priceChanges.at(-3).amount,
          this.priceChanges.at(-2).amount,
          this.priceChanges.at(-1).amount,
          this.getAmount(),
        ];
      })(),
    };
    this.priceChanges.push(data);
  }

  getBestSequences() {
    return Object.groupBy(
      Object.entries(
        Object.groupBy(this.priceChanges, ({ sequence }) =>
          sequence ? sequence.join(",") : "_"
        )
      )
        .map(([sequence, [{ price }]]) => {
          if (sequence === "_") return { sequence, price: 0 };
          return { sequence, price };
        })
        .toSorted((a, b) => (a.price < b.price ? 1 : -1)),
      ({ sequence }) => sequence
    );
  }
}
