import { Buyer } from "./buyer.mjs";
import { expect, prepareData } from "./utils.mjs";

(() => {
  const buyer = new Buyer({ secretNumber: 123 });
  expect({
    text: "123 Ten Secret Keys",
    expected: JSON.stringify(
      [
        15887950, 16495136, 527345, 704524, 1553684, 12683156, 11100544, 12249484,
        7753432, 5908254,
      ],
      null,
      2
    ),
    result: JSON.stringify(
      [
        buyer.getNextSecretNumber(),
        buyer.getNextSecretNumber(),
        buyer.getNextSecretNumber(),
        buyer.getNextSecretNumber(),
        buyer.getNextSecretNumber(),
        buyer.getNextSecretNumber(),
        buyer.getNextSecretNumber(),
        buyer.getNextSecretNumber(),
        buyer.getNextSecretNumber(),
        buyer.getNextSecretNumber(),
      ],
      null,
      2
    ),
  });

  expect({
    text: "123 Highest Price",
    expected: 6,
    result: buyer.highestPrice,
  });

  expect({
    text: "123 Suggested sequence",
    expected: JSON.stringify([-1, -1, 0, 2]),
    result: JSON.stringify(buyer.suggestedSequence),
  });
})();

(() => {
  const buyer = new Buyer({ secretNumber: 1 });
  expect({
    text: "1 2000th Secret Key",
    expected: 8685429,
    result: buyer.getNextSecretNumber(2000),
  });
})();

(() => {
  const buyer = new Buyer({ secretNumber: 10 });
  expect({
    text: "10 2000th Secret Key",
    expected: 4700978,
    result: buyer.getNextSecretNumber(2000),
  });
})();

(() => {
  const buyer = new Buyer({ secretNumber: 100 });
  expect({
    text: "100 2000th Secret Key",
    expected: 15273692,
    result: buyer.getNextSecretNumber(2000),
  });
})();

(() => {
  const buyer = new Buyer({ secretNumber: 2024 });
  expect({
    text: "100 2000th Secret Key",
    expected: 8667524,
    result: buyer.getNextSecretNumber(2000),
  });
})();

await (async () => {
  const data = await prepareData("./data.test.1.txt");
  const totalSecretNumbers = data.reduce((prev, secretNumber) => {
    const buyer = new Buyer({ secretNumber });
    return prev + buyer.getNextSecretNumber(2000);
  }, 0);
  expect({
    text: "Total Test 2000th Secret Key",
    expected: 37327623,
    result: totalSecretNumbers,
  });
})();

await (async () => {
  const data = await prepareData("./data.test.2.txt");
  const sequences = data.reduce((prev, secretNumber) => {
    const buyer = new Buyer({ secretNumber });
    buyer.getNextSecretNumber(2000);
    const sequences = buyer.getBestSequences();
    for (let sequence in sequences) {
      if (!prev[sequence]) prev[sequence] = 0;
      prev[sequence] += sequences[sequence][0].price;
    }

    return prev;
  }, {});
  const [bestSequence] = Object.entries(sequences).toSorted((a, b) =>
    a[1] < b[1] ? 1 : -1
  );
  expect({
    text: "Best moment to sell for monkey with test data",
    expected: JSON.stringify(["-2,1,-1,3", 23]),
    result: JSON.stringify(bestSequence),
  });
})();
