const modal = document.getElementById("modal-info");
const addButton = document.querySelector("#add-button");

const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const genreInput = document.querySelector("#genre");

const displayBookList = () => {
  fetch("http://localhost:3000/readingList")
    .then((response) => response.json())
    .then((books) => {
      bookListContainer.innerHTML = ""; // Clear the previous list
      books.forEach((book) => {
        const bookItem = document.createElement("div");
        bookItem.className = "book-item mb-2";
        bookItem.textContent = `${book.title} by ${book.author} (${book.genre})`;
        bookListContainer.appendChild(bookItem);
      });
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
