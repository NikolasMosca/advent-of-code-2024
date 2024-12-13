import fs from "fs/promises";

const SEPARATOR_ROWS = "\n";
const SEPARATOR_TEST_EQUATION = ": ";
const SEPARATOR_COLUMNS = " ";
export const OPERATOR_ADD = "+";
export const OPERATOR_MULTIPLY = "*";
export const OPERATOR_SUBSTRACT = "-";
export const OPERATOR_DIVIDE = "/";
export const OPERATOR_COMBINE = "||";
const cache = new Map();

export const prepareData = async (file = "./data.txt") => {
  const data = await fs.readFile(file, "utf8");
  return data
    .split(SEPARATOR_ROWS)
    .map((row) =>
      row
        .split(SEPARATOR_TEST_EQUATION)
        .map((item, position) =>
          position === 0
            ? item
            : item.split(SEPARATOR_COLUMNS).map((number) => Number(number))
        )
    )
    .reduce(
      (prev, [testValue, equations]) => ({
        ...prev,
        [testValue]: equations,
      }),
      {}
    );
};

export const evalLeftToRight = (expression = "") => {
  const tokens = expression.split(/\s+/);
  let result = parseFloat(tokens[0]);

  for (let i = 1; i < tokens.length; i += 2) {
    const operator = tokens[i];
    const operand = parseFloat(tokens[i + 1]);

    if (operator === OPERATOR_ADD) {
      result += operand;
    } else if (operator === OPERATOR_SUBSTRACT) {
      result -= operand;
    } else if (operator === OPERATOR_MULTIPLY) {
      result *= operand;
    } else if (operator === OPERATOR_DIVIDE) {
      result /= operand;
    } else if (operator === OPERATOR_COMBINE) {
      result = Number(`${result}${operand}`);
    } else {
      throw new Error(`Unsupported operator: ${operator}`);
    }
  }

  return result;
};

export const generateCombinations = ({ operations = [], equations = [] }) => {
  const results = [];

  const helper = (current, index) => {
    if (index === equations.length - 1) {
      results.push(current);
      return;
    }

    for (const op of operations) {
      helper(`${current} ${op} ${equations[index + 1]}`, index + 1);
    }
  };

  helper(`${equations[0]}`, 0);
  return results;
};

export const resolveEquation = ({
  testValue = 0,
  equations = [],
  operations = [OPERATOR_ADD, OPERATOR_MULTIPLY],
  debug = true,
}) => {
  const allPossibilites = generateCombinations({ equations, operations });

  if (debug) {
    const possibilities = [
      ...new Set(
        allPossibilites.filter(
          (combination) => Number(evalLeftToRight(combination)) === Number(testValue)
        )
      ),
    ];

    return {
      isResolvable: possibilities.length > 0,
      possibilities,
    };
  }

  return {
    isResolvable: allPossibilites
      .map((combination) => Number(evalLeftToRight(combination)))
      .includes(Number(testValue)),
  };
};
