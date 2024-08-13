function registerUser(username, password) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const existingUser = users.find((user) => user.username === username);
  
    if (existingUser) {
      alert("Username already exists");
      return;
    }
  
    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("User registered successfully");
  }
  
  function loginUser(username, password) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (user) => user.username === username && user.password === password
    );
  
    if (!user) {
      alert("Invalid username or password");
      return;
    }
  
    sessionStorage.setItem("loggedInUser", username);
    alert("Login successful");
    window.location.href = "index.html";
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const authForm = document.getElementById("auth-form");
    const toggleLink = document.getElementById("toggle-link");
  
    authForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
  
      if (authForm.dataset.mode === "login") {
        loginUser(username, password);
      } else {
        registerUser(username, password);
      }
    });
  
    toggleLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (authForm.dataset.mode === "login") {
        authForm.dataset.mode = "register";
        document.getElementById("auth-title").textContent = "Register";
        document.getElementById("auth-btn").textContent = "Register";
        toggleLink.textContent = "Already have an account? Login here";
      } else {
        authForm.dataset.mode = "login";
        document.getElementById("auth-title").textContent = "Login";
        document.getElementById("auth-btn").textContent = "Login";
        toggleLink.textContent = "Don't have an account? Register here";
      }
    });
  });