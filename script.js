(function() {

  // factory function for creating players
  const Player = (name, template) => {
    return {name, template}
  }

  // cache DOM
  const startingPage = document.querySelector('.welcome')
  const gameMode = document.querySelectorAll('.selectionButton')
  const nameP1 = document.querySelector('#player1')
  const wrapper = startingPage.nextElementSibling
  const nameP2 = nameP1.nextElementSibling
  const playBtn = startingPage.lastElementChild
  const alertMissing = playBtn.previousElementSibling
  
  const players = []

  const displayController = (function(){
    let currentSelection;

    // bind events
    gameMode.forEach(el => (el.addEventListener('click', modeSelection)))
    playBtn.addEventListener('click', prepareGame)

    function modeSelection(event) {
      // check for selected mode and ask for names
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
      // reset the players by emptying the array
      players.splice(0, players.length)

      // currentSelection will be available as soon as the user
      // selects a mode, if there hasn't been one selected and error is shown
      if (!currentSelection) {
        alertMissing.textContent = 'Select a game mode!'
        // the mode has to be 2P and both name input valid to continue
      } else if (currentSelection === '2P' && nameP1.checkValidity() 
        && nameP2.checkValidity()) {
        switchDisplay()
        // add the players name to the array for later use
        players.push(Player(nameP1.value, 'X'), Player(nameP2.value, 'O'))
        // for the ai mode only one name is required
      } else if (currentSelection === 'AI' && nameP1.checkValidity()) {
        switchDisplay()
        players.push(Player(nameP1.value, 'X'), Player('AI', 'O'))
      } else {
      alertMissing.textContent = 'Please enter your name!'
      }
    }

    // swap the wrapper with the starting page by swapping their 
    // z-index and thr visibility
    function switchDisplay() {
      alertMissing.textContent = ''
      wrapper.style.visibility = 'visible'
      wrapper.style.zIndex = '1'
      startingPage.style.visibility = 'hidden'
      startingPage.style.zIndex = '-1'
    }
  })()



  let turn = 1
  const gameBoard = {

    gameboard: ['', '', '', '', '', '', '', '', ''],

    init: function(){
      this.cacheDOM()
      this.bindEvents()
      this.render()
    },

    //cache DOM
    cacheDOM: function(){
      this.mainBoard = document.querySelector('.main-board')
      this.piece = this.mainBoard.querySelectorAll('.selection')
      this.updateTab = this.mainBoard.previousElementSibling
      this.home = this.mainBoard.nextElementSibling.firstElementChild
      this.reset = this.home.nextElementSibling
    },

    // bind events 
    bindEvents: function(){
      this.mainBoard.addEventListener('click', this.addSelection.bind(this), false)
      this.home.addEventListener('click', this.backToStartingPage)
      this.reset.addEventListener('click', this.resetBoard.bind(this), false)
    },

    render: function(){
      let i = 0
      this.piece.forEach(el => {
        el.innerHTML = this.gameboard[i]
        i++
      });
    },

    addSelection: function(event){
      const selection =  event.target.id
      const pieceStatus = event.target.innerHTML

      // check for whose turn it is and if the piece is empty
      if (turn === 1 && pieceStatus === '') {
        event.target.innerHTML = players[0].template
        // add the new selection to the board and update the banner with info
        this.gameboard[selection] = players[0].template
        this.updateTab.textContent = players[1].name + '\'s turn'
        turn = 2
      } else if (turn === 2 && pieceStatus === '') {
        event.target.innerHTML = players[1].template
        this.gameboard[selection] = players[1].template
        this.updateTab.textContent = players[0].name + '\'s turn'
        turn = 1
      }
    },

    resetBoard: function(){
      for (let i = 0; i < 9; i++){
        this.gameboard[i] = ''
      };
      turn = 1
      this.updateTab.textContent = players[0].name + '\'s turn'
      this.render()
    },

    backToStartingPage: function() {
      wrapper.style.visibility = 'hidden'
      wrapper.style.zIndex = '-1'
      startingPage.style.visibility = 'visible'
      startingPage.style.zIndex = '1'
    }
  }

  gameBoard.init()

})()