$(document).ready(function() {

  function CardElements(title, body, importance = 2) {
    this.title = title;
    this.body = body;
    this.id = Date.now();
    this.importance = importance;
  }

  function eventListeners() {
    //refactor variables
    var $cardList = $('.todo-card-parent');
    var $saveBtn = $('.save-btn');
    var $titleInput = $('.title-input');
    var $bodyInput = $('.body-input');
    var $toDoParent = $('.todo-card-parent');
    var $searchInput = $('.search-input');
    $saveBtn.on('click', saveButton);
    $titleInput.keyup(enableSaveButton);
    $bodyInput.keyup(enableSaveButton);
    $toDoParent.on('click', '#delete', deleteCard);
    $toDoParent.on('click', '#downvote', changeImportance);
    $toDoParent.on('click', '#upvote', changeImportance);
    $cardList.on('blur', 'h2', editCardText);
    $cardList.on('keyup', 'h2', blurEdit);
    $cardList.on('blur', '.body-text', editCardText);
    $cardList.on('keyup', '.body-text', blurEdit);
    $searchInput.on('keyup', searchCards);
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

  function changeImportance(event) {
    event.preventDefault();
    var importanceArray = ['none', 'low', 'normal', 'high', 'critical'];
    var cardId = $(this).closest('.todo-card')[0].id;
    var cardArray = retrieveCards();
    cardArray.forEach(function(card) {
      if ($(event.target).hasClass('upvote-btn') && card.id == cardId && card.importance < 4) {
        card.importance++;
      } else if ($(event.target).hasClass('downvote-btn') && card.id == cardId && card.importance > 0) {
        card.importance--;
      }
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
        elementCard.quality.toUpperCase().includes(search);
    });
    $('.todo-card-parent').empty();
    for (var i = 0; i < results.length; i++) {
      addCards(results[i]);
    }
  }

  function addCards(buildCard) {
    var importanceArray = ['none', 'low', 'normal', 'high', 'critical'];
    $('.todo-card-parent').prepend(
      `<article class="todo-card" id="${buildCard.id}">
      <h2 class="title-text" contenteditable="true">${buildCard.title}</h2>
      <div class="delete-btn" id="delete">
      </div>
      <p class="body-text" contenteditable="true">${buildCard.body}</p>
      <div class="ratings">
      <div class="upvote-btn" id="upvote"></div>
      <div class="downvote-btn" id="downvote"></div>
        <p class="quality">quality: <span class="${buildCard.id}">${importanceArray[buildCard.importance]}</span></p>
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
    localStorage.setItem('array', JSON.stringify(cardArray));
    clearInputs();
  }

  function retrieveCards() {
    console.log(localStorage.getItem('array'));
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
