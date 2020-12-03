const addBtn = document.querySelector(".add__btn")! as HTMLButtonElement;
const incomeList = document.querySelector(".income__list")! as HTMLDivElement;
const expenseList = document.querySelector(
  ".expenses__list"
)! as HTMLDivElement;
const totalExpenseElement = document.querySelector(
  ".budget__expenses--value"
)! as HTMLDivElement;
const percentageExpenseElement = document.querySelector(
  ".budget__expenses--percentage"
)! as HTMLDivElement;
const totalIncomeElement = document.querySelector(
  ".budget__income--value"
)! as HTMLDivElement;
const totalBudgetElement = document.querySelector(
  ".budget__value"
)! as HTMLDivElement;

class Item {
  constructor(
    public id: string,
    public description: string,
    public type: string,
    public value: number
  ) {}
}

interface State {
  expenses: Item[];
  incomes: Item[];
  totalBudget: number;
  totalIncomes: number;
  totalExpenses: number;
}

const state: State = {
  expenses: [],
  incomes: [],
  totalBudget: 0,
  totalIncomes: 0,
  totalExpenses: 0,
};

const addItemUI = (item: Item): void => {
  if (item.type === "inc") {
    const incomeHtml = `
      <div class="item clearfix" id="income-${item.id}">
        <div class="item__description">${item.description}</div>
        <div class="right clearfix">
          <div class="item__value">+ ${item.value}</div>
          <div class="item__delete">
            <button class="item__delete--btn">
              <i class="ion-ios-close-outline"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    incomeList.insertAdjacentHTML("beforeend", incomeHtml);
  } else {
    let percentage: string = ((item.value / state.totalIncomes) * 100).toFixed(
      2
    );
    if (state.totalIncomes === 0) {
      percentage = "---";
    }
    const expenseHTML = `
      <div class="item clearfix" id="expense-${item.id}">
        <div class="item__description">${item.description}</div>
        <div class="right clearfix">
          <div class="item__value">- ${item.value}</div>
          <div class="item__percentage">${percentage}%</div>
          <div class="item__delete">
            <button class="item__delete--btn">
              <i class="ion-ios-close-outline"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    expenseList.insertAdjacentHTML("beforeend", expenseHTML);
  }
};

const updateExpensePercentages = () => {
  state.expenses.forEach((expense) => {
    const expenseElement = document.getElementById(`expense-${expense.id}`);

    const expenseItem = state.expenses.find(
      (exp) => exp.id === expenseElement!.getAttribute("id")!.split("-")[1]
    );
    expenseElement!.querySelector(".item__percentage")!.textContent =
      ((expenseItem!.value / state.totalIncomes) * 100).toFixed(2) + "%";
  });
};

const addItemState = (item: Item): void => {
  if (item.type === "inc") {
    state.incomes.push(item);
    state.totalIncomes += item.value;
    state.totalBudget += item.value;
    updateExpensePercentages();
  } else {
    state.expenses.push(item);
    state.totalExpenses += item.value;
    state.totalBudget -= item.value;
  }
};

const updateTotalsUI = () => {
  totalBudgetElement.innerText = state.totalBudget.toString();
  totalIncomeElement.textContent = state.totalIncomes.toString();
  totalExpenseElement.textContent = state.totalExpenses.toString();
  percentageExpenseElement.textContent =
    state.totalIncomes === 0
      ? "---%"
      : ((state.totalExpenses / state.totalIncomes) * 100).toFixed(2) + "%";
};

const addItemHandler = () => {
  const type = document.querySelector(".add__type")! as HTMLSelectElement;
  const desc = document.querySelector(".add__description")! as HTMLInputElement;
  const value = document.querySelector(".add__value")! as HTMLInputElement;
  const id = (Math.random() * Math.random()).toString();

  if (type.value === "inc") {
    const item = new Item(id, desc.value, type.value, +value.value);
    addItemState(item);
    updateTotalsUI();
    addItemUI(item);
  } else if (type.value === "exp") {
    const item = new Item(id, desc.value, type.value, +value.value);
    addItemState(item);
    updateTotalsUI();
    addItemUI(item);
  }
};

const removeIncomeHandler = (e: any) => {
  if (e.target!.matches(".ion-ios-close-outline")) {
    const itemElement = e.target.closest(".item")! as HTMLDivElement;
    const id = itemElement.getAttribute("id")!.split("-")[1];
    const item = state.incomes.find((inc) => inc.id === id);
    state.incomes = state.incomes.filter((inc) => inc.id !== id);
    state.totalIncomes -= item!.value;
    state.totalBudget -= item!.value;
    updateTotalsUI();
    updateExpensePercentages();
    itemElement.remove();
  }
};

const removeExpenseHandler = (e: any) => {
  if (e.target!.matches(".ion-ios-close-outline")) {
    const itemElement = e.target.closest(".item")! as HTMLDivElement;
    const id = itemElement.getAttribute("id")!.split("-")[1];
    const item = state.expenses.find((inc) => inc.id === id);
    state.expenses = state.expenses.filter((inc) => inc.id !== id);
    state.totalExpenses -= item!.value;
    state.totalBudget += item!.value;
    updateTotalsUI();
    itemElement.remove();
  }
};

addBtn.addEventListener("click", addItemHandler);
incomeList.addEventListener("click", removeIncomeHandler);
expenseList.addEventListener("click", removeExpenseHandler);
