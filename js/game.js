var $ = require('jquery');
var Balance = require('./Balance.js');
var buttons = require('./buttons.js');
var Dealer = require('./Dealer.js');
var Deck = require('./Deck.js');
var render = require('./render.js');
var sounds = require('./sounds.js');
var User = require('./User.js');

var game = ( function() {
  var activePlayer = {};
  var balance = {};
  var deck = {};
  var gameButtonStatusNewGame = true;
  var maxUsers = 0;
  var players = [];
  var users = 0;
  //cache DOM
  var $el = $('.blackjackModule');
  var $double = $el.find('#double');
  var $fifty = $el.find('#fifty');
  var $game = $el.find('#game');
  var $hundred = $el.find('#hundred');
  var $info = $el.find('#info');
  var $split = $el.find('#split');
  var $stand = $el.find('#stand');
  var $takeCard = $el.find('#takeCard');
  var $twentyFive = $el.find('#twentyFive');
  var $twoHundred = $el.find('#twoHundred');
  var $volume = $el.find('#volume');
  //Bind events
  $double.click( userDouble );
  $fifty.click( function() { betPlaced( 50 ); });
  $game.click( gameButtonSwitch );
  $hundred.click( function() { betPlaced( 100 ); });
  $info.click( info );
  $split.click( userSplit );
  $stand.click( userStand );
  $takeCard.click( userTakeCard );
  $twentyFive.click( function() { betPlaced( 25 ); });
  $twoHundred.click( function() { betPlaced( 200 ); });
  $volume.click( volume );

  function allUsersBustOrBlackjackorNotInplay() {
    var index = 0;
    var numberOfUsers = players.length - 1;

    for( ; index < numberOfUsers ; index++ ) {
      if ( players[ index ].status !== 'Bust' && players[ index ].status !== 'Blackjack!' && players[ index ].inplay !== false ) {
        return false;
      }
    }
    return true;
  }

  function betPlaced( bet ) {
    sounds.chips();
    activePlayer.setBet( bet, activePlayer );
    // Make sure game button triggers function deal and does not get toggled off when bets are changed
    gameButtonStatusNewGame = false;
    buttons.toggleGame( true );
    render.eventLog('Deal');
  }

  function createPlayers() {
    var index = 0;

    if( users > maxUsers || users < 1 ) {
      buttons.toggleGame();
      alert('You\'re a funny guy');
      return;
    }

    for( ; index < users; index++ ) {
      players.push( new User( index ) );
    }
    players.push( new Dealer() );
  }

  function deal() {
    var indexUser = players.indexOf( activePlayer ) + 1;
    sounds.buttonPress();
    balance.reduce( activePlayer.bet );
    activePlayer.inplay = true;

    if( indexUser < users && !balance.insufficientFunds() ) {
      activePlayer = selectNextPlayer( activePlayer );
      buttons.toggleGame();
      buttons.toggleBet( balance.total );
      } else {
          gameButtonStatusNewGame = true;
          buttons.toggleGame();
          buttons.toggleBet();
          activePlayer = players[ 0 ];
          startDealing();
        }
  }

  function dealersTurn() {
    activePlayer.hideCardDealer( false, activePlayer );

    if( allUsersBustOrBlackjackorNotInplay() ) {
      determineResults();
    } else {
        _dealerTakeCards( determineResults );
      }

    function _dealerTakeCards( callback ) {
      setTimeout(function () {
        if( activePlayer.netScore < 17 ) {
          sounds.drawCard();
          activePlayer.addCard( deck.grabCard(), activePlayer );
          _dealerTakeCards( callback );
        } else {
            if( callback ) {
              callback();
            }
          }
      }, 800);
    }
  }

  function determineResults() {
    var dealer = activePlayer;
    var index = 0;
    var numberOfUsers = players.length - 1;
    var user = {};

    function _userResult() {
      setTimeout( function() {
        user = players[ index ];

        if( user.status === 'Blackjack!' && dealer.status === 'Blackjack!' ) {
          sounds.draw();
          user.result = [ 'Draw', 1 ];
        } else if( user.status === 'Blackjack!' && dealer.status !== 'Blackjack!' ) {
            sounds.win();
            user.result = [ 'Win!', 2.5 ];
          } else if( user.status !== 'Blackjack!' && dealer.status === 'Blackjack!' ) {
              sounds.lose();
              user.result = [ 'Lose', 0 ];
            } else if( user.status === 'Bust' ) {
                sounds.lose();
                user.result = [ 'Lose', 0 ];
              } else if( dealer.netScore > 21 || user.netScore > dealer.netScore ) {
                  sounds.win();
                  user.result = [ 'Win!', 2 ];
                } else if( user.netScore === dealer.netScore ) {
                    sounds.draw();
                    user.result = [ 'Draw', 1 ];
                  } else if ( dealer.netScore > user.netScore ) {
                      sounds.lose();
                      user.result = [ 'Lose', 0 ];
                    }

        render.result( user );
        balance.procesResult( user );
        index++;

        if( index < numberOfUsers && players[ index ].inplay === true ) {
          _userResult();
        } else {
            endGame();
          }
      }, 1000);
    }

    _userResult();
  }

  function endGame() {
    if( balance.insufficientFunds() ) {
      sounds.gameOver();
      render.eventLog('Game Over');
      setTimeout( function() {
        render.eventLog('Try Again');
        balance.set( 1000 );
        buttons.toggleGame();
      }, 2000);
    } else {
        render.eventLog('Next Game');
        buttons.toggleGame();
      }
  }

  function gameButtonSwitch() {
    if( gameButtonStatusNewGame ) {
      newGame();
    } else if( !gameButtonStatusNewGame ) {
        deal();
      }
  }

  function gameMechanics() {
    var numberOfPlayers = 0;

    if( !activePlayer.status ) {
      activePlayer.determineOptions( users, maxUsers, balance.total );
    } else {
        render.eventLog( activePlayer.status );
        if ( activePlayer.status === 'Blackjack!' ) {
          sounds.blackjack();
        } else if ( activePlayer.status === 'Bust' ) {
            sounds.bust();
          }
        setTimeout( function() {
          _nextPlayerPlays();
        }, 1500);
      }

    function _nextPlayerPlays() {
      activePlayer = selectNextPlayer( activePlayer );

      if( activePlayer.inplay === false ) {
        numberOfPlayers = players.length - 1;
        activePlayer = players[ numberOfPlayers ];
      }

      render.activePlayer( activePlayer );

      if( activePlayer.id === 'Dealer' ) {
        dealersTurn();
      } else {
          render.eventLog('Play');
          gameMechanics();
        }
    }
  }

  function info() {
    sounds.buttonPress();
    render.rules();
  }

  function newGame() {
    var index = 0;
    var obsoleteUser = {};
    var player = {};

    sounds.buttonPress();

    for( player of players ) {
      player.reset( player );
    }

// Users made for splitting need to be elimated before start new game
    for( player of players ) {
      if( player.statusSplit === 'Split' ) {
        index = players.indexOf( player );
        obsoleteUser = players[ index ];
        obsoleteUser.removeHTML( obsoleteUser );
        players.splice( index, 1 );
        users--;
      }
    }

    deck.shuffle();
    buttons.toggleGame();
    activePlayer = players[ 0 ];
    render.activePlayer( activePlayer );
    render.eventLog('Place Bet');
    buttons.toggleBet( balance.total );
  }

  function selectNextPlayer( activePlayer ) {
    var index = players.indexOf( activePlayer );

    index += 1;
    if( index % players.length === 0 ) {
      index = 0;
    }

    return players[ index ];
  }

  function selectNextPlayerInPlay( activePlayer ) {
    var index = players.indexOf( activePlayer );
    var numberOfPlayers = players.length;
    var player = {};

    index += 1;
    if( index % numberOfPlayers === 0 ) {
      index = 0;
    }
    player = players[ index ];

    if( player.inplay === true ) {
      return player;
    } else {
        return players[ numberOfPlayers - 1 ];
      }
  }

  function start( setOpeningBalance, setPacks, setUsersmin, setUsersmax ) {
    balance = new Balance( setOpeningBalance );
    deck = new Deck( setPacks );
    deck.create();
    users = setUsersmin;
    maxUsers = setUsersmax;
    createPlayers();
    buttons.toggleGame();
  }

  function startDealing() {

    function _dealCard() {
      setTimeout( function() {
        sounds.drawCard();
        activePlayer.addCard( deck.grabCard(), activePlayer );

        if( activePlayer.id === 'Dealer' && activePlayer.cards.length === 2 ) {
          activePlayer.hideCardDealer( true, activePlayer );
        }

        activePlayer = selectNextPlayerInPlay( activePlayer );
        if ( !(activePlayer === players[ 0 ] && activePlayer.cards.length === 2) ) {
          _dealCard();
        } else {
            activePlayer = players[ 0 ];
            render.activePlayer( activePlayer );
            render.eventLog('Select Action');
            gameMechanics();
          }
      }, 400);
    }

    _dealCard();
  }

  function userDouble() {
    //User doubles bet and must start with netScore between 9 and 11. User is allowed
    //to take one more card with no risk of going bust.
    sounds.buttonPress();
    balance.reduce( activePlayer.bet );
    activePlayer.doubleBet( activePlayer );
    activePlayer.processDoubleScore( activePlayer );
    activePlayer.addCard( deck.grabCard(), activePlayer );
    activePlayer.status = 'Stand';
    buttons.toggleAllOff();
    gameMechanics();
  }

  function userSplit() {
    var index = 0;
    var newPlayer = {};
    var oldPlayer = {};
    var transferCard = {};

    sounds.buttonPress();
    index = players.indexOf( activePlayer );
    oldPlayer = players[ index ];
    transferCard = oldPlayer.removeSplitCard( oldPlayer );

    players.splice( index, 0, new User( users, 'Split', oldPlayer ) );
    newPlayer = players[ index ];
    users++;
    newPlayer.inplay = true;
    newPlayer.setBet( oldPlayer.bet, newPlayer );
    balance.reduce( newPlayer.bet );
    newPlayer.addCard( transferCard, newPlayer );

    oldPlayer.addCard( deck.grabCard(), oldPlayer );
    newPlayer.addCard( deck.grabCard(), newPlayer );
    activePlayer = newPlayer;
    render.activePlayer( activePlayer );
    buttons.toggleAllOff();
    gameMechanics();
  }

  function userStand() {
    sounds.buttonPress();
    activePlayer.status = 'Stand';
    buttons.toggleAllOff();
    gameMechanics();
  }

  function userTakeCard() {
    sounds.buttonPress();
    activePlayer.addCard( deck.grabCard(), activePlayer );
    buttons.toggleAllOff();
    gameMechanics();
  }

  function volume() {
    sounds.toggleVolume();
  }

  return {
    start: start
  };

})();

module.exports = game;
