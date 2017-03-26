var render = require('./render.js');

class Balance {
  constructor( start ) {
    this.total = start;
    render.balance( this.total );
  }

  insufficientFunds() {
    if( this.total < 25 ) {
      return true;
    }
  }

  reduce( bet ) {
    this.total -= bet;
    render.balance( this.total );
  }

  procesResult( user ) {
    this.total =  this.total + user.bet * user.result[ 1 ];
    render.balance( this.total );
  }

  set( amount ) {
    this.total = amount;
    render.balance( this.total );
  }
}

module.exports = Balance;
