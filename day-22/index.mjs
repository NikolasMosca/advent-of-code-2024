import { Buyer } from "./buyer.mjs";
import { prepareData } from "./utils.mjs";

await (async () => {
  const data = await prepareData();
  const { total, sequences } = data.reduce(
    (prev, secretNumber) => {
      const buyer = new Buyer({ secretNumber });
      const number = buyer.getNextSecretNumber(2000);
      const sequences = buyer.getBestSequences();
      for (let sequence in sequences) {
        if (!prev.sequences[sequence]) prev.sequences[sequence] = 0;
        prev.sequences[sequence] += sequences[sequence][0].price;
      }
      prev.total += number;
      return prev;
    },
    { sequences: {}, total: 0 }
  );
  console.log("Part 1", total);

  const [bestSequence] = Object.entries(sequences).toSorted((a, b) =>
    a[1] < b[1] ? 1 : -1
  );
  console.log("Part 2", bestSequence);
})();
