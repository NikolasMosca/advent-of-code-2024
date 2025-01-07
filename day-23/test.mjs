import { ComputerGroups } from "./computerGroup.mjs";
import { expect, prepareData } from "./utils.mjs";

await (async () => {
  const connections = await prepareData("./data.test.1.txt");
  const computerGroups = new ComputerGroups(connections);
  computerGroups.generate();
  expect({
    text: "Group generated correctly",
    expected: JSON.stringify([
      "aq,cg,yn",
      "aq,vc,wq",
      "co,de,ka",
      "co,de,ta",
      "co,ka,ta",
      "de,ka,ta",
      "kh,qp,ub",
      "qp,td,wh",
      "tb,vc,wq",
      "tc,td,wh",
      "td,wh,yn",
      "ub,vc,wq",
    ]),
    result: JSON.stringify(computerGroups.groups),
  });

  expect({
    text: "Group with t inside found correctly",
    expected: JSON.stringify([
      "co,de,ta",
      "co,ka,ta",
      "de,ka,ta",
      "qp,td,wh",
      "tb,vc,wq",
      "tc,td,wh",
      "td,wh,yn",
    ]),
    result: JSON.stringify(computerGroups.findGroup("t")),
  });

  expect({
    text: "Largest group found correctly",
    expected: "co,de,ka,ta",
    result: computerGroups.getLargestGroup(),
  });
})();
