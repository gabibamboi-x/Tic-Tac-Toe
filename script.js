(function() {

  // factory function for creating players
  const Player = (name, template) => {
    return {name, template}
  }

  // cache DOM
  const startingPage = document.querySelector('.welcome')
  const nameP1 = document.querySelector('#player1')
  const wrapper = startingPage.nextElementSibling
  const updateTab = wrapper.firstElementChild
  const nameP2 = nameP1.nextElementSibling
  const playBtn = startingPage.lastElementChild
  const alertMissing = playBtn.previousElementSibling
  
  const players = []

  const displayController = (function(){

    // bind events
    playBtn.addEventListener('click', prepareGame)
    window.addEventListener('keydown', clickBtn)
    nameP1.addEventListener('input', animate)
    nameP2.addEventListener('input', animate)

    function animate() {
      if (nameP1.checkValidity() && nameP2.checkValidity()) {
        playBtn.style.boxShadow = 'inset 200px 0 0 green'
        alertMissing.textContent = ''
      } else {
        playBtn.style.boxShadow = 'inset 0 0 0 white'
      }
    }

    function prepareGame() {
      // reset the players by emptying the array
      players.splice(0, players.length)

      // check for valid names
      if (nameP1.checkValidity() && nameP2.checkValidity()) {
        switchDisplay()
        // add the players name to the array for later use
        players.push(Player(nameP1.value, 'X'), Player(nameP2.value, 'O'))
        updateTab.textContent = players[0].name + '\'s turn'
      } else {
        alertMissing.textContent = 'Please enter your names!'
      }
    }

    // add ability to start the game by pressing 
    function clickBtn(event) { 
      if (event.key === 'Enter') {
        playBtn.click()
      }
    }

    // switch the wrapper with the starting page by swapping their 
    // z-index and thr visibility
    function switchDisplay() {
      playBtn.style.display = 'none'
      alertMissing.textContent = ''
      wrapper.style.display = 'flex'
      startingPage.style.display = 'none'
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
      this.home = this.mainBoard.nextElementSibling.firstElementChild
      this.reset = this.home.nextElementSibling
    },

    // bind events 
    bindEvents: function(){
      this.addSelection = this.registerMove.bind(this)
      this.mainBoard.addEventListener('click', this.addSelection, false)
      this.home.addEventListener('click', this.backToStartingPage.bind(this), false)
      this.reset.addEventListener('click', this.resetBoard.bind(this), false)
      window.addEventListener('keydown', this.keyboardActions.bind(this))
    },

    render: function(){
      let i = 0
      this.piece.forEach(el => {
        el.innerHTML = this.gameboard[i]
        i++
      })
    },

    registerMove: function(event){
      const selection = event.target.id
      const pieceStatus = event.target.innerHTML

      // check for whose turn it is and if the piece is empty
      if (turn === 1 && pieceStatus === '') {
        event.target.innerHTML = players[0].template
        // add the new selection to the board and update the banner with info
        this.gameboard[selection] = players[0].template
        updateTab.textContent = players[1].name + '\'s turn'
        this.checkWinner()
        turn = 2
      } else if (turn === 2 && pieceStatus === '') {
        event.target.innerHTML = players[1].template
        this.gameboard[selection] = players[1].template
        updateTab.textContent = players[0].name + '\'s turn'
        this.checkWinner()
        turn = 1
      }
    },

    backToStartingPage: function() { 
      playBtn.style.display = ''
      startingPage.style.display = ''
      wrapper.style.display = 'none'
      this.resetBoard()
    },

    resetBoard: function(){
      for (let i = 0; i < 9; i++) {
          this.gameboard[i] = ''
        }
      turn = 1
      updateTab.textContent = players[0].name + '\'s turn'
      updateTab.style.backgroundColor = ''
      this.mainBoard.addEventListener('click', this.addSelection, false)
      this.render()
    },

    checkWinner: function(){ 
      const winCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ]

      let winStatus = false
      // alert the winner
      for (let x = 0; x < 8; x++) {
        if (this.gameboard[winCombos[x][0].toString()] === this.gameboard[winCombos[x][1].toString()] && 
            this.gameboard[winCombos[x][1].toString()] === this.gameboard[winCombos[x][2].toString()] && 
            this.gameboard[winCombos[x][1].toString()] !== '') {
          this.alertWinner(this.gameboard[winCombos[x][0]])
          winStatus = true
        }
      }

      // Tie
      if (!this.gameboard.includes('') && winStatus === false){
        updateTab.textContent ='...'

        function update(){
          updateTab.style.backgroundColor = 'green'
          updateTab.textContent ='It\'s a tie!'
        }

        setTimeout(update, 750)
      }
    },

    alertWinner: function(x){
      if (x === 'X') {
        updateTab.textContent = players[0].name.toUpperCase() + ' WON THE GAME'
        this.mainBoard.removeEventListener('click', this.addSelection, false)
      } else {
        updateTab.textContent = players[1].name.toUpperCase() + ' WON THE GAME'
        this.mainBoard.removeEventListener('click', this.addSelection, false)
      }
      updateTab.style.backgroundColor = 'green'
    },

    keyboardActions: function(event){
      if (event.key === 'Escape'){
        this.backToStartingPage()
      } else if (event.key === 'r') {
        this.resetBoard()
      }
    }
  }

  gameBoard.init()

})()