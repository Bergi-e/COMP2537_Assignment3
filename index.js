function setup () {
  let firstCard = null;
  let secondCard = null;
  let preventClick = false;
  let pairsMatched = 0;
  let totalPairs = 3; // Default
  let clicks = 0;

  function updateClicks() {
    $("#clicks").text(clicks);
  }

  function updatePairsMatched() {
    $("#pairs_matched").text(pairsMatched);
    $("#pairs_left").text(totalPairs - pairsMatched);
  }

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
    updatePairsMatched();
    console.log(`Pairs matched: ${pairsMatched}`);
    console.log(`Total pairs: ${totalPairs}`);
    if (pairsMatched === totalPairs) endGame();
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

  function endGame() {
    preventClick = true;                     
    const endMsg = 'You Win!!!';
    $('#message').text(endMsg).show();
  }

  $(".card").on("click", function () {
    const $card = $(this);
    if (preventClick || $card.hasClass("matched")) return;
    const currentCard = $card.find(".front_face")[0];
    if (firstCard && currentCard === firstCard) return;
    clicks++;
    updateClicks();

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