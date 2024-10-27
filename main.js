class Game {
    constructor(height, width, consecutiveMarksToWin, players) {
        this.height = height;
        this.width = width;
        this.consecutiveMarksToWin = consecutiveMarksToWin;
        this.players = players;
        this.playerCount = this.players.length;
        this.round = 0;
        this.currentTurnBar = document.createElement('div');
        this.currentTurnBar.classList.add('currentTurnBar');
        this.currentTurnBar.innerHTML = this.players[0];
        document.body.appendChild(this.currentTurnBar);
        this.buildBoard();
        this.gameState = 'running';
    }
    
    buildBoard(){
        const board = document.createElement('div');
        board.classList.add('board');
        board.style.gridTemplateColumns = `repeat(${this.width}, 1fr`;
        board.style.gridTemplateRows = `repeat(${this.height}, 1fr`;
        const cellObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {
                const cellSize = entry.contentRect.width;
                entry.target.style.fontSize = `${cellSize * 0.75}px`; 
                if (cellSize > 50) {
                    board.style.maxWidth = `${50 * this.width}px`;
                }
            });
        });

        let grid = [];
        for (let i = 0; i < this.height; i++) {
            grid[i] = [];
            for (let j = 0; j < this.width; j++){
                const cell = document.createElement('div');
                cell.dataset.x = j;
                cell.dataset.y = i;
                cell.classList.add('cell');
                cellObserver.observe(cell);
                board.appendChild(cell);
                grid[i][j] = cell;
            }   
        }

        board.addEventListener('click', (event) => this.cellClicked(event));
        document.body.appendChild(board);
        this.boardElement = board;
        this.grid = grid;
    }

    boardWipe(){
        this.boardElement.remove();
        this.currentTurnBar.remove();
    }

    cellClicked(event){
        const cell = event.target;
        if (this.gameState == 'running' && cell.classList.contains('cell') && !this.isSomethingOrSameSymbol(cell)){ 
            this.advanceGame(cell);
        }
    }

    advanceGame(updatedCell){
        const lastPosition = {x: parseInt(updatedCell.dataset.x, 10), y: parseInt(updatedCell.dataset.y, 10)};
        const enoughRounds = this.round >= this.playerCount * (this.consecutiveMarksToWin - 1);
        updatedCell.innerHTML = this.currentTurnBar.innerHTML;
        if (enoughRounds && this.checkWin(this.currentTurnBar.innerHTML, lastPosition)){
            this.endGame(`${this.currentTurnBar.innerHTML} WINS`);
            return;
        }
        this.round++;
        this.currentTurnBar.innerHTML = this.players[this.round % this.playerCount];
        if (this.round >= this.width * this.height) {
            this.endGame('DRAW');
        }
    }

    endGame(message){
        this.currentTurnBar.innerHTML = message;
        this.gameState = message;
        this.boardElement.classList.add('stop-hover');
    }

    checkWin(lastPlayerSymbol, lastPosition){

        let shiftFunctions = [];
        shiftFunctions[0] = (position, distance) => ({x: position.x + distance, y: position.y});
        shiftFunctions[1] = (position, distance) => ({x: position.x, y: position.y + distance});
        shiftFunctions[2] = (position, distance) => ({x: position.x + distance, y: position.y - distance});
        shiftFunctions[3] = (position, distance) => ({x: position.x + distance, y: position.y + distance});
        for (let i = 0; i < 4; i++){
            const consecutive = this.getConsecutiveCells(lastPlayerSymbol, lastPosition, shiftFunctions[i]);
            console.log(consecutive);
            if (consecutive.length >= this.consecutiveMarksToWin){
                for (let j = 0; j < consecutive.length; j++){
                    consecutive[j].classList.add('winningCell');
                }
                return true;
            }
        }
        return false;
    }

    getConsecutiveCells(symbol, position, shift){
        let consecutive = [];
        let right = shift(position, 1);
        let left = shift(position, -1);
        consecutive.push(this.getCellElement(position));

        while (true){
            const validRight = this.inBounds(right) && this.getCell(right) == symbol;
            const validLeft = this.inBounds(left) && this.getCell(left) == symbol;
            if (validRight){
                consecutive.push(this.getCellElement(right));
                right = shift(right, 1);
            }
            if (validLeft){
                consecutive.push(this.getCellElement(left));
                left = shift(left, -1)
            }
            if (!validLeft && !validRight){
                break;
            }
        }
        return consecutive;
    }

    inBounds(position){
        return !(position.x >= this.width || position.x < 0 || position.y >= this.height || position.y < 0);
    }

    getCell(position){
        return this.grid[position.y][position.x].innerHTML;
    }

    getCellElement(position){
        return this.grid[position.y][position.x];
    }

    isSomethingOrSameSymbol(cell){
        return cell.innerHTML || cell.innerHTML == (this.players[this.round % this.playerCount]);
    }

    updateCell(position, symbol){
        this.grid[position.y][position.x].innerHTML = symbol;
    }
}
 
let game = null;

const widthInput = document.querySelector('#width-input');
const heightInput = document.querySelector('#height-input');
const conInput = document.querySelector('#con-input');
const playerInput = document.querySelector('#player-input');
const setButton = document.querySelector('#set-button');

setButton.addEventListener('click', setGame);

function setGame(event){
    const width = parseInt(widthInput.value, 10);
    const height = parseInt(heightInput.value, 10);
    const con = parseInt(conInput.value, 10);

    let inputString = playerInput.value.trim().split(/\s+/);

    
    
    if (!(isNaN(width) || isNaN(height) || isNaN(con) || width < 3 || height < 3 || con < 3 || inputString.length < 2 || checkInvalidPlayers(inputString))){
        if (game != null){
            game.boardWipe();

        }
        game = new Game(height, width, con, inputString);
    }

}


function checkInvalidPlayers(string){
    for (let i = 0; i < string.length; i++){
        if (string[i].length != 1){
            return true;
        }
    }
    return false;
}