function setup () {
  let firstCard = null;
  let secondCard = null;
  let preventClick = false;
  let pairsMatched = 0;
  let totalPairs = 3; // Default
  let clicks = 0;
  let timer = 60; // Default
  let gameTimer = null;
  let gameStarted = false;
  let currentDifficulty = "easy";

  const difficulties = {
    easy:   { pairs: 3,  time: 30  },
    medium: { pairs: 6,  time: 45  },
    hard:   { pairs: 10,  time: 60 }
  };

  function getPokedex(count) {
    const max = 898;
    const set = new Set();
    while (set.size < count) {
      set.add(Math.floor(Math.random() * max) + 1);
    }
    return Array.from(set);
  }

  async function fetchSprites(ids) {
    const promises = ids.map(id => 
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(res => res.json())
        .then(data => {
          return data.sprites.other["official-artwork"].front_default || data.sprites.front_default; 
        })
    );
  return Promise.all(promises);
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  async function loadCards() {
    console.log("Running loadCards");
    const pokedex = getPokedex(totalPairs);
    const sprites = await fetchSprites(pokedex);
    const cardData = [...sprites, ...sprites];
    const shuffledCards = shuffle(cardData);

    $("#game_grid").empty();
    shuffledCards.forEach(url => {
      const $card = $(
        `<div class="card col-3 col-md-2">
          <img src="${url}" class="front_face" alt="Pokemon">
          <img src="/public/images/back.webp" class="back_face" alt="Pokeball">
        </div>`
      );
      $card.data('url', url);
      $card.on('click', cardClickHandler);
      $("#game_grid").append($card);
    })
  }

  function updateClicks() {
    console.log("Running updateClicks");
    $("#clicks").text(clicks);
  }

  function updatePairsMatched() {
    console.log("Running updatePairsMatched");
    $("#pairs_matched").text(pairsMatched);
    $("#pairs_left").text(totalPairs - pairsMatched);
  }

  function updateTotalPairs() {
    console.log("Running updateTotalPairs");
    $("#total_pairs").text(totalPairs);
  }
  
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

    // Card clicking
  function cardClickHandler() {
    if (!gameStarted || preventClick) return;
    const $card = $(this);
    if ($card.hasClass('matched')) return;
    if (firstCard && $card.is(firstCard.elem)) return;

    $card.toggleClass('flip');
    const url = $card.data('url');
    if (!firstCard) {
      firstCard = { url, elem: $card };
    } else {
      secondCard = { url, elem: $card };
      preventClick = true;
      setTimeout(checkForMatch, 500);
    }
    clicks++; 
    updateClicks();
  }

  function checkForMatch() {
    console.log("Running checkForMatch");
    if (firstCard.url === secondCard.url) {
      firstCard.elem.add(secondCard.elem).addClass("matched");
      pairsMatched++;
      updatePairsMatched();
      if (pairsMatched === totalPairs) endGame(); 
    } else {
    firstCard.elem.add(secondCard.elem).removeClass("flip");
    }
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
    $("#difficulty").prop("disabled", false);

    updateClicks();
    updatePairsMatched();
    updateTimer();
    $("#total_pairs").text(totalPairs);

    updateTimer();
    loadCards(totalPairs);

  }

  $("#difficulty").on('change', function() {
    if (gameStarted) return;
    currentDifficulty = this.value;
    totalPairs = difficulties[currentDifficulty].pairs;
    timer = difficulties[currentDifficulty].time;


    updateTotalPairs(); 
    updatePairsMatched(); 
    updateTimer();
    $("#game_grid").removeClass("easy medium hard").addClass(currentDifficulty);
    if (!gameStarted) loadCards(totalPairs);
  });

  $("#startBtn").on("click", function() {
    if (gameStarted) return;
    gameStarted = true;
    $("#startBtn").prop('disabled', true);
    $("#difficulty").prop('disabled', true);
    loadCards();
    startTimer();
  });

  // Initial header setup
  updateClicks();
  updatePairsMatched();
  updateTimer();

  $(".card").on("click", cardClickHandler);
  $("#resetBtn").on("click", resetGame);

  $('#game_grid').addClass(currentDifficulty);
  loadCards();

  $('#theme-default').on('click', () => applyTheme('default'));
$('#theme-dark'   ).on('click', () => applyTheme('dark'));
$('#theme-blue'   ).on('click', () => applyTheme('blue'));

function applyTheme(name) {
  document.body.classList.remove('theme-default', 'theme-dark', 'theme-blue');
  document.body.classList.add(`theme-${name}`);
}
}

$(document).ready(setup)