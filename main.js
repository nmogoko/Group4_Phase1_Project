document.addEventListener("DOMContentLoaded", () => {
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      window.location.href = "login.html";
    }
  
    // Add event listeners for your productivity app features here
    document.querySelectorAll(".item").forEach((item) => {
      item.addEventListener("click", () => {
        alert(`You clicked on ${item.textContent.trim()}`);
        // Implement the functionality for each item
      });
    });
  
    // Implement search functionality
    const searchInput = document.querySelector(".search");
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase();
      document.querySelectorAll(".item").forEach((item) => {
        const itemText = item.textContent.toLowerCase();
        item.style.display = itemText.includes(searchTerm) ? "block" : "none";
      });
    });
  
    // Implement logout functionality
    const logoutIcon = document.querySelector(".footer-icon:last-child");
    logoutIcon.addEventListener("click", () => {
      sessionStorage.removeItem("loggedInUser");
      window.location.href = "login.html";
    });
  });