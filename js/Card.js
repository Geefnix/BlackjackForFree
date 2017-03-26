class Card {
  constructor( specie, number, value ) {
    this.specie = specie;
    this.number = number;
    this.value = value;
    this.src = './icons/' + specie + '-' + number + '.png';
  }
}

module.exports = Card;
