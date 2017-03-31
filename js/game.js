var $ = require('jquery');
var Balance = require('./Balance.js');
var buttons = require('./buttons.js');
var Dealer = require('./Dealer.js');
var Deck = require('./Deck.js');
var User = require('./User.js');
var render = require('./render.js');
var sounds = require('./sounds.js');

var game = ( function() {
  var activePlayer = {};
  var balance = {};
  var deck = {};
  var gameButtonStatusNewGame = true;
  var players = [];
  var users = 0;
  var maxUsers = 0;
  //cache DOM
  var $el = $('.blackjackModule');
  var $info = $el.find('#info');
  var $volume = $el.find('#volume');
  var $game = $el.find('#game');
  var $twentyFive = $el.find('#twentyFive');
  var $fifty = $el.find('#fifty');
  var $hundred = $el.find('#hundred');
  var $twoHundred = $el.find('#twoHundred');
  var $split = $el.find('#split');
  var $double = $el.find('#double');
  var $stand = $el.find('#stand');
  var $takeCard = $el.find('#takeCard');
  //Bind events
  $info.click( info );
  $volume.click( volume );
  $game.click( gameButtonSwitch );
  $twentyFive.click( function() { betPlaced( 25 ); });
  $fifty.click( function() { betPlaced( 50 ); });
  $hundred.click( function() { betPlaced( 100 ); });
  $twoHundred.click( function() { betPlaced( 200 ); });
  $takeCard.click( userTakeCard );
  $stand.click( userStand );
  $split.click( userSplit );
  $double.click( userDouble );

  function allUsersBustOrBlackjackorNotInplay() {
    var numberOfUsers = players.length - 1;
    var i = 0;

    for( ; i < numberOfUsers ; i++ ) {
      if ( players[ i ].status !== 'Bust' && players[ i ].status !== 'Blackjack!' && players[ i ].inplay !== false ) {
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
    if( users > maxUsers ) {
      buttons.toggleGame();
      alert('You\'re a funny guy');
      return;
    }

    var i = 0;
    for( ; i < users; i++ ) {
      players.push( new User( i ) );
    }
    players.push( new Dealer() );
  }

  function deal() {
    sounds.buttonPress();
    var indexUser = players.indexOf( activePlayer ) + 1;

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

  function dealersTurn() {
    activePlayer.hideCardDealer( false, activePlayer )

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
    var numberOfUsers = players.length - 1;
    var i = 0;
    var user = {};
    var dealer = activePlayer;

    function _userResult() {
      setTimeout( function() {
        user = players[ i ];

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
        i++;

        if( i < numberOfUsers && players[ i ].inplay === true ) {
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

  function selectNextPlayer( activePlayer ) {
    var index = players.indexOf( activePlayer );
    index += 1;
    if( index % players.length === 0 ) {
      index = 0;
    };
    return players[ index ];
  }

  function selectNextPlayerInPlay( activePlayer ) {
    var numberOfPlayers = players.length;
    var player = {};
    var index = 0;

    index = players.indexOf( activePlayer );
    index += 1;
    if( index % numberOfPlayers === 0 ) {
      index = 0;
    };
    player = players[ index ];
    if( player.inplay === true ) {
      return player;
    } else {
        return players[ numberOfPlayers - 1 ];
      }
  }

  function newGame() {
    sounds.buttonPress();
    var i = 0;
    var obsoleteUser = {};
    var player = {};

    for( player of players ) {
      player.reset( player );
    }

// Users made for splitting need to be elimated before start new game
    for( player of players ) {
      if( player.statusSplit === 'Split' ) {
        i = players.indexOf( player );
        obsoleteUser = players[ i ];
        obsoleteUser.removeHTML( obsoleteUser );
        players.splice( i, 1 );
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

  function volume() {
    sounds.toggleVolume();
  }

  function start( setUsers, setMaxUsers, setPacks, setOpeningBalance ) {
    balance = new Balance( setOpeningBalance );
    deck = new Deck( setPacks );
    deck.create();
    users = setUsers;
    maxUsers = setMaxUsers;
    createPlayers();
    buttons.toggleGame();
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
    var i = 0;
    var transferCard = {};
    var oldPlayer = {};
    var newPlayer = {};

    sounds.buttonPress();
    i = players.indexOf( activePlayer );
    oldPlayer = players[ i ];
    transferCard = oldPlayer.removeSplitCard( oldPlayer );

    players.splice( i, 0, new User( users, 'Split', oldPlayer ) );
    newPlayer = players[ i ];
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

  return {
    start: start,
  }

})();

module.exports = game;
