var Player = require('./Player.js');
var render = require('./render.js');
var buttons = require('./buttons.js');

class User extends Player{
  constructor( index, split, oldPlayer ) {
    super();
    render.createUser( index, split, oldPlayer );
    this.userContainer = '#user' + index;
    this.scoreContainer = '#scoreUser' + index;
    this.cardContainer = '#cardsUser' + index;
    this.betContainer = '#betUser' + index;
    this.statusSplit = split;
  }

  checkDouble() {
    var check = 0;

    if( this.aces > 0 ) {
      check = this.netScore - 10;
    }

    if( ( this.netScore >= 9 && this.netScore <= 11 ) || ( check >= 9 && check <= 11 ) ) {
      buttons.toggleDouble();
    }
  }

  checkSplit( users, maxUsers ) {
    if( this.cards[ 0 ].number === this.cards[ 1 ].number && users < maxUsers) {
      buttons.toggleSplit();
    }
  }

  determineOptions( users, maxUsers, balanceTotal ) {
    buttons.toggleStandAndHit();

    if( this.cards.length === 2 && this.bet <= balanceTotal ) {
      this.checkSplit( users, maxUsers );
      this.checkDouble();
    }
  }

  doubleBet( activePlayer ) {
    this.statusDouble = true;
    render.bet( this.bet, activePlayer );
    this.bet = this.bet * 2;
  }

  processDoubleScore( activePlayer ) {
    if( this.aces > 0 && this.netScore > 11 ) {
      this.netScore -= 10;
      render.score( activePlayer );
    }
  }

  removeHTML( obsoleteUser ) {
    render.removeUserHTML( obsoleteUser );
  }

  removeSplitCard( player ) {
    var removedCard;
    removedCard = this.cards[ 1 ];
    this.grossScore = this.grossScore - removedCard.value;
    this.netScore = this.netScore - removedCard.value;

    if(removedCard.number === 'ace' ) {
      this.aces--;
      //adjustment needs to be made to correct for adjustAces function
      this.netScore = this.netScore + 10;
    }

    this.cards.splice( 1, 1 );
    render.removeSplitCard( player );
    return removedCard;
  }

  setBet( bet, activePlayer ) {
    this.bet = bet;
    render.bet( bet, activePlayer );
  }  
}

module.exports = User;
