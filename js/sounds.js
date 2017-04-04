var $ = require('jquery');
var render = require('./render.js');

var sounds = ( function() {
  var blackjackSound = document.createElement('audio');
  var bustSound = document.createElement('audio');
  var buttonPressSound = document.createElement('audio');
  var chipsSound = document.createElement('audio');
  var drawSound = document.createElement('audio');
  var drawCardSound = document.createElement('audio');
  var gameOverSound = document.createElement('audio');
  var loseSound = document.createElement('audio');
  var winSound = document.createElement('audio');
  var volumeOn = true;

  // set attributes
  blackjackSound.setAttribute('src', './sounds/blackjack.wav');
  bustSound.setAttribute('src', './sounds/bust.wav');
  buttonPressSound.setAttribute('src', './sounds/buttonPress.mp3');
  chipsSound.setAttribute('src', './sounds/chips.wav');
  drawSound.setAttribute('src', './sounds/draw.wav');
  drawCardSound.setAttribute('src', './sounds/drawCard.wav');
  gameOverSound.setAttribute('src', './sounds/gameOver.wav');
  loseSound.setAttribute('src', './sounds/lose.wav');
  winSound.setAttribute('src', './sounds/win.mp3');

  function blackjack() {
    if( volumeOn ) {
      blackjackSound.pause();
      blackjackSound.currentTime = 0;
      blackjackSound.play();
    }
  }

  function bust() {
    if( volumeOn ) {
      bustSound.pause();
      bustSound.currentTime = 0;
      bustSound.play();
    }
  }

  function buttonPress() {
    if( volumeOn ) {
      buttonPressSound.pause();
      buttonPressSound.currentTime = 0;
      buttonPressSound.play();
    }
  }

  function chips() {
    if( volumeOn ) {
      chipsSound.pause();
      chipsSound.currentTime = 0;
      chipsSound.play();
    }
  }

  function draw() {
    if( volumeOn ) {
      drawSound.pause();
      drawSound.currentTime = 0;
      drawSound.play();
    }
  }

  function drawCard() {
    if( volumeOn ) {
      drawCardSound.pause();
      drawCardSound.currentTime = 0;
      drawCardSound.play();
    }
  }

  function gameOver() {
    if( volumeOn ) {
      gameOverSound.pause();
      gameOverSound.currentTime = 0;
      gameOverSound.play();
    }
  }

  function lose() {
    if( volumeOn ) {
      loseSound.pause();
      loseSound.currentTime = 0;
      loseSound.play();
    }
  }

  function toggleVolume() {
    volumeOn = !volumeOn;
    render.volumeMute( volumeOn );
  }

  function win() {
    if( volumeOn ) {
      winSound.pause();
      winSound.currentTime = 0;
      winSound.play();
    }
  }

  return {
    blackjack: blackjack,
    bust: bust,
    buttonPress: buttonPress,
    chips: chips,
    draw: draw,
    drawCard: drawCard,
    gameOver: gameOver,
    lose: lose,
    toggleVolume: toggleVolume,
    win: win
  };

})();

module.exports = sounds;
