const readingList = document.getElementById("reading-list");
const readingButton = document.getElementById("rl");
const modal = document.getElementById("modal-info");
const saveButton = document.getElementById("save-button");
const closeButton = document.getElementById("close-button");
const close = document.getElementsByClassName("btn-close");

function closeModal (){
    modal.style.display = "none";
}

closeButton.addEventListener("click", closeModal);
// closeButton.addEventListener("click", ()=>{
//     this.style.display = "none";
// <Why will this not work? })

for (let i = 0; i < close.length; i++) {
    close[i].addEventListener("click", closeModal);
  }


readingButton.addEventListener("click", ()=>{
    modal.style.display = "block";
});
