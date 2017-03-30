var $ = require('jquery');

var render = require('./render.js');

var sounds = ( function() {
  var volumeOn = true;

  var blackjackSound = document.createElement('audio');
  blackjackSound.setAttribute('src', './sounds/blackjack.wav');
  var bustSound = document.createElement('audio');
  bustSound.setAttribute('src', './sounds/bust.wav');
  var buttonPressSound = document.createElement('audio');
  buttonPressSound.setAttribute('src', './sounds/buttonPress.mp3');
  var chipsSound = document.createElement('audio');
  chipsSound.setAttribute('src', './sounds/chips.wav');
  var drawSound = document.createElement('audio');
  drawSound.setAttribute('src', './sounds/draw.wav');
  var drawCardSound = document.createElement('audio');
  drawCardSound.setAttribute('src', './sounds/drawCard.wav');
  var gameOverSound = document.createElement('audio');
  gameOverSound.setAttribute('src', './sounds/gameOver.wav');
  var loseSound = document.createElement('audio');
  loseSound.setAttribute('src', './sounds/lose.wav');
  var winSound = document.createElement('audio');
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

  function win() {
    if( volumeOn ) {
      winSound.pause();
      winSound.currentTime = 0;
      winSound.play();
    }
  }

  function toggleVolume() {
    volumeOn = !volumeOn;
    render.volumeMute( volumeOn );
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
    win: win,
    toggleVolume: toggleVolume,
  }

})();

module.exports = sounds;
