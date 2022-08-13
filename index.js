const getKeyType = (key) => {
  const { action } = key.dataset;
  if (!action) return "number";
  if (
    action === "addition" ||
    action === "subtract" ||
    action === "multiply" ||
    action === "divide"
  )
    return "operator";
  // For everything else, return the action
  return action;
};

const calculate = (n1, operator, n2) => {
  const firstNum = parseFloat(n1);
  const secondNum = parseFloat(n2);
  if (operator === "addition") return firstNum + secondNum;
  if (operator === "subtract") return firstNum - secondNum;
  if (operator === "multiply") return firstNum * secondNum;
  if (operator === "divide") return firstNum / secondNum;
};

const createResultString = (key, displayedNum, state) => {
  const keyContent = key.textContent;
  const keyType = getKeyType(key);
  const { firstValue, operator, modValue, previousKeyType } = state;

  if (keyType === "number") {
    return displayedNum === "0" ||
      previousKeyType === "operator" ||
      previousKeyType === "equal"
      ? keyContent
      : displayedNum + keyContent;
  }

  if (keyType === "decimal") {
    if (!displayedNum.includes(".")) return displayedNum + ".";
    if (previousKeyType === "operator" || previousKeyType === "equal")
      return "0.";
    return displayedNum;
  }

  if (keyType === "operator") {
    return firstValue &&
      operator &&
      previousKeyType !== "operator" &&
      previousKeyType !== "equal"
      ? calculate(firstValue, operator, displayedNum)
      : displayedNum;
  }

  if (keyType === "ac") {
    return "";
  }

  if (keyType === "equal") {
    return firstValue
      ? previousKeyType === "equal"
        ? calculate(displayedNum, operator, modValue)
        : calculate(firstValue, operator, displayedNum)
      : displayedNum;
  }
};

const updateCalculatorState = (
  key,
  calculator,
  calculatedValue,
  displayedNum
) => {
  const keyType = getKeyType(key);
  const { firstValue, operator, modValue, previousKeyType } =
    calculator.dataset;

  calculator.dataset.previousKeyType = keyType;

  if (keyType === "operator") {
    calculator.dataset.operator = key.dataset.action;
    calculator.dataset.firstValue =
      firstValue &&
      operator &&
      previousKeyType !== "operator" &&
      previousKeyType !== "equal"
        ? calculatedValue
        : displayedNum;
  }

  if (keyType === "equal") {
    calculator.dataset.modValue =
      firstValue && previousKeyType === "equal" ? modValue : displayedNum;
  }

  if (keyType === "ac" && key.textContent === "CE") {
    calculator.dataset.firstValue = "";
    calculator.dataset.modValue = "";
    calculator.dataset.operator = "";
    calculator.dataset.previousKeyType = "";
  }
};

const updateVisualState = (key, calculator) => {
  const keyType = getKeyType(key);
  Array.from(key.parentNode.children).forEach((k) =>
    k.classList.remove("is-pressed")
  );

  if (keyType === "operator") {
    key.classList.add("is-pressed");
    console.log("operator");
  }
  if (keyType === "ac" && key.textContent !== "AC") {
    console.log("clear");
    key.textContent = "AC";
  }
  if (keyType !== "ac") {
    const clearButton = calculator.querySelector("[data-action=ac]");
    clearButton.textContent = "CE";
  }
};

const calculator = document.querySelector(".calculator");
const display = calculator.querySelector(".display");
const keys = calculator.querySelector(".calc_btns");

keys.addEventListener("click", (e) => {
  if (!e.target.matches("button")) return;
  const key = e.target;
  const displayedNum = display.textContent;
  const resultString = createResultString(
    key,
    displayedNum,
    calculator.dataset
  );

  display.textContent = resultString;
  updateCalculatorState(key, calculator, resultString, displayedNum);
  updateVisualState(key, calculator);
});
