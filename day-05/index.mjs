import { checkPageRules, fixPageUpdates, prepareData } from "./utils.mjs";

const { rules, pageUpdates } = await prepareData();

const validPageUpdates = pageUpdates.filter((pages) =>
  checkPageRules({
    pages,
    rules,
  })
);

const sumMiddlePages = validPageUpdates
  .map((pages) => pages[Math.floor(pages.length / 2)])
  .reduce((prev, current) => prev + current, 0);

console.log("Part 1", { sumMiddlePages });

const sumMiddleFixedPages = pageUpdates
  .filter(
    (pages) =>
      !checkPageRules({
        pages,
        rules,
      })
  )
  .map((pages) => fixPageUpdates({ pages, rules }))
  .map((pages) => pages[Math.floor(pages.length / 2)])
  .reduce((prev, current) => prev + current, 0);

console.log("Part 2", { sumMiddleFixedPages });
