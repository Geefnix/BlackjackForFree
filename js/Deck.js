var Card = require('./Card.js');

class Deck {
  constructor( setPacks ) {
    this.currentDeck = [];
    this.packs = setPacks;
  }
  create() {
    var number = '';
    var numbers = [ 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king', 'ace' ];
    var specie = '';
    var species = [ 'hearts', 'spades', 'diamonds', 'clubs' ];
    var value = 0;
    var values = [ 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11 ];

    var x = 0;
    var index = 0;

    for ( ; x < this.packs; x++ ) {
      for( specie of species ) {
        for ( number of numbers ) {
          index = numbers.indexOf( number );
          value = values[ index ];
          this.currentDeck.push( new Card( specie, number, value ) );
        }
      }
    }
  }
  grabCard() {
    var randomNumber = 0;
    var card = {};

    randomNumber = Math.floor( Math.random() * this.currentDeck.length );
    card = this.currentDeck[ randomNumber ];
    this.currentDeck.splice( randomNumber, 1 );
    return card;
  }

  shuffle() {
    if( this.currentDeck.length <= ( 52 * this.packs ) / 2 ) {
      this.currentDeck = [];
      this.create();
    }
  }
}

module.exports = Deck;
