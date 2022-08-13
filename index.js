const calculator = document.querySelector(".calc_body");
const keys = calculator.querySelector(".btn");
const display = document.getElementById("display");

keys.addEventListener("click", (e) => {
  if (e.target.matches("div")) {
    const key = e.target;
    const action = key.dataset.action;
    const keyContent = key.textContent;
    const displayedNum = display.textContent;
    // ...

    if (!action) {
      if (displayedNum === "0") {
        display.textContent = keyContent;
      } else {
        display.textContent = displayedNum + keyContent;
      }
    }

    if (action === "decimal") {
      display.textContent = displayedNum + ".";
    }

    if (
      action === "add" ||
      action === "subtract" ||
      action === "multiply" ||
      action === "divide"
    ) {
      key.classList.add("is-pressed");
    }
  }
});
