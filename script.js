(function() {

  const Player = (name, template) => {
    return {name, template}
  }


  let turn = 1

  const gameboard = ['', '', '', '', '', '', '', '', '']
  const gameBoard = {
    init: function(){
      this.cacheDOM()
      this.bindEvents()
      this.render()
    },

    cacheDOM: function(){
      this.mainBoard = document.querySelector('.main-board')
      this.piece = this.mainBoard.querySelectorAll('.selection')
    },

    render: function(){
      let i = 0
      this.piece.forEach(el => {
        el.innerHTML = gameboard[i]
        i++
      });
    },

    bindEvents: function(){
      this.mainBoard.addEventListener('click', this.addSelection)
    },

    addSelection: function(event){
      const selection =  event.target.id
      const pieceStatus = event.target.innerHTML

      if (turn === 1 && pieceStatus === '') {
        event.target.innerHTML = 'X'
        gameboard[selection] = 'X'
        turn = 2
      } else if (turn === 2 && pieceStatus === '') {
        event.target.innerHTML = 'O'
        gameboard[selection] = 'O'
        turn = 1
      }
    },
  }

  gameBoard.init()

})()