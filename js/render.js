var $ = require('jquery');

var render = ( function() {
  //cache DOM
  var $el = $('.blackjackModule');
  var $balance = $el.find('#balance');
  var $dealerContainer = $el.find('#dealerContainer');
  var $doubleElement = $el.find('#doubleElement');
  var $eventLog = $el.find('#eventLog');
  var $splitElement = $el.find('#splitElement');
  var $usersContainer = $el.find('#usersContainer');

  function activePlayer( activePlayer ) {
    var $activeScoreContainer = $el.find( activePlayer.scoreContainer );
    var $scoreContainer = $el.find('.scoreContainer');

    $scoreContainer.removeClass('activePlayer');
    $activeScoreContainer.addClass('activePlayer');
  }

  function balance( total ) {
    $balance.text( total );
  }

  function bet( bet, activePlayer ) {
    var $icon = $(`<img class='bet-icon' src='./icons/CHIP${ bet }.png'/>`);
    var $userBetContainer =  $el.find( activePlayer.betContainer );

    if( !activePlayer.statusDouble ) {
      $userBetContainer.empty();
    }

    $icon.appendTo( $userBetContainer );
  }

  function createDealer() {
    var dealerHTML = `
    <div><div id='cardsDealer'></div></div>
    <div><h2 class='scoreContainer' id='scoreDealer'></h2></div>`;

    $dealerContainer.append( dealerHTML );
  }

  function createUser( index, split, oldPlayer ) {
    //Check what user symbole to use
    var symbol = 0;

    if( index % 2 !== 0 ) {
      symbol = './icons/User2.png';
    } else {
        symbol = './icons/User.png';
      }

    var userHTML = `
    <div class='users' id='user${ index }'>
      <h2 class='scoreDiv scoreContainer image-container' id='scoreUser${ index }'></h2>
      <div class='cardsDiv' id='cardsUser${ index }'></div>
      <div class='image-container'>
        <img class='user-icon image-context' src=${ symbol }></img>
        <div class='betDiv image-context' id='betUser${ index }'></div>
      </div>
    </div>`;

    if( split ) {
      var $splitUserContainer = $el.find( oldPlayer.userContainer );
      $splitUserContainer.before( userHTML );
    } else {
        $usersContainer.append( userHTML );
      }
  }

  function doubleButton() {
    $doubleElement.toggle();
  }

  function eventLog( text ) {
    //Avoid newing 'Deal' text everytime a chip is clicked
    if( $eventLog.html() === text ) {
      return;
    }

    $eventLog.slideUp( 400, function() {
      $eventLog.empty();
      $eventLog.text( text ).hide().slideDown( 400 );
    });
  }

  function hideCardDealer( status, activePlayer ) {
    var $cardsDealer = $el.find('#cardsDealer');

    if( status ) {
      $cardsDealer.children()[ 1 ].src = './icons/hidden.png';
    } else if( !status ) {
        $cardsDealer.children()[ 1 ].src = activePlayer.cards[ 1 ].src;
      }
  }

  function pushCard( card, activePlayer ) {
    var $cardContainer = $el.find( activePlayer.cardContainer );
    var $image = $('<img class="card-icon" src=' + card.src + ' />');

    $image.appendTo( $cardContainer ).hide().slideDown('slow');

    if ( activePlayer.cards.length > 1 ) {
      $image.css({'margin-left' : '-44px'});
    }

    if( activePlayer.id === 'Dealer' && activePlayer.cards.length === 2 ) {
      hideCardDealer( 'On' );
    }
  }

  function removeSplitCard( player ) {
    var $cardContainer = $el.find( player.cardContainer );

    $cardContainer.children()[ 1 ].remove();
  }

  function removeUserHTML( obsoleteUser ) {
    var $userContainer = $el.find( obsoleteUser.userContainer );

    $userContainer.remove();
  }

  function resetPlayer( player ) {
    var $betContainer = $el.find( player.betContainer );
    var $cardContainer = $el.find( player.cardContainer );
    var $scoreContainer = $el.find( player.scoreContainer );

    $betContainer.empty();
    $cardContainer.empty();
    $scoreContainer.empty();
  }

  function result( user ) {
    var $resultContainer = $('<p class="result-text image-context">' + user.result[ 0 ]  + '</p>');
    var $scoreContainer = $el.find( user.scoreContainer );

    $resultContainer.appendTo( $scoreContainer );
  }

  function rules() {
    var $rulesHTML = $(`
    <button onclick='this.remove()' id='rules'>
      BLACKJACK RULES<br>
      <br>
      - Press NEW GAME to start<br>
      <br>
      - The object of the game is to reach 21 points<br>
        or achieve a score higher than the dealer<br>
        without exceeding 21<br>
      <br>
      - First, place a bet and press DEAL<br>
      <br>
      - Then HIT to add a card, or STAND if you are<br>
        happy with your cards<br>
      <br>
      - If your card total goes over 21 you are BUST<br>
        and the dealer wins<br>
      <br>
      - You can SPLIT your cards if dealt two cards<br>
        of the same value<br>
      <br>
      - Double your bet if you are dealt a total score<br>
        of 9, 10 or 11. You will receive only one<br>
        further card<br>
    </button>`);

    $rulesHTML.appendTo( $el );
  }

  function score( activePlayer ) {
    var $scoreContainer = $el.find( activePlayer.scoreContainer );

    $scoreContainer.text( activePlayer.netScore );
  }

  function splitButton() {
    $splitElement.toggle();
  }

  function volumeMute( status ) {
    var $soundIcon = $el.find('#sound-src');

    if( !status ) {
      $soundIcon.attr('src', './icons/SOUNDMUTE.png');
    } else {
        $soundIcon.attr('src', './icons/SOUND.png');
      }
  }

  return {
    activePlayer: activePlayer,
    balance: balance,
    bet: bet,
    createDealer: createDealer,
    createUser: createUser,
    doubleButton: doubleButton,
    eventLog: eventLog,
    hideCardDealer: hideCardDealer,
    pushCard: pushCard,
    removeSplitCard: removeSplitCard,
    removeUserHTML: removeUserHTML,
    resetPlayer: resetPlayer,
    result: result,
    rules: rules,
    score: score,
    splitButton: splitButton,
    volumeMute: volumeMute
  };

})();

module.exports = render;
