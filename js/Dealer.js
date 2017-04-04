var Player = require('./Player.js');
var render = require('./render.js');

class Dealer extends Player {
  constructor() {
    super();
    render.createDealer();
    this.id = 'Dealer';
    this.scoreContainer = '#scoreDealer';
    this.cardContainer = '#cardsDealer';
  }

  hideCardDealer( status, activePlayer ) {
    if( status ) {
      this.netScore = this.netScore - this.cards[ 1 ].value;

      if( this.cards[ 0 ].number === 'ace' && this.cards[ 1 ].number === 'ace' ) {
        this.netScore = this.netScore + 10;
      }

      render.score( activePlayer );
    } else if( !status ) {
        this.netScore = this.netScore + this.cards[ 1 ].value;

        if( this.cards[ 0 ].number === 'ace' && this.cards[ 1 ].number === 'ace' ) {
          this.netScore = this.netScore - 10;
        }

        render.score( activePlayer );
      }
    render.hideCardDealer( status, activePlayer );
  }
}

module.exports = Dealer;
