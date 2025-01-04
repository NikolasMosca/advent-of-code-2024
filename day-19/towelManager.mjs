export class TowelManager {
  constructor({ towels, designs }) {
    this.towels = towels;
    this.designs = designs;
    this.cache = new Map();
  }

  async resolve() {
    const results = await Promise.all(
      this.designs.map((design) => this.isPossibleDesign(design))
    );
    return {
      validDesigns: results.filter((result) => result).length,
      validWays: results.reduce((prev, ways) => prev + ways, 0),
    };
  }

  async isPossibleDesign(design) {
    let validChoices = 0;
    const key = `is_possible_design_${design}`;
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    if (design.length === 0) {
      this.cache.set(key, 1);
      return 1;
    }
    const possibilities = this.towels.filter((towel) => design.startsWith(towel));
    for (let i = 0; i < possibilities.length; i++) {
      const choice = possibilities[i];
      const ways = await this.isPossibleDesign(design.replace(choice, ""));
      validChoices += ways;
    }

    this.cache.set(key, validChoices);
    return validChoices;
  }
}
