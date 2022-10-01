(function() {

  let turn = 1

  const Player = (name, template) => {
    return {name, template}
  }

  
  const displayController = (function(){
    let currentSelection;

    // cache DOM
    const startingPage = document.querySelector('.welcome')
    const gameMode = document.querySelectorAll('.selectionButton')
    const nameP1 = document.querySelector('#player1')
    const nameP2 = nameP1.nextElementSibling
    const playBtn = startingPage.lastChild.previousSibling
    const alertMissing = playBtn.previousSibling.previousSibling

    // bind events
    gameMode.forEach(el => (el.addEventListener('click', modeSelection)))
    playBtn.addEventListener('click', prepareGame)

    function modeSelection(event) {
      if (event.target.id === '2P') {
        nameP1.style.display = 'flex'
        nameP2.style.display = 'flex'
        currentSelection = '2P'
      } else {
        nameP1.style.display = 'flex'
        nameP2.style.display = 'none'
        currentSelection = 'AI'
      }
    }

    function prepareGame() {
      if (!currentSelection) {
        alertMissing.textContent = 'Select a game mode!'
      } else if (currentSelection === '2P' && nameP1.checkValidity() 
        && nameP2.checkValidity()) {
        alertMissing.textContent = ''
        return {
          player1: Player(nameP1.value, 'X'),
          player2: Player(nameP2.value, 'O')
        }
      } else if (currentSelection === 'AI' && nameP1.checkValidity()) {
        alertMissing.textContent = ''
        return {
          player1: Player(nameP1.ariaValueMax, 'X'),
          player2: 'AI'
        }
      } else {
      alertMissing.textContent = 'Please enter your name!'
      }
    }


  })()

  const gameBoard = (function(){

    const players = []
    const gameboard = ['', '', '', '', '', '', '', '', '']

    //cache DOM
    const mainBoard = document.querySelector('.main-board')
    const piece = mainBoard.querySelectorAll('.selection')

    // bind events 
    mainBoard.addEventListener('click', addSelection)

    function render(){
      let i = 0
      piece.forEach(el => {
        el.innerHTML = gameboard[i]
        i++
      });
    }

    function addSelection(event){
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
    }

    return {
      render: render
    }
  })()

  gameBoard.render()

})()