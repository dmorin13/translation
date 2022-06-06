
var read = document.getElementsByClassName("message-read");
var deleteBtn = document.getElementsByClassName("message-delete");
var translateBtn = document.getElementsByClassName("message-translate");
var translationPane = document.getElementById("tMessage");

Array.from(read).forEach(function(element) {
      element.addEventListener('click', function(){
        const id = element.getAttribute("data-id");
        const isRead = true;
        
        fetch('messages', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'id': id,
            'isRead': isRead
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          window.location.reload(true)
        })
      });
});

Array.from(deleteBtn).forEach(function(element) {
      element.addEventListener('click', function(){
        const id = element.getAttribute("data-id");

        fetch('messages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'id': id,
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});

Array.from(translateBtn).forEach(function(element) {
  element.addEventListener('click', function(){
    const id = element.getAttribute("data-id");

    fetch(`translate?id=${id}&lang=es`)
      .then(response => response.json())
      .then((data) => {
        translationPane.innerHTML = data.translatedText;
      })
  });
});