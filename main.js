document.addEventListener("DOMContentLoaded", function () {
  const homePage = document.getElementById("homePage");
  const quickNotesPage = document.getElementById("quickNotesPage");
  const quickNotesItem = document.getElementById("quickNotes");
  const backToHomeButton = document.getElementById("backToHome");
  const addNoteButton = document.getElementById("add-note");
  const noteInput = document.getElementById("note-input");
  const notesList = document.getElementById("notes-list");

  // Navigate to Quick Notes page
  if (quickNotesItem) {
    quickNotesItem.addEventListener("click", function () {
      window.location.href = "quicknotes.html";
    });
  }

  // Navigate back to Home page
  if (backToHomeButton) {
    backToHomeButton.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "index.html";
    });
  }

  if (addNoteButton && noteInput && notesList) {
    addNoteButton.addEventListener("click", function () {
      const noteText = noteInput.value.trim();
      if (noteText) {
        const li = document.createElement("li");
        li.classList.add("note-item");

        // Create and append a span for the note text
        const noteTextElement = document.createElement("span");
        noteTextElement.classList.add("note-text");
        noteTextElement.textContent = noteText;

        // Create and append an edit input field
        const editInput = document.createElement("input");
        editInput.classList.add("edit-input");
        editInput.type = "text";
        editInput.value = noteText;
        editInput.style.display = "none"; // Initially hidden

        // Create and style Edit button
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit-button");
        editButton.style.backgroundColor = "#4CAF50"; // Green background
        editButton.style.color = "white";
        editButton.style.border = "none";
        editButton.style.padding = "5px 10px";
        editButton.style.margin = "5px";
        editButton.style.borderRadius = "5px";
        editButton.style.cursor = "pointer";

        // Create and style Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");
        deleteButton.style.backgroundColor = "#f44336"; // Red background
        deleteButton.style.color = "white";
        deleteButton.style.border = "none";
        deleteButton.style.padding = "5px 10px";
        deleteButton.style.margin = "5px";
        deleteButton.style.borderRadius = "5px";
        deleteButton.style.cursor = "pointer";

        // Append elements to list item
        li.appendChild(noteTextElement);
        li.appendChild(editInput);
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        // Append list item to notes list
        notesList.appendChild(li);
        noteInput.value = "";

        // Edit note functionality
        editButton.addEventListener("click", function () {
          if (editInput.style.display === "none") {
            editInput.style.display = "inline";
            editButton.textContent = "Save";
            noteTextElement.style.display = "none";
          } else {
            const newNoteText = editInput.value.trim();
            if (newNoteText) {
              noteTextElement.textContent = newNoteText;
              editInput.style.display = "none";
              noteTextElement.style.display = "inline";
              editButton.textContent = "Edit";
            }
          }
        });

        // Delete note functionality
        deleteButton.addEventListener("click", function () {
          notesList.removeChild(li);
        });
      }
    });
  }
});
