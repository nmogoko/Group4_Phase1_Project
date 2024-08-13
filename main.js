const modal = document.getElementById("modal-info");
const addButton = document.querySelector("#add-button");

const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const genreInput = document.querySelector("#genre");

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
});

// const displayReadingList(){
//     list = document.createElement(`li`)
//     list.innerHTML= ""


// }
