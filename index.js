function setup () {
  let firstCard = null;
  let secondCard = null;
  let preventClick = false;
  let pairsMatched = 0;
  let totalPairs = 3; // Default

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
    $(`#${firstCard.id}`).parent().off('click').addClass('matched');
    $(`#${secondCard.id}`).parent().off('click').addClass('matched');
    pairsMatched++;
    if (pairsMatched === totalPairs) {
      alert("You win!");
    }
    resetSelection();
  }

  function unflipCards() {
    console.log("Running unflipCards");
    setTimeout(() => {
      $(`#${firstCard.id}`).parent().removeClass('flip');
      $(`#${secondCard.id}`).parent().removeClass('flip');
      resetSelection();
    }, 1000);
  }

  function resetSelection() {
    console.log("Running resetSelection");
    firstCard = null;
    secondCard = null;
    preventClick = false;
  }

$(".card").on("click", function () {
  const $card = $(this);
  if (preventClick || $card.hasClass("matched")) return;
  const currentCard = $card.find(".front_face")[0];
  if (firstCard && currentCard === firstCard) return;

  $card.addClass("flip");

  if (!firstCard) {
    firstCard = currentCard;
  } else {
    secondCard  = currentCard;
    preventClick = true;
    checkForMatch();
    }
  });
}

$(document).ready(setup)