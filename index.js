const card = document.querySelector('[data-testid="test-todo-card"]');
const checkbox = document.querySelector('[data-testid="test-todo-complete-toggle"]');
const titleEl = document.querySelector('[data-testid="test-todo-title"]');
const status = document.querySelector('[data-testid="test-todo-status"]');
const statusControl = document.querySelector('[data-testid="test-todo-status-control"]');

const editBtn = document.querySelector('[data-testid="test-todo-edit-button"]');
const deleteBtn = document.querySelector('[data-testid="test-todo-delete-button"]');

const expandBtn = document.querySelector('[data-testid="test-todo-expand-toggle"]');
const collapsible = document.querySelector('[data-testid="test-todo-collapsible-section"]');

const form = document.querySelector('[data-testid="test-todo-edit-form"]');
const saveBtn = document.querySelector('[data-testid="test-todo-save-button"]');
const cancelBtn = document.querySelector('[data-testid="test-todo-cancel-button"]');

const editTitle = document.querySelector('[data-testid="test-todo-edit-title-input"]');
const editDesc = document.querySelector('[data-testid="test-todo-edit-description-input"]');
const editPriority = document.querySelector('[data-testid="test-todo-edit-priority-select"]');
const editDue = document.querySelector('[data-testid="test-todo-edit-due-date-input"]');

const priorityEl = document.querySelector('[data-testid="test-todo-priority"]');
const indicator = document.querySelector('[data-testid="test-todo-priority-indicator"]');
const timeText = document.querySelector('[data-testid="test-todo-time-remaining"]');
const overDue = document.querySelector('[data-testid="test-todo-overdue-indicator"]');
const dueDateEl = document.querySelector('[data-testid="test-todo-due-date"]');

const COLLAPSE_THRESHOLD = 30;

let state = {
  status: "Pending",
  due: new Date("2026-04-15"),
  title: titleEl.textContent.trim(),
  desc: collapsible.textContent.trim(),
  priority: priorityEl.textContent.trim()
};

let snapshot = { ...state };
let timer;

function setPriorityUI(value) {
  indicator.style.background = 
    value === "High" ? "#ff6b6b" :
    value === "Medium" ? "#ffd43b" :
    "#51cf66";
}

function syncCollapseState() {
  const isLong = state.desc.trim().length >
    COLLAPSE_THRESHOLD;

  if (!isLong) {
    collapsible.hidden = false;
    expandBtn.style.display = "none";
    expandBtn.setAttribute("aria-expanded", "true");
    expandBtn.textContent = "Collapse";
    return;
  }
  
 expandBtn.style.display = "";

  const isExpanded = expandBtn.getAttribute("aria-expanded") === "true";

  collapsible.hidden = !isExpanded;
  expandBtn.textContent = isExpanded ? "Collapse" : "Expand";
}

expandBtn.addEventListener("click", () => {
  const isExpanded = expandBtn.getAttribute("aria-expanded") === "true";
  expandBtn.setAttribute("aria-expanded", String(!isExpanded));
  syncCollapseState();
});


checkbox.addEventListener("change", () => { 
 syncStatus(checkbox.checked ? "done" : "pending");
});

statusControl.addEventListener("change", () => {
  syncStatus(e.target.value);
});

editBtn.addEventListener("click", () => {
  snapshot = { ...state };
  editTitle.value = state.title;
  editDesc.value = state.desc;
  editPriority.value = status.priority;

  const d = state.due;
  editDue.value = `${d.getFullYear()}-${string(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  form.hidden = false;
  editTitle.focus();
});

saveBtn.addEventListener("click", () => {
  state.title = editTitle.value.trim() || state.title;
  state.desc = editDesc.value.trim() || state.desc;
  state.priority = editPriority.value;

  if (editdue.value) {
    state.due = new Date(editDue.value + "T00:00:00");
    dueDateEl.setAttribute("datetime", editDue.value);
    dueDateEl.textContent = state.due.toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric"
    });
  }

  titleEl.textContent = state.title;
  collapsible.textContent = state.desc;
  priorityEl.textContent = state.priority;

  setPriorityUI(state.priority);

  expandBtn.setAttribute("aria-expanded", "false");
  syncCollapseState();

  clearInterval(timer);
  if (state.status !== "Done") {
    updateTime();
    timer = serInterval(updateTime, 30000);
  }

  form.hidden = true;
  editBtn.focus();
});

cancelBtn.addEventListener("click", () => {
  state = { ...snapshot };
  form.hidden = true;
  editBtn.focus();
});

deleteBtn.addEventListener("click", () => {
  console.log("delete clicked");
  alert("Delete task clicked");
});

function FormatTime(diff) {
  const mins = Math.floor(diff / 6000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `Due in ${days} day${days > 1 ? "s" : ""}`;
  if (hours > 0) return `Due in ${hours} hours${hours > 1 ? "s" : ""}`;
  if (mins > 0) return `Due in ${mins} minutes${mins !== 1 ? "s" : ""}`;
  return "Due very soon";
}

function updateTime() {
  if (state.status === "done") {
    timeText.textContent = "completed";
    overdueEl.textContent = "";
    card.classList.remove("overdue");
    clearInterval(timer);
    return;
  } 

const diff = state,due - new Date();

if (diff < 0) {
  const hours = Math.abs(Math.floor(diff / 3600000));
  overdueEl.textContent = "\u26A0";
  timeText.textContent = `Overdue by ${hours} hours${hours !== 1 ? "s" : ""}`;
  card.classList.add("overdue");
  } else {
  overdueEl.textContent = "";
  timeText.textContent = formatTime(diff);
  card.classList.remove("overdue");
   }
  }

function syncStatus(value) {
  state.status = value;
  status.textContent = value;
  statusControl.value = value;
  checkbox.checked = value === "done";

  card.classList.toggle("done", value === "done");
  card.classList.toggle("in-progress", value === "in Progress");

clearInterval(timer);

if (value === "done") {
  timeText.textContent = "completed";
  overdueEl.textContent = "";
  card.classList.remove("overdue");
} else { 
  updateTime();
  timer = setInterval(updateTime, 30000);
}
 }

setPriorityUI(state.priority);
expandBtn.serAttribute("aria-expanded", "false");
syncCollapseState();
updateTime();
timer = setInterval(updateTime, 30000);
