var render = require('./render.js');

class Player {
  constructor() {
    this.aces = 0;
    this.bet = 0;
    this.cards = [];
    this.grossScore = 0;
    this.netScore = 0;
    this.status = '';
    this.result = [];
    this.statusDouble = false;
    this.inplay = false;
  }

  addCard( card, activePlayer ) {
    this.cards.push( card );
    this.grossScore += card.value;
    this.netScore += card.value;
    this.countAces( card );
    this.adjustAces();
    render.pushCard( card, activePlayer );
    render.score( activePlayer );

    if( this.netScore > 21 ) {
      this.status = 'Bust';
    }

    if( this.cards.length === 2 && this.netScore === 21 ) {
      this.status = 'Blackjack!';
    }
  }

  adjustAces() {
    if( this.netScore < 22 ) {
      return;
    }

    if( ( this.grossScore - this.aces * 10 ) > 21 ) {
      return;
    } else {
        this.netScore -= 10;
      }
  }

  countAces( card ) {
    if( card.number === 'ace' ) {
      this.aces += 1;
    }
  }

  reset( player ) {
    this.aces = 0;
    this.bet = 0;
    this.cards = [];
    this.grossScore = 0;
    this.netScore = 0;
    this.status = '';
    this.result = '';
    this.statusDouble = false;
    this.inplay = false;
    render.resetPlayer( player );
  }
}

module.exports = Player;
