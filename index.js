function setup () {
  let firstCard = null;
  let secondCard = null;
  let preventClick = false;

  function checkForMatch() {
    console.log("Running checkForMatch");
    if (firstCard.src === secondCard.src) {
      disableMatchedCards();
    } else {
      unflipCards();
    }
  }

  function disableMatchedCards() {
    console.log("Running disableMatchedCards");
    $(`#${firstCard.id}`).parent().off('click');
    $(`#${secondCard.id}`).parent().off('click');
    pairsMatched++;
    resetSelection();
  }

  function unflipCards() {
    console.log("Running unflipCards");
    setTimeout(() => {
      $(`#${firstCard.id}`).parent().toggleClass('flip');
      $(`#${secondCard.id}`).parent().toggleClass('flip');
      resetSelection();
    }, 1000);
  }

  function resetSelection() {
    console.log("Running resetSelection");
    firstCard = null;
    secondCard = null;
    preventClick = false;
  }

  $(".card").on(("click"), function () {
    $(this).toggleClass("flip");

    if (!firstCard)
      firstCard = $(this).find(".front_face")[0]
    else {
      secondCard = $(this).find(".front_face")[0]
      preventClick = true;
      checkForMatch();
    }
  });
}

$(document).ready(setup)