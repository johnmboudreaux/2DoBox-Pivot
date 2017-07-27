$(document).ready(function() {

  function CardElements(title, body, importance = 2) {
    this.title = title;
    this.body = body;
    this.id = Date.now();
    this.importance = importance;
  }

  function eventListeners() {
    $('.save-btn').on('click', saveButton);
    $('.title-input').keyup(enableSaveButton);
    $('.body-input').keyup(enableSaveButton);
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

  }

  retrieveLocalStorage();
  eventListeners();

  function saveButton(event) {
    event.preventDefault();
    fireCards();
    $('.save-btn').attr('disabled', 'disabled');
  }

  function enableSaveButton() {
    if (($('.title-input').val() !== "") || ($('.body-input').val() !== "")) {
      $('.save-btn').removeAttr('disabled');
    }
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
    console.log($(this));
    var cardId = $(this).closest('.todo-card')[0].id;
    var cardArray = retrieveCards();
    console.log(cardArray);
    cardArray.forEach(function(card) {
      if ($(event.target).hasClass('upvote-btn') && card.id == cardId && card.importance < 4) {
        card.importance++;
        console.log(card.importance);
      } else if ($(event.target).hasClass('downvote-btn') && card.id == cardId && card.importance > 0) {
        card.importance--;
      }
      console.log(card.importance);
      console.log(importanceArray);
      console.log($('.' + cardId).text);
      $('.' + cardId).text(importanceArray[card.importance]);
      storeCards(cardArray);
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
  //
  //   // go through array by index and find cards that match index of importance
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
      return elementCard.title.toUpperCase().includes(search) ||
        elementCard.body.toUpperCase().includes(search) ||
        elementCard.importance.toUpperCase().includes(search);
    });
    $('.todo-card-parent').empty();
    for (var i = 0; i < results.length; i++) {
      addCards(results[i]);
    }
  }

  function addCards(buildCard) {
    var importanceArray = ['none', 'low', 'normal', 'high', 'critical'];
    console.log(buildCard);
    console.log(buildCard.importance);
    $('.todo-card-parent').prepend(
      `<article class="todo-card" id="${buildCard.id}">
      <h2 class="title-text" contenteditable="true">${buildCard.title}</h2>
      <div class="delete-btn" id="delete">
      </div>
      <p class="body-text" contenteditable="true">${buildCard.body}</p>
      <div class="ratings">
      <div class="upvote-btn" id="upvote"></div>
      <div class="downvote-btn" id="downvote"></div>
        <p class="importance">importance: <span class="${buildCard.id}">${importanceArray[buildCard.importance]}</span></p>
      </div>
      <p class="clear">Completed</p>
      <hr>
    </article>`);
  }

  function fireCards() {
    var newCard = new CardElements($('.title-input').val(), $('.body-input').val());
    cardArray = retrieveCards();
    cardArray.push(newCard);
    addCards(newCard);
    storeCards(cardArray);
    clearInputs();
  }

  function storeCards(cardArray) {
    console.log(cardArray);
    localStorage.setItem('array', JSON.stringify(cardArray));
    clearInputs();
  }

  function retrieveCards() {
    var cardArray = JSON.parse(localStorage.getItem('array')) || [];
    return cardArray;
  }

  function clearInputs() {
    $('.title-input').val('');
    $('.body-input').val('');
    $('.title-input').focus();
  }

  function retrieveLocalStorage() {
    var cardArray = JSON.parse(localStorage.getItem('array')) || [];
    cardArray.forEach(function(card) {
      addCards(card);
    });
  }





});
