const card = document.querySelector('[data-testid="test-todo-card"]');

const checkbox = document.querySelector('[data-testid="test-todo-complete-toggle"]');
const titleEl = document.querySelector('[data-testid="test-todo-title"]');
const descEl = document.querySelector('[data-testid="test-todo-collapsible-section"]');
const statusEl = document.querySelector('[data-testid="test-todo-status"]');
const statusControl = document.querySelector('[data-testid="test-todo-status-control"]');

const expandBtn = document.querySelector('[data-testid="test-todo-expand-toggle"]');

const priorityEl = document.querySelector('[data-testid="test-todo-priority"]');
const priorityIndicator = document.querySelector('[data-testid="test-todo-priority-indicator"]');

const dueDateEl = document.querySelector('[data-testid="test-todo-due-date"]');
const timeRemainingEl = document.querySelector('[data-testid="test-todo-time-remaining"]');
const overdueEl = document.querySelector('[data-testid="test-todo-overdue-indicator"]');

const editBtn = document.querySelector('[data-testid="test-todo-edit-button"]');
const deleteBtn = document.querySelector('[data-testid="test-todo-delete-button"]');

const form = document.querySelector('[data-testid="test-todo-edit-form"]');
const editTitle = document.querySelector('[data-testid="test-todo-edit-title-input"]');
const editDesc = document.querySelector('[data-testid="test-todo-edit-description-input"]');
const editPriority = document.querySelector('[data-testid="test-todo-edit-priority-select"]');
const editDueDate = document.querySelector('[data-testid="test-todo-edit-due-date-input"]');

const saveBtn = document.querySelector('[data-testid="test-todo-save-button"]');
const cancelBtn = document.querySelector('[data-testid="test-todo-cancel-button"]');

let state = {
  title: titleEl.textContent,
  description: descEl.textContent,
  priority: priorityEl.textContent,
  status: "pending",
  dueDate: dueDateEl.getAttribute("datetime"),
  completed: false
};

let timer;

function setPriorityUI(priority) {
  priorityEl.textContent = priority;
  if (priority === "Low") priorityIndicator.style.background = "#51cf66";
  if (priority === "Medium") priorityIndicator.style.background = "#ffd43b";
  if (priority === "High") priorityIndicator.style.background = "#ff6b6b";
}

function syncStatusUI(value) {
  state.status = value;
  statusEl.textContent = value;

  card.classList.remove("done", "in-progress");
  if (value === "done") {
    checkbox.checked = true;
    card.classList.add("done");
    state.completed = true;
    timeRemainingEl.textContent = "Completed";
  } else {
    state.completed = false;
    checkbox.checked = false;
    if (value === "in progress") card.classList.add("in-progress");
  }

  statusControl.value = value;
}

checkbox.addEventListener("change", () => {
  if (checkbox.checked) {
    syncStatusUI("done");
  } else {
    syncStatusUI("pending");
  }
});

statusControl.addEventListener("change", (e) => {
  syncStatusUI(e.target.value);
});

expandBtn.addEventListener("click", () => {
  const expanded = expandBtn.getAttribute("aria-expanded") === "true";
  expandBtn.setAttribute("aria-expanded", !expanded);
  expandBtn.textContent = expanded ? "Expand" : "Collapse";
  descEl.hidden = expanded;
});

function updateTime() {
  if (state.completed) return;

  const now = new Date();
  const due = new Date(state.dueDate);
  const diff = due - now;

  if (diff <= 0) {
    const overdueTime = Math.abs(diff);
    const mins = Math.floor(overdueTime / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);

    overdueEl.textContent = "⚠ Overdue";
    card.classList.add("overdue");

    if (days > 0) timeRemainingEl.textContent = `Overdue by ${days} day(s)`;
    else if (hrs > 0) timeRemainingEl.textContent = `Overdue by ${hrs} hour(s)`;
    else timeRemainingEl.textContent = `Overdue by ${mins} minute(s)`;
  } else {
    overdueEl.textContent = "";
    card.classList.remove("overdue");

    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);

    if (days > 0) timeRemainingEl.textContent = `Due in ${days} day(s)`;
    else if (hrs > 0) timeRemainingEl.textContent = `Due in ${hrs} hour(s)`;
    else timeRemainingEl.textContent = `Due in ${mins} minute(s)`;
  }
}

editBtn.addEventListener("click", () => {
  form.hidden = false;

  editTitle.value = state.title;
  editDesc.value = state.description;
  editPriority.value = state.priority;
  editDueDate.value = state.dueDate;

  editTitle.focus();
});

saveBtn.addEventListener("click", () => {
  state.title = editTitle.value;
  state.description = editDesc.value;
  state.priority = editPriority.value;
  state.dueDate = editDueDate.value;

  titleEl.textContent = state.title;
  descEl.textContent = state.description;
  dueDateEl.textContent = new Date(state.dueDate).toDateString();
  dueDateEl.setAttribute("datetime", state.dueDate);

  setPriorityUI(state.priority);

  form.hidden = true;
  editBtn.focus();
});

cancelBtn.addEventListener("click", () => {
  form.hidden = true;
  editBtn.focus();
});

deleteBtn.addEventListener("click", () => {
  alert("Delete button clicked");
});

function initCollapse() {
  if (descEl.textContent.length > 30) {
    descEl.hidden = true;
    expandBtn.style.display = "inline-block";
    expandBtn.setAttribute("aria-expanded", "false");
    expandBtn.textContent = "Expand";
  } else {
    descEl.hidden = false;
    expandBtn.style.display = "none";
  }
}

setPriorityUI(state.priority);
syncStatusUI(state.status);
initCollapse();
updateTime();

timer = setInterval(updateTime, 30000);