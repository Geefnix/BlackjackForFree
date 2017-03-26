var $ = require('jquery');

var render = ( function() {
  var $el = $('.blackjackModule');
  var $balance = $el.find('#balance');
  var $dealerContainer = $el.find('#dealerContainer');
  var $eventLog = $el.find('#eventLog');
  var $usersContainer = $el.find('#usersContainer');
  var $doubleElement = $el.find('#doubleElement');
  var $splitElement = $el.find('#splitElement');

  function activePlayer( activePlayer ) {
    var $scoreContainer = $el.find('.scoreContainer');
    $scoreContainer.removeClass('activePlayer');

    var $activeScoreContainer = $el.find( activePlayer.scoreContainer );
    $activeScoreContainer.addClass('activePlayer');
  }

  function balance( total ) {
    $balance.text( total );
  }

  function bet( bet, activePlayer ) {
    var $userBetContainer =  $el.find( activePlayer.betContainer );
    var $icon = $(`<img class='bet-icon' src='./icons/CHIP${ bet }.png'/>`);
    if( !activePlayer.statusDouble ) {
      $userBetContainer.empty();
    }
    $icon.appendTo( $userBetContainer );
  }

  function createDealer() {
    var dealerHTML = `<div><div id='cardsDealer'></div></div>
                    <div><h2 class='scoreContainer' id='scoreDealer'></h2></div>`;
    $dealerContainer.append( dealerHTML );
  }

  function createUser( index, split, oldPlayer ) {
    var userHTML = `<div class='users' id='user${ index }'>
                      <h2 class='scoreDiv scoreContainer image-container' id='scoreUser${ index }'></h2>
                      <div class='cardsDiv' id='cardsUser${ index }'></div>
                      <div class='image-container'>
                        <img class='user-icon image-context' src='./icons/User.png'></img>
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
      var $scoreContainer = $el.find( player.scoreContainer );
      var $cardContainer = $el.find( player.cardContainer );
      var $betContainer = $el.find( player.betContainer );
      $scoreContainer.empty();
      $cardContainer.empty();
      $betContainer.empty();
  }

  function result( user ) {
    var $scoreContainer = $el.find( user.scoreContainer );
    var $resultContainer = $('<p class="result-text image-context">' + user.result[ 0 ]  + '</p>');
    $resultContainer.appendTo( $scoreContainer );
  }

  function score( activePlayer ) {
    var $scoreContainer = $el.find( activePlayer.scoreContainer );
    $scoreContainer.text( activePlayer.netScore );
  }

  function splitButton() {
    $splitElement.toggle();
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
    score: score,
    splitButton: splitButton,
  }

})();

module.exports = render;
