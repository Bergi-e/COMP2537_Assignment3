function setup () {
  let firstCard = null;
  let secondCard = null;
  let preventClick = false;
  let pairsMatched = 0;
  let totalPairs = 3; // Default
  let clicks = 0;
  let timer = 60; // Default
  let gameTimer;
  let gameStarted = false;
  let currentDifficulty = "easy";

  const difficulties = {
    easy: { pairs: 3, time: 60 },
    medium: { pairs: 6, time: 90 },
    hard: { pairs: 12, time: 120 }
  };

  $("#startBtn").on("click", function() {
    if (gameStarted) return;
    gameStarted = true;
    $("#startBtn").prop('disabled', true);
    startTimer();
  });

  function updateClicks() {
    console.log("Running updateClicks");
    $("#clicks").text(clicks);
  }

  function updatePairsMatched() {
    console.log("Running updatePairsMatched");
    $("#pairs_matched").text(pairsMatched);
    $("#pairs_left").text(totalPairs - pairsMatched);
  }

  $("#startBtn").on("click", function() {
    if (gameStarted) return;
    gameStarted = true;

    $("#startBtn").prop('disabled', true);

    startTimer();
  })
  
  function startTimer() {
    console.log("Running startTimer");
    updateTimer();
    gameTimer = setInterval(() => {
      timer--;
      updateTimer();
      if (timer <= 0) {
        clearInterval(gameTimer);
        outOfTime();
      }
    }, 1000);
  }

  function stopTimer() {
    clearInterval(gameTimer);
  }

  function updateTimer() {
    console.log("Running updateTimer");
    const mins = Math.floor(timer / 60);
    const secs = timer % 60;
    const padded = secs.toString().padStart(2, "0");
    $("#timer").text(`${mins}:${padded}`);
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
    $(`#${firstCard.id}`).parent().off("click").addClass("matched");
    $(`#${secondCard.id}`).parent().off("click").addClass("matched");
    pairsMatched++;
    updatePairsMatched();
    console.log("Pairs matched: ${pairsMatched}");
    console.log("Total pairs: ${totalPairs}");
    if (pairsMatched === totalPairs) endGame();
    resetSelection();
  }

  function unflipCards() {
    console.log("Running unflipCards");
    setTimeout(() => {
      $(`#${firstCard.id}`).parent().removeClass("flip");
      $(`#${secondCard.id}`).parent().removeClass("flip");
      resetSelection();
    }, 1000);
  }

  function resetSelection() {
    console.log("Running resetSelection");
    firstCard = null;
    secondCard = null;
    preventClick = false;
  }

  function outOfTime() {
    console.log("Running outOfTime");
    preventClick = true;
    const endMsg = "Time is up!!!";
    $("#message").text(endMsg).show();
  }

  function endGame() {
    console.log("Running endGame");
    preventClick = true;        
    stopTimer();             
    const endMsg = "You Win!!!";
    $("#message").text(endMsg).show();
  }

  function resetGame() {
    stopTimer();
    clicks = 0;
    pairsMatched = 0;
    timer = 60;
    firstCard = null;
    secondCard = null;
    preventClick = false;

    $("#message").hide().text("");
    $(".card").removeClass("flip matched").off("click").on("click", cardClickHandler);

    gameStarted = false;
    $("#startBtn").prop("disabled", false);

    updateClicks();
    updatePairsMatched();
    updateTimer();
    $("#total_pairs").text(totalPairs);

    updateTimer();
  }

  // Card clicking
  function cardClickHandler() {
    console.log("Running cardClickHandler");
    const $card = $(this);
    if (!gameStarted) return;
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
    }

  // Initial header setup
  updateClicks();
  updatePairsMatched();
  updateTimer();

  $(".card").on("click", cardClickHandler);
  $("#resetBtn").on("click", resetGame);
  }

$(document).ready(setup)