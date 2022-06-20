var read = document.getElementsByClassName("message-read");
var deleteBtn = document.getElementsByClassName("message-delete");
var deleteCmtBtn =document.getElementsByClassName("comment-delete")
var translateBtn = document.getElementsByClassName("message-translate");
var translateBtnPT = document.getElementsByClassName("message-translate-PT");
var translateBtnHT =document.getElementsByClassName("message-translate-HT")
var translateBtnSO = document.getElementsByClassName("message-translate-SO")
var translationPane = document.getElementById("tMessage");
// var nameDisplay = document.getElementsByClassName("welcome");
// var nameInput =document.getElementsByClassName("nameDisplay");



var viewcommentBtn = document.getElementsByClassName("view-comment")
console.log(viewcommentBtn)

var commentBtn = document.getElementsByClassName("add-comment");
let message = document.getElementsByClassName("message-input");
let sbmtCommentBtn = document.getElementsByClassName("sbmtComment");


//create variables specific to the teacher profile button & input elements file  and create an array.from function

Array.from(read).forEach(function (element) {
  element.addEventListener("click", function () {
    const id = element.getAttribute("data-id");
    const isRead = true;

    fetch("messages", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
        isRead: isRead,
      }),
    })
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((data) => {
        window.location.reload(true);
      });
  });
});

Array.from(deleteBtn).forEach(function (element) {
  element.addEventListener("click", function () {
    const id = element.getAttribute("data-id");

    fetch("messages", {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      })
    }).then(function (response) {
      window.location.reload();
    });
  });
});

Array.from(deleteCmtBtn).forEach(function (element) {
  element.addEventListener("click", function () {
    const id = element.getAttribute("data-id");

    fetch("comments", {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      })
    }).then(function (response) {
      window.location.reload();
    });
  });
});

Array.from(translateBtn).forEach(function (element) {
  element.addEventListener("click", function () {
    const id = element.getAttribute("data-id");
    document.querySelector(".langValue").value = "Spanish"
    //call to the server
    //search params
    //string interpolation / template string 
    //URL: path -query params
    //endpoint 
    //sending data to the server along with the request 
    fetch(`translate?id=${id}&lang=es`)
      .then((response) => response.json())
      .then((data) => {
        translationPane.innerHTML = data.translatedText;
      });
  });
});

Array.from(translateBtnPT).forEach(function (element) {
  element.addEventListener("click", function () {
    const id = element.getAttribute("data-id");
    document.querySelector(".langValue").value = "Portuguese"
    //call to the server
    //search params
    //string interpolation / template string 
    //URL: path -query params
    //endpoint 
    //sending data to the server along with the request 
    fetch(`translatePT?id=${id}&lang=pt`)
      .then((response) => response.json())
      .then((data) => {
        translationPane.innerHTML = data.translatedText;
      });
  });
});

Array.from(translateBtnHT).forEach(function (element) {
  element.addEventListener("click", function () {
    const id = element.getAttribute("data-id");
    document.querySelector(".langValue").value = "Haitian Creole"
    //set the value of the input to 'haitian creole' ---> send info to server to trigger translation to English 
    
    
    //call to the server
    //search params
    //string interpolation / template string 
    //URL: path -query params
    //endpoint 
    //sending data to the server along with the request 
    fetch(`translateHT?id=${id}&lang=ht`)
      .then((response) => response.json())
      .then((data) => {
        translationPane.innerHTML = data.translatedText;
      });
  });
});

Array.from(translateBtnSO).forEach(function (element) {
  element.addEventListener("click", function () {
    const id = element.getAttribute("data-id");
    document.querySelector(".langValue").value = "Somali"
    //call to the server
    //search params
    //string interpolation / template string 
    //URL: path -query params
    //endpoint 
    //sending data to the server along with the request 
    fetch(`translateSO?id=${id}&lang=so`)
      .then((response) => response.json())
      .then((data) => {
        translationPane.innerHTML = data.translatedText;
      });
  });
});



function displayUserName(){
var nameDisplay = document.getElementsByClassName("welcome");
var nameInput =document.getElementsByClassName("nameDisplay");
  'Welcome' + (nameDisplay.innterText = nameInput.value) 
}

// function to update the value of the input element so the form sends the correct data to the server
//add a query selector for all of the language button event listerners and have them update the correct input value on the form 

// use the value of the input to determine the languge to 'plug' in to the tranlation API call and translate to English


//spanish 
// translateBtn

// translateBtnSO

// translateBtnHT

// translateBtnPT




// function popUp() {
//   var comment = document.getElementsByClassName("pop-up");
//   comment.classList.toggle("hide")
//   comment.classList.toggle("show");
// // }
// //displays comment form in DOM
// Array.from(commentBtn).forEach(function(element) {
//   element.addEventListener('click', function(){
//     // let message = document.getElementsByClassName("message-input");
//     // message.classList.toggle("show")
//     Array.from(message).forEach(function(element) {
//       // element.classList.toggle("hide-comment");
//     // let message = document.getElementsByClassName("message-input");
//     element.classList.toggle("hide-comment")
//       // message.classList.toggle("hide");
//       Array.from(sbmtCommentBtn).forEach(function(element){
//         //display comment in the DOM/createElement
//         //dynamically target the comments._id & messages.msg ( comment string )
//       let inputValue=document.getElementsByClassName('input-box').value
//        let li= document.createElement("li")
//        li.innerText=inputValue
//        //use data Id's?
//         //form is already 'submitting' comment string to to DB

//       })
//       });
//     });
//   });

//   Array.from(message).forEach(function(element) {
//     element.addEventListener('click', function(event){
//     // let message = document.getElementsByClassName("message-input");
//     // let hideComment = document.getElementsByClassName("hide-comment");
//     console.log(message.classList)
//    message.classList.toggle("hide-comment")
//   })
// })

Array.from(commentBtn).forEach(function (element) {
  element.addEventListener("click", function (event) {
    const targetButton = event.target;
    targetButton.parentElement
      .querySelector(".p-comments")
      .classList.toggle("hide-comment");
      // debugger
  });
});

Array.from(viewcommentBtn).forEach(function (element) {
  element.addEventListener("click", function (event) {
    const targetButton = event.target;
    targetButton.parentElement
      .querySelector(".p-comments")
      .classList.toggle("hide-comment");
      // debugger
  });
});

//input validation 
 Array.from(sbmtCommentBtn).forEach(function(el){
   el.addEventListener("click", (e)=> {
     e.preventDefault()
     let langPrefValue = document.querySelector(".langValue").value
     if(langPrefValue ==''){
       //alert user of ERROR 500 
     }else{
      fetch("/comments", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "user_id":e.target.parentElement.querySelector("input[name='user_id']").value,
          "name": e.target.parentElement.querySelector("input[name='name']").value,
          "msg" : e.target.parentElement.querySelector("input[name='msg']").value,
          "announcementId" : e.target.parentElement.querySelector("input[name='announcementId']").value,
          "langPref" : e.target.parentElement.querySelector("input[name='langPref']").value
        }),

       }).then(function(){
        window.location.reload();
      })
     }
   })
 })

// create a function to alert user of ERROR if no langPref is chosen 
