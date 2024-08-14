document.addEventListener("DOMContentLoaded", () => {
  const authContainer = document.getElementById("auth-container");
  const appContainer = document.getElementById("app-container");
  const loginForm = document.getElementById("login");
  const registerForm = document.getElementById("register");
  const showRegisterLink = document.getElementById("show-register");
  const showLoginLink = document.getElementById("show-login");

  let currentUser = null;

  // Check if user is already logged in
  const storedUser = localStorage.getItem("currentUser");
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    showApp();
  }

  // Toggle between login and register forms
  showRegisterLink.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("login-form").style.display = "none";
    document.getElementById("register-form").style.display = "block";
  });

  showLoginLink.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("register-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
  });

  // Handle registration
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    try {
      const response = await fetch("http://localhost:3000/users");
      const users = await response.json();

      if (users.find((user) => user.email === email)) {
        alert("User already exists");
        return;
      }

      const newUser = { name, email, password };
      await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      alert("Registration successful. Please login.");
      registerForm.reset();
      showLoginLink.click();
    } catch (error) {
      console.error("Error registering user:", error);
    }
  });

  // Handle login
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
      const response = await fetch("http://localhost:3000/users");
      const users = await response.json();

      const user = users.find(
        (user) => user.email === email && user.password === password
      );

      if (user) {
        currentUser = user;
        localStorage.setItem("currentUser", JSON.stringify(user));
        showApp();
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  });

  function showApp() {
    authContainer.style.display = "none";
    appContainer.style.display = "block";
    initializeApp();
  }

  async function initializeApp() {
    const containers = {
      reading: document.getElementById("reading-container"),
      movie: document.getElementById("movie-container"),
      calendar: document.getElementById("calendar-container"),
      training: document.getElementById("training-container"),
      notes: document.getElementById("notes-container"),
      todo: document.getElementById("todo-container"),
    };

    const forms = {
      reading: document.getElementById("reading-form"),
      movie: document.getElementById("movie-form"),
      calendar: document.getElementById("calendar-form"),
      training: document.getElementById("training-form"),
      notes: document.getElementById("notes-form"),
      todo: document.getElementById("todo-form"),
    };

    const lists = {
      reading: document.getElementById("reading-list"),
      movie: document.getElementById("movie-list"),
      calendar: document.getElementById("calendar-list"),
      training: document.getElementById("training-list"),
      notes: document.getElementById("notes-list"),
      todo: document.getElementById("todo-list"),
    };

    try {
      const response = await fetch("http://localhost:3000/activities");
      const activities = await response.json();

      // Load user's data
      Object.keys(lists).forEach((key) => {
        const storedItems = activities[key] || [];
        storedItems.forEach((item) =>
          addItem(lists[key], item.text, item.completed)
        );
      });

      // Toggle container visibility
      Object.keys(containers).forEach((key) => {
        document
          .getElementById(`toggle-${key}`)
          .addEventListener("click", () => {
            Object.values(containers).forEach(
              (container) => (container.style.display = "none")
            );
            containers[key].style.display = "block";
          });
      });

      // Handle form submissions
      Object.keys(forms).forEach((key) => {
        forms[key].addEventListener("submit", (event) => {
          event.preventDefault();
          const inputs = forms[key].querySelectorAll("input, textarea");
          let itemText = "";
          inputs.forEach((input) => {
            if (input.type === "date") {
              itemText += input.value + ": ";
            } else {
              itemText += input.value;
            }
            input.value = "";
          });
          addItem(lists[key], itemText);
          saveItems(key);
        });
      });
    } catch (error) {
      console.error("Error initializing app:", error);
    }

    function addItem(list, itemText, completed = false) {
      const item = document.createElement("li");
      item.classList.add("list-item");
      if (completed) item.classList.add("completed");

      const textSpan = document.createElement("span");
      textSpan.textContent = itemText;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        item.remove();
        saveItems(list.id.replace("-list", ""));
      });

      item.appendChild(textSpan);
      item.appendChild(deleteButton);

      if (list.id !== "notes-list") {
        item.addEventListener("click", () => {
          item.classList.toggle("completed");
          saveItems(list.id.replace("-list", ""));
        });
      }

      list.appendChild(item);
    }

    async function saveItems(key) {
      const items = Array.from(lists[key].children).map((item) => ({
        text: item.querySelector("span").textContent,
        completed: item.classList.contains("completed"),
      }));

      try {
        await fetch(`http://localhost:3000/activities`, {
          method: "PATCH", // Using PATCH to update only the specific key
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ [key]: items }),
        });
      } catch (error) {
        console.error("Error saving items:", error);
      }
    }

    // Search functionality
    const searchInput = document.querySelector(".search");
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase();
      Object.values(lists).forEach((list) => {
        Array.from(list.children).forEach((item) => {
          const text = item.querySelector("span").textContent.toLowerCase();
          item.style.display = text.includes(searchTerm) ? "" : "none";
        });
      });
    });
  }
});
