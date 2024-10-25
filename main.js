

class Game {
    constructor(height, width, consecutiveMarksToWin) {
        this.height = height;
        this.width = width;
        this.consecutiveMarksToWin = consecutiveMarksToWin;
        this.player1 = 'X';
        this.player2 = 'O';
        let emptyGrid = [];
        for (let i = 0; i < height; i++){
            emptyGrid[i] = [];
            for (let j = 0; j < width; j++){
                emptyGrid[i][j] = "";
            }
        }
        this.grid = emptyGrid;
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
        let currentConsecutive = 1
        let right = shift(position, 1)
        let left = shift(position, -1)
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
        return this.grid[position.y][position.x];
    }
}
 

