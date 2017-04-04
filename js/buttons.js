var $ = require('jquery');
var render = require('./render.js');

var buttons = ( function() {
  //cache DOM
  var $el = $('.blackjackModule');
  var $double = $el.find('#double');
  var $fifty = $el.find('#fifty');
  var $game = $el.find('#game');
  var $hundred = $el.find('#hundred');
  var $split = $el.find('#split');
  var $stand = $el.find('#stand');
  var $takeCard = $el.find('#takeCard');
  var $twentyFive = $el.find('#twentyFive');
  var $twoHundred = $el.find('#twoHundred');

  function toggleAllOff() {
    this.toggleStandAndHit();

    if( !$double.is(':disabled') ) {
      this.toggleDouble();
    }

    if( !$split.is(':disabled') ) {
      this.toggleSplit();
    }
  }

  function toggleBet( balance ) {
    $twoHundred.prop('disabled', true );
    $hundred.prop('disabled', true );
    $fifty.prop('disabled', true );
    $twentyFive.prop('disabled', true );

    if( balance >= 200 ) {
      $twoHundred.prop('disabled', false );
    }

    if( balance >= 100 ) {
      $hundred.prop('disabled', false );
    }

    if( balance >= 50 ) {
      $fifty.prop('disabled', false );
    }

    if( balance >= 25 ) {
      $twentyFive.prop('disabled', false );
    }
  }

  function toggleDouble() {
    $double.prop('disabled', function( i, v ) { return !v; });
    render.doubleButton();
  }

  function toggleGame( status ) {
    if( status ) {
      $game.prop('disabled', false );
    } else {
        $game.prop('disabled', function( i, v ) { return !v; });
      }
  }

  function toggleSplit() {
    $split.prop('disabled', function( i, v ) { return !v; });
    render.splitButton();
  }

  function toggleStandAndHit() {
    $stand.prop('disabled', function( i, v ) { return !v; });
    $takeCard.prop('disabled', function( i, v ) { return !v; });
  }

  return {
    toggleAllOff: toggleAllOff,
    toggleBet: toggleBet,
    toggleDouble: toggleDouble,
    toggleGame: toggleGame,
    toggleSplit: toggleSplit,
    toggleStandAndHit: toggleStandAndHit
  };

})();

module.exports = buttons;
