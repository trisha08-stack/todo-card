const checkbox = document.querySelector('[data-testid="test-todo-complete-toggle"]');
const title = document.querySelector('[data-testid="test-todo-title"]');
const status = document.querySelector('[data-testid="test-todo-status"]');
const editBtn = document.querySelector('[data-testid="test-todo-edit-button"]');
const deleteBtn = document.querySelector('[data-testid="test-todo-delete-button"]');

checkbox.addEventListener("change", () => { 
  if (checkbox.checked) { 
    title.style.textDecoration = "line-through";
      status.textContent = "Done";
      status.style.background = "#51cf66";
      status.style.color = "#fff";
  } else {
    title.style.textDecoration = "none";
    status.textContent = "pending";
    status.style.background = "#ffe066";
    status.style.color = "#333";
  }
});

editBtn.addEventListener("click", () => {
  console.log("edit clicked");
  alert("Edit task clicked");
});

deleteBtn.addEventListener("click", () => {
  console.log("delete clicked");
  alert("Delete task clicked");
});

const timeRemaining = document.querySelector('[data-testid="test-todo-time-remaining"]');
const dueDate = new Date("2026-04-15T23:59:59");

function updateTime() {
  const now = new Date();
  const diff = dueDate - now;
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days > 1) {
    timeRemaining.textContent = `Due in ${days} days`;
  } else if (days === 1) {
    timeRemaining.textContent = "Due tomorrow";
    timeRemaining.style.color = "#ff6b6b";
  } else if (days === 0) {
    timeRemaining.textContent = "Due today";
    timeRemaining.style.color = "#fa5252";
  } else {
    timeRemaining.textContent = `Overdue by ${Math.abs(days)} days`;
    timeRemaing.style.color = "#c92a2a";
  }
}

updateTime();
setInterval(updateTime, 60000);
