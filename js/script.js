$(document).ready(function() {

  var importanceArray = ['none', 'low', 'normal', 'high', 'critical'];
  var cardArray = [];
  var $cardList = $('.todo-card-parent');
  var $saveBtn = $('.save-btn');
  var $titleInput = $('.title-input');
  var $bodyInput = $('.body-input');
  var $toDoParent = $('.todo-card-parent');
  var $searchInput = $('.search-input');


  function CardElements(title, body, importance = 2) {
    this.title = title;
    this.body = body;
    this.id = Date.now();
    this.importance = importance;
  }

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


  retrieveLocalStorage();

  function saveButton(event) {
    event.preventDefault();
    fireCards();
    $saveBtn.attr('disabled', 'disabled');
  }

  function enableSaveButton() {
    if (($titleInput.val() !== "") || ($bodyInput.val() !== "")) {
      $saveBtn.removeAttr('disabled');
    }
  }

  function deleteCard() {
    var currentCardId = $(this).closest('.todo-card')[0].id;
    cardArray.forEach(function(card, index) {
      if (currentCardId == card.id) {
        cardArray.splice(index, 1);
      }
    });
    storeCards();
    $(this).parents('.todo-card').remove();
  }

  function changeImportance(event) {
    event.preventDefault();
    var cardId = $(this).closest('.todo-card')[0].id;
    cardArray.forEach(function(card) {
      if ($(event.target).hasClass('upvote-btn') && card.id == cardId && card.importance < 4) {
        card.importance++;
      } else if ($(event.target).hasClass('downvote-btn') && card.id == cardId && card.importance > 0) {
        card.importance--;
      }
      $('.' + cardId).text(importanceArray[card.importance]);
      storeCards();
    });
  }

  function editCardText(e) {
    console.log(e);
    var id = $(this).closest('.todo-card')[0].id;
    var text = $(this).text();
    cardArray.forEach(function(card) {
      if (card.id == id && $(e.target).hasClass('title-text')) {
        card.title = text;
    } else if (card.id == id && $(e.target).hasClass('body-text')) {
      card.body = text;
    }
  });
    storeCards();
  }

  function blurEdit(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.blur();
    }
  }

  function searchCards() {
    var search = $(this).val().toUpperCase();
    var results = cardArray.filter(function(elementCard) {
      return elementCard.title.toUpperCase().includes(search) ||
        elementCard.body.toUpperCase().includes(search) ||
        elementCard.quality.toUpperCase().includes(search);
    });
    $toDoParent.empty();
    for (var i = 0; i < results.length; i++) {
      addCards(results[i]);
    }
  }

  function addCards(buildCard) {
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
      <hr>
    </article>`);
  }

  function fireCards() {
    var newCard = new CardElements($titleInput.val(), $bodyInput.val());
    cardArray.push(newCard);
    addCards(newCard);
    storeCards();
    clearInputs();
  }

  function storeCards() {
    localStorage.setItem('array', JSON.stringify(cardArray));
    clearInputs();
  }

  function clearInputs() {
    $titleInput.val('');
    $bodyInput.val('');
    $titleInput.focus();
  }

  function retrieveLocalStorage() {
    cardArray = JSON.parse(localStorage.getItem('array')) || [];
    cardArray.forEach(function(card) {
      addCards(card);
    });
  }





});
