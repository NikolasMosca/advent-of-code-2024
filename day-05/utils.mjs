import fs from "fs/promises";

const SEPARATOR_RULES_DATA = "\n\n";
const SEPARATOR_RULES = "|";
const SEPARATOR_PAGES = ",";
const SEPARATOR_ROWS = "\n";

export const prepareData = async (file = "./data.txt") => {
  const data = await fs.readFile(file, "utf8");
  const [rules, pageUpdates] = data.split(SEPARATOR_RULES_DATA);
  return {
    rules: rules.split(SEPARATOR_ROWS).map((item) => item.split(SEPARATOR_RULES).map((number) => Number(number))),
    pageUpdates: pageUpdates.split(SEPARATOR_ROWS).map((item) => item.split(SEPARATOR_PAGES).map((number) => Number(number))),
  };
};

export const checkPageRules = ({ pages = [], rules = [] }) => {
  // Controllo ciascuna pagina
  for (let index = 0; index < pages.length; index++) {
    // Estraggo le regole per questa pagina
    const currentPage = pages[index];
    const prevRules = rules.filter(([_, next]) => next === currentPage).map(([prev]) => prev);
    const nextRules = rules.filter(([prev]) => prev === currentPage).map(([_, next]) => next);

    // Se trovo nelle pagine precedenti delle pagine che devono stare dopo non è valido
    for (let i = 0; i < index - 1; i++) {
      const page = pages[i];
      if (nextRules.includes(page)) {
        return false;
      }
    }
    // Se trovo nelle pagine successive delle pagine che devono stare prima non è valido
    for (let i = index + 1; i < pages.length; i++) {
      const page = pages[i];
      if (prevRules.includes(page)) {
        return false;
      }
    }
  }
  return true;
};

export const movePage = ({ pages = [], sourceIndex = 0, destinationIndex = 0 }) => {
  const pageToMove = pages[sourceIndex];
  const filteredPages = pages.filter((_, index) => index !== sourceIndex);
  return [...filteredPages.slice(0, destinationIndex), pageToMove, ...filteredPages.slice(destinationIndex)];
};

export const fixPageUpdates = ({ pages = [], rules = [] }) => {
  // Controllo ciascuna pagina
  for (let index = 0; index < pages.length; index++) {
    // Estraggo le regole per questa pagina
    const currentPage = pages[index];
    const prevRules = rules.filter(([_, next]) => next === currentPage).map(([prev]) => prev);
    const nextRules = rules.filter(([prev]) => prev === currentPage).map(([_, next]) => next);

    // Se trovo nelle pagine precedenti delle pagine che devono stare dopo non è valido
    for (let i = 0; i < index - 1; i++) {
      const page = pages[i];
      if (nextRules.includes(page)) {
        return fixPageUpdates({ pages: movePage({ pages, sourceIndex: i, destinationIndex: index }), rules });
      }
    }
    // Se trovo nelle pagine successive delle pagine che devono stare prima non è valido
    for (let i = index + 1; i < pages.length; i++) {
      const page = pages[i];
      if (prevRules.includes(page)) {
        return fixPageUpdates({ pages: movePage({ pages, sourceIndex: i, destinationIndex: index }), rules });
      }
    }
  }
  return pages;
};
