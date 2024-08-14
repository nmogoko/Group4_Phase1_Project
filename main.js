document.addEventListener("DOMContentLoaded", () => {
  const todoForm = document.getElementById("todo-form");
  const newTaskInput = document.getElementById("new-task");
  const todoList = document.getElementById("todo-list");
  const todoContainer = document.getElementById("todo-container");
  const toggleTodo = document.getElementById("toggle-todo");

  // Toggle the to-do list visibility
  toggleTodo.addEventListener("click", function () {
    if (
      todoContainer.style.display === "none" ||
      todoContainer.style.display === ""
    ) {
      todoContainer.style.display = "block";
    } else {
      todoContainer.style.display = "none";
    }
  });

  // Handle form submission
  todoForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTask(newTaskInput.value);
    newTaskInput.value = ""; // Clear the input field
  });

  // Function to add a new task to the list
  function addTask(taskText) {
    const todoItem = document.createElement("li");
    todoItem.classList.add("todo-item");

    const taskSpan = document.createElement("span");
    taskSpan.textContent = taskText;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function () {
      todoItem.remove();
    });

    todoItem.appendChild(taskSpan);
    todoItem.appendChild(deleteButton);

    // Toggle the 'completed' class on task click
    todoItem.addEventListener("click", function () {
      todoItem.classList.toggle("completed");
    });

    todoList.appendChild(todoItem);
  }
});
