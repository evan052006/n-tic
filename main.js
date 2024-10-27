class Game {
    constructor(height, width, consecutiveMarksToWin) {
        this.height = height;
        this.width = width;
        this.consecutiveMarksToWin = consecutiveMarksToWin;
        this.players = ['X', 'O'];
        this.playerCount = 2;
        this.round = 0;
        this.buildBoard();
        this.currentTurnBar = document.createElement('h1');
        this.currentTurnBar.innerHTML = this.players[0];
        document.body.appendChild(this.currentTurnBar);
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

    cellClicked(event){
        const cell = event.target;
        if (this.gameState == 'running' && cell.classList.contains('cell') && !this.isEmptyOrSameSymbol(cell)){ // means empty
            this.advanceGame(cell);
        }
    }

    advanceGame(updatedCell){
        const lastPosition = {x: parseInt(updatedCell.dataset.x, 10), y: parseInt(updatedCell.dataset.y, 10)};
        updatedCell.innerHTML = this.currentTurnBar.innerHTML;
        const enoughRounds = this.round >= this.playerCount * (this.consecutiveMarksToWin - 1);
        if (enoughRounds && this.checkWin(this.currentTurnBar.innerHTML, lastPosition)){
            this.gameState = `${this.currentTurnBar} WINS :>`;
        }
        else if (this.round >= this.width * this.height) {
            this.gameState = 'Draw :/';
        }
        this.round++;
        this.currentTurnBar.innerHTML = this.players[this.round % this.playerCount];

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

    isEmptyOrSameSymbol(cell){
        return cell.innerHTML || cell.innerHTML == (this.players[this.round % this.playerCount]);
    }

    updateCell(position, symbol){
        this.grid[position.y][position.x].innerHTML = symbol;
    }
}
 
const game = new Game(11, 11, 5);

