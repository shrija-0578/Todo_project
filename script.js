// ===== Simple To-Do List App built with plain HTML, CSS & JavaScript =====

// ---- Grab elements from the page ----
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const remainingCountEl = document.getElementById("remainingCount");
const filterButtons = document.querySelectorAll(".filter-btn");

// ---- App state ----
// Load any previously saved tasks from localStorage (so tasks survive a refresh)
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all"; // "all" | "active" | "completed"

// ---- Save tasks to localStorage ----
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ---- Add a new task ----
function addTask() {
  const text = taskInput.value.trim();
  if (text === "") return; // ignore empty input

  tasks.push({
    id: Date.now(), // simple unique id
    text: text,
    completed: false,
  });

  taskInput.value = "";
  saveTasks();
  render();
}

// ---- Toggle a task between done / not done ----
function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  render();
}

// ---- Delete a task ----
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  render();
}

// ---- Change the active filter ----
function setFilter(filter) {
  currentFilter = filter;

  filterButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === filter);
  });

  render();
}

// ---- Build the visible task list based on the current filter ----
function getVisibleTasks() {
  if (currentFilter === "active") return tasks.filter((t) => !t.completed);
  if (currentFilter === "completed") return tasks.filter((t) => t.completed);
  return tasks; // "all"
}

// ---- Render everything to the page ----
function render() {
  const visibleTasks = getVisibleTasks();

  // Clear current list
  taskList.innerHTML = "";

  // Show/hide empty message
  emptyMessage.style.display = visibleTasks.length === 0 ? "block" : "none";

  // Build each task row
  visibleTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";

    li.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""} />
      <span class="task-text ${task.completed ? "completed" : ""}">${escapeHTML(task.text)}</span>
      <button class="delete-btn">Delete</button>
    `;

    // Checkbox toggles completion
    li.querySelector("input[type='checkbox']").addEventListener("change", () => {
      toggleTask(task.id);
    });

    // Delete button removes the task
    li.querySelector(".delete-btn").addEventListener("click", () => {
      deleteTask(task.id);
    });

    taskList.appendChild(li);
  });

  // Update remaining task count
  const remaining = tasks.filter((t) => !t.completed).length;
  remainingCountEl.textContent = remaining;
}

// ---- Small helper to avoid breaking HTML if a task contains special characters ----
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---- Event listeners ----
addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => setFilter(btn.dataset.filter));
});

// ---- Initial render on page load ----
render();
