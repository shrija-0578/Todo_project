// ===== Simple To-Do List App - Plain JavaScript =====
// This version is written using very basic JavaScript
// (for loops, if statements, simple functions) so it's
// easy to read and explain.

// ---- Step 1: Grab the HTML elements we need ----
var taskInput = document.getElementById("taskInput");
var addBtn = document.getElementById("addBtn");
var taskList = document.getElementById("taskList");
var emptyMessage = document.getElementById("emptyMessage");
var remainingCountEl = document.getElementById("remainingCount");

// ---- Step 2: Our data ----
// tasks is just a list (array) of objects.
// Each task looks like: { text: "Buy milk", completed: false }
var tasks = [];

// ---- Step 3: Function to add a new task ----
function addTask() {
  var taskText = taskInput.value;

  // remove extra spaces from the start/end
  taskText = taskText.trim();

  // don't add empty tasks
  if (taskText === "") {
    return;
  }

  // create a new task object
  var newTask = {
    text: taskText,
    completed: false
  };

  // add it to our list
  tasks.push(newTask);

  // clear the input box
  taskInput.value = "";

  // update the screen
  showTasks();
}

// ---- Step 4: Function to mark a task done/not done ----
function toggleTask(taskIndex) {
  if (tasks[taskIndex].completed === true) {
    tasks[taskIndex].completed = false;
  } else {
    tasks[taskIndex].completed = true;
  }
  showTasks();
}

// ---- Step 5: Function to delete a task ----
function deleteTask(taskIndex) {
  tasks.splice(taskIndex, 1); // remove 1 item at that position
  showTasks();
}

// ---- Step 6: Function that draws everything on the screen ----
function showTasks() {
  // clear the current list on screen
  taskList.innerHTML = "";

  var howManyLeft = 0;

  // go through every task one by one
  for (var i = 0; i < tasks.length; i++) {
    var task = tasks[i];

    // count how many tasks are still not completed
    if (task.completed === false) {
      howManyLeft = howManyLeft + 1;
    }

    // build one task row (li element)
    var li = document.createElement("li");
    li.className = "task-item";

    // checkbox
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("data-index", i);
    checkbox.onclick = function () {
      var index = this.getAttribute("data-index");
      toggleTask(Number(index));
    };

    // task text
    var span = document.createElement("span");
    span.className = "task-text";
    if (task.completed === true) {
      span.className = "task-text completed";
    }
    span.textContent = task.text;

    // delete button
    var delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.textContent = "Delete";
    delBtn.setAttribute("data-index", i);
    delBtn.onclick = function () {
      var index = this.getAttribute("data-index");
      deleteTask(Number(index));
    };

    // put it all together
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  }

  // show or hide the "no tasks" message
  if (tasks.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }

  // update the "tasks remaining" counter
  remainingCountEl.textContent = howManyLeft;
}

// ---- Step 7: Connect button and key press to our functions ----
addBtn.onclick = function () {
  addTask();
};

taskInput.onkeydown = function (event) {
  if (event.key === "Enter") {
    addTask();
  }
};

// ---- Step 8: Show the (empty) list when the page first loads ----
showTasks();