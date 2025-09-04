class Board {

    static board: Board;

    public letters: string[][];

    constructor(sizeX: number, sizeY: number, words: string) {
        this.letters = [];
        const totalSize: number = sizeX * sizeY;

        let uniqueLetters = this.fillArray( totalSize,
                            this.shuffleArray(
                            Array.from(this.getUniqueLetters(words))));

        if (uniqueLetters!.length > sizeX * sizeY) {
            throw new Error("Too many unique letters for board size");
        }

        for (let i = 0; i < sizeY; i++) {
            let array: string[] = [];
            for (let j = 0; j < sizeX; j++) {
                array.push(uniqueLetters.pop()!); 
            }
            this.letters.push(array);
        }

        Board.board = this;
    }

    fillArray(sizeTo: number, array: string[], ): string[] {
        
        let left = sizeTo - array.length;

        for (let i = 0; i < left; i++) {
            const j = Math.floor(Math.random() * (i + 1)); // random index 0..i
            array.push(array[j]!);   // fill with random existing letters
        }
        return array;
    }

    shuffleArray(array: string[]): string[] {
        
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // random index 0..i
            [array[i]!, array[j]!] = [array[j]!, array[i]!];   // swap
        }
        return array;
    }

    getUniqueLetters(words: string): Set<string> {
        const uniqueLetters = new Set<string>();
        for (const char of words) {
            uniqueLetters.add(char);
        }
        return uniqueLetters;
    }
}

class ChessPeice {

    public x: number = 0
    public y: number = 0; 

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    canMove(x: number, y: number): boolean {
        return true;
    }

    move(x: number, y: number): [number, number] | false {
        if (this.canMove(x, y)) {
            this.x = x;
            this.y = y;
            return [this.x, this.y];
        }
        return false;
    }
}

class Knight extends ChessPeice {
    override canMove(x: number, y: number): boolean {
        if (this.x === x + 2 && this.y === y + 1) return true;
        if (this.x === x + 2 && this.y === y - 1) return true;
        if (this.x === x - 2 && this.y === y + 1) return true;
        if (this.x === x - 2 && this.y === y - 1) return true;
        if (this.x === x + 1 && this.y === y + 2) return true;
        if (this.x === x + 1 && this.y === y - 2) return true;
        if (this.x === x - 1 && this.y === y + 2) return true;
        if (this.x === x - 1 && this.y === y - 2) return true;
        return false;
    }
}

export default { Board, ChessPeice, Knight };