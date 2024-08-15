function movielist (){
    fetch ("movie-list.html")
    .then(response =>response.text())
    .then(data => {
      document.getElementById("overlaycontent").innerHTML=data;
      document.getElementByI("overlay").style.display="flex"
    })
}
