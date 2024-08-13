const modal = document.getElementById("modal-info");
const addButton = document.querySelector("#add-button");
const bookListContainer = document.getElementById("book-list");

const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const genreInput = document.querySelector("#genre");

const displayBookList = () => {
  fetch("http://localhost:3000/readingList")
    .then((response) => response.json())
    .then((books) => {
      // Clear any existing content in the container
      bookListContainer.innerHTML = "";

      books.forEach((book) => {
        // Create the unordered list container
        const bookItem = document.createElement("ul");
        bookItem.className = "list-group";

        // Create the list item and add the book details
        const listItem = document.createElement("li");
        listItem.className =
          "list-group-item d-flex justify-content-between align-items-center";
        listItem.innerText = `${book.booktitle} by ${book.author} (${book.genre})`;

        // Create the delete icon
        const deleteIcon = document.createElement("button");
        deleteIcon.className = "btn btn-danger btn-sm";
        deleteIcon.innerHTML = "&#x1F5D1;"; // Trash can icon using Unicode

        // Add click event listener to handle deletion
        deleteIcon.addEventListener("click", () => {
          // Confirm deletion
          if (confirm(`Are you sure you want to delete "${book.booktitle}"?`)) {
            // Perform the DELETE request
            fetch(`http://localhost:3000/readingList/${book.id}`, {
              method: "DELETE",
            })
              .then((response) => {
                if (response.ok) {
                  // Remove the book item from the UI
                  bookListContainer.removeChild(bookItem);
                  console.log(`Deleted book: ${book.booktitle}`);
                } else {
                  console.error(
                    "Failed to delete the book:",
                    response.statusText
                  );
                }
              })
              .catch((error) => {
                console.error("Error deleting the book:", error);
              });
          }
        });

        // Append the delete icon to the list item
        listItem.appendChild(deleteIcon);

        // Append the list item to the unordered list
        bookItem.appendChild(listItem);

        // Append the unordered list to the container
        bookListContainer.appendChild(bookItem);
      });
    })
    .catch((error) => {
      console.error("Error fetching the book list:", error);
    });
};

addButton.addEventListener("click", () => {
  if ([null, ""].includes(titleInput.value)) return;
  if ([null, ""].includes(authorInput.value)) return;
  if ([null, ""].includes(genreInput.value)) return;

  fetch("http://localhost:3000/readingList", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: titleInput.value,
      author: authorInput.value,
      genre: genreInput.value,
    }),
  })
    .then((response) => response)
    .then((data) => console.log(data));

  // Update and display the book list after a book is added
  displayBookList();
});

modal.addEventListener("show.bs.modal", displayBookList);
// const displayReadingList(){
//     list = document.createElement(`li`)
//     list.innerHTML= ""

// }
