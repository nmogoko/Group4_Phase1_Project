const readingContainer = document.getElementById("reading-container");
const modal = document.getElementById("modal-info");
const saveButton = document.getElementById("save-button");
const closeButton = document.getElementById("close-button");
const addButton = document.getElementById("add-button")

function closeModal (){
    modal.style.display = "none";
}

function displayModal (){
    modal.style.display = "block"
}

closeButton.addEventListener("click", closeModal);

// closeButton.addEventListener("click", ()=>{
//     this.style.display = "none";
// <Why will this not work? })


readingContainer.addEventListener("click", displayModal);


// function saveChanges(){
//     fetch(`http://localhost:3000/readingList`, {
//         method: "POST",
//         body: JSON.stringify({readingList }),
//         headers: myHeaders,
//     })
//     .then(res=>res.json())
//     .then(res =>)
// }
