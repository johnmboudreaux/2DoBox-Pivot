$(document).ready(function() {

  function CardElements(title, body, importance = 2) {
    this.title = title;
    this.body = body;
    this.id = Date.now();
    this.importance = importance;
  }

  $('.save-btn').on('click', saveButton);
  $('.title-input').keyup(enableSaveButton);
  $('.task-input').keyup(enableSaveButton);
  $('.todo-card-parent').on('click', '#delete', deleteCard);
  $('.todo-card-parent').on('click', '#downvote', changeImportance);
  $('.todo-card-parent').on('click', '#upvote', changeImportance);
  $('.todo-card-parent').on('blur', 'h2', editCardText);
  $('.todo-card-parent').on('keyup', 'h2', blurEdit);
  $('.todo-card-parent').on('blur', '.body-text', editCardText);
  $('.todo-card-parent').on('keyup', '.body-text', blurEdit);
  $('.search-input').on('keyup', searchCards);
  // $('.importance-button0').on('click', filterImportance);
  // $('.importance-button1').on('click', filterImportance);
  // $('.importance-button2').on('click', filterImportance);
  // $('.importance-button3').on('click', filterImportance);
  // $('.importance-button4').on('click', filterImportance);

  retrieveLocalStorage();

  function saveButton(e) {
    e.preventDefault();
    fireCards();
    toggledButtonDisabledness()
  }

  function enableSaveButton() {
    if (($('.title-input').val() !== "") && ($('.task-input').val() !== "")) {
      // $('.save-btn').removeAttr('disabled');
      toggledButtonDisabledness()
    }
  }

  function toggledButtonDisabledness(){
    var checkForValues = ($('.title-input').val() !== "") || ($('.task-input').val() !== "")
    console.log(checkForValues);
    $('.save-btn').attr('disabled', !checkForValues);
  }

  function deleteCard() {
    var currentCardId = $(this).closest('.todo-card')[0].id;
    var cardArray = retrieveCards();
    cardArray.forEach(function(card, index) {
      if (currentCardId == card.id) {
        cardArray.splice(index, 1);
      }
    });
    storeCards(cardArray);
    $(this).parents('.todo-card').remove();
  }

  function changeImportance(e) {
    e.preventDefault();
    var importanceArray = ['none', 'low', 'normal', 'high', 'critical'];
    var cardId = $(this).closest('.todo-card')[0].id;
    var cardArray = retrieveCards();
    cardArray.forEach(function(card) {
      if ($(event.target).hasClass('upvote-btn') && card.id == cardId && card.importance < 4) {
        card.importance++;
        $('.' + cardId).text(importanceArray[card.importance]);
        storeCards(cardArray);
      } else if ($(event.target).hasClass('downvote-btn') && card.id == cardId && card.importance > 0) {
        card.importance--;
        $('.' + cardId).text(importanceArray[card.importance]);
        storeCards(cardArray);
      }
    });
  }

  function editCardText(e) {
    var id = $(this).closest('.todo-card')[0].id;
    var text = $(this).text();
    var cardArray = retrieveCards();
    cardArray.forEach(function(card) {
      if (card.id == id && $(e.target).hasClass('title-text')) {
        card.title = text;
      } else if (card.id == id && $(e.target).hasClass('body-text')) {
        card.body = text;
      }
    });
    storeCards(cardArray);
  }



  // function filterImportance() {
  //   console.log($(this));
  //   var importanceArray = ['none', 'low', 'normal', 'high', 'critical'];
  //   var cardArray = retrieveCards();
  //   console.log(cardArray);
  //   console.log(event.target);
  //   //go through array by index and find cards that match index of importance
  //   var results = cardArray.filter(function(elementcard) {
  //     console.log(elementcard);
  //     console.log(elementcard.importance);
  //     console.log(importanceArray);
  //      if (elementcard.importance == importanceArray[0]) {
  //        console.log('working');
  //        return elementcard;
  //     }
  // });
  // }

  function blurEdit(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.blur();
    }
  }

  function searchCards() {
    var search = $(this).val().toUpperCase();
    var cardArray = retrieveCards();
    var results = cardArray.filter(function(elementCard) {
      return elementCard.title.toUpperCase().includes(search);
    });
    $('.todo-card-parent').empty();
    for (var i = 0; i < results.length; i++) {
      addCards(results[i]);
    }
  }

  function articleTemplate(todo, importanceArray) {
    return (
      `<article class="todo-card" id="${todo.id}">
         <h2 class="title-text" contenteditable="true" maxlength="20">${todo.title}</h2>
         <div class="delete-btn" id="delete">
         </div>
         <p class="body-text" contenteditable="true" maxlength="120">${todo.body}</p>
         <div class="ratings">
        <div class="upvote-btn" id="upvote"></div>
      <div class="downvote-btn" id="downvote"></div>
        <p class="importance">importance: <span class="${todo.id}">${importanceArray[todo.importance]}</span></p>
      </div>
      <hr>
    </article>`
    )
  }

  function prependStuff(target, content) {
    target.prepend(content)
  }

  function addCards(buildCard) {
    var importanceArray = ['none', 'low', 'normal', 'high', 'critical'];
    var todoHTML = articleTemplate(buildCard, importanceArray)
    var target = $('.todo-card-parent')
    prependStuff(target, todoHTML)
  }

  function fireCards() {
    var newCard = new CardElements($('.title-input').val(), $('.task-input').val());
    cardArray = retrieveCards();
    cardArray.push(newCard);
    addCards(newCard);
    storeCards(cardArray);
    clearInputs();
  }

  function storeCards(cardArray) {
    localStorage.setItem('array', JSON.stringify(cardArray));
  }

  function retrieveCards() {
    var cardArray = JSON.parse(localStorage.getItem('array')) || [];
    return cardArray;
  }

  function clearInputs() {
    $('.title-input').val('');
    $('.task-input').val('');
    $('.title-input').focus();
  }

  function retrieveLocalStorage() {
    var cardArray = JSON.parse(localStorage.getItem('array')) || [];
    cardArray.forEach(function(card) {
      addCards(card);
    });
  }





});
