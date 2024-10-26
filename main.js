class Game {
    constructor(height, width, consecutiveMarksToWin) {
        this.height = height;
        this.width = width;
        this.consecutiveMarksToWin = consecutiveMarksToWin;
        this.player1 = 'X';
        this.player2 = 'O';
        this.buildBoard();
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
                cell.classList.add('cell');
                cellObserver.observe(cell);
                board.appendChild(cell);
                grid[i][j] = cell;
            }   
        }


        document.body.appendChild(board);
        this.boardElement = board;
        this.grid = grid;
    }


    checkWin(lastPlayerSymbol, lastPosition){
        const shiftHorizontal = (position, distance) => ({x: position.x + distance, y: position.y});
        const shiftVertical = (position, distance) => ({x: position.x, y: position.y + distance});
        const shiftDiagonalUp = (position, distance) => ({x: position.x + distance, y: position.y - distance});
        const shiftDiagonalDown = (position, distance) => ({x: position.x - distance, y: position.y + distance});
        const checkHorizontal = this.checkConsecutiveMarks(lastPlayerSymbol, lastPosition, shiftHorizontal);
        const checkVertical = this.checkConsecutiveMarks(lastPlayerSymbol, lastPosition, shiftVertical);
        const checkDiagonalUp = this.checkConsecutiveMarks(lastPlayerSymbol, lastPosition, shiftDiagonalUp);
        const checkDiagonalDown = this.checkConsecutiveMarks(lastPlayerSymbol, lastPosition, shiftDiagonalDown);
        return checkHorizontal || checkVertical || checkDiagonalUp || checkDiagonalDown;
    }

    checkConsecutiveMarks(symbol, position, shift){
        let currentConsecutive = 1;
        let right = shift(position, 1);
        let left = shift(position, -1);
        while (true){
            const validRight = this.inBounds(right) && this.getCell(right) == symbol;
            const validLeft = this.inBounds(left) && this.getCell(left) == symbol;
            if (validRight){
                right = shift(right, 1);
                currentConsecutive++;
            }
            if (validLeft){
                left = shift(left, -1)
                currentConsecutive++;
            }
            if (!validLeft && !validRight){
                break;
            }
        }
        return this.consecutiveMarksToWin <= currentConsecutive;
    }

    inBounds(position){
        return position.x >= this.width || position.x < 0 || position.y >= this.height || position.y < 0;
    }

    getCell(position){
        return this.grid[position.y][position.x].innerHTML;
    }

    updateCell(position, symbol){
        this.grid[position.y][position.x].innerHTML = symbol;
    }
}
 
const game = new Game(25, 25, 3);
for (let i = 0; i < game.width; i++){
    game.updateCell({x: i, y: i}, 'O');
}
