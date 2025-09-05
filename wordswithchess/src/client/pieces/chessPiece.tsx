//const wordlist = require('wordlist-english');
//const allWords: string[] = wordlist['english'];

class Game {

    
    static game: Game; // singleton instance 
    public board: Board = new Board(0, 0, '');
    public peice: ChessPeice = new ChessPeice(0, 0);
    public width: number = 0;
    public height: number = 0;

    public theme: string = "🐶 Pets 🐈"; // future use

    public wordsToGet: string[] = [];
    public wordsGot: string[] = [];
    public currentWord: string = "";
    public possibleWords: string[] = [];


    constructor(sixeX: number, sizeY: number, words: string[]) {
        
        this.board = new Board(sixeX, sizeY, words.join(''));
        this.peice = new Knight(0, 0);
        this.width = sixeX;
        this.height = sizeY;
        console.log(`Game created with board size ${sixeX}x${sizeY}`);
        this.wordsToGet = words;
        
        console.log(this.wordsToGet.slice(0, 20));
        Game.game = this;
        return this;
        
    }

    filterPossibleWords(recursion: boolean = false) {
        console.log(this.currentWord)
        this.possibleWords = this.wordsToGet.filter(word => word.startsWith(this.currentWord));
        // if no possible words, reset current word
        if (this.possibleWords.length === 0 && !recursion) {
            this.currentWord = "";
            this.board.resetRightArray();

            this.filterPossibleWords(true); // avoid infinite recursion

            this.currentWord = Game.game.board.letters[this.peice.x]?.[this.peice.y] ?? "";
            
        }

        // 
        if (this.possibleWords.includes(Game.game.currentWord)) {

            this.wordsGot.push(Game.game.currentWord);
            this.wordsToGet = Game.game.wordsToGet.filter(word => word !== Game.game.currentWord);
            this.currentWord = "";
            this.board.resetRightArray();

            if (Game.game.wordsToGet.length === 0) {
                alert("You win!");

            } else {
                alert("You found a word! Words left: " + Game.game.wordsToGet.join(", "));
                
            }
        }
    }
}

class Board {

    public letters: string[][];
    public lettersRight: boolean[][];

    constructor(sizeX: number, sizeY: number, words: string) {
        this.letters = [];
        this.lettersRight = [];
        
        const totalSize: number = sizeX * sizeY;

        let uniqueLetters = this.fillArray( totalSize,
                            this.shuffleArray(
                            Array.from(this.getUniqueLetters(words))));

        if (uniqueLetters!.length > sizeX * sizeY) {
            throw new Error("Too many unique letters for board size");
        }

        for (let i = 0; i < sizeY; i++) {
            let array: string[] = [];
            let arrayRight: boolean[] = [];
            for (let j = 0; j < sizeX; j++) {
                array.push(uniqueLetters.pop()!); 
                arrayRight.push(false);
            }
            this.letters.push(array);
            this.lettersRight.push(arrayRight);
        }
    }

    fillArray(sizeTo: number, array: string[], ): string[] {
        
        let left = sizeTo - array.length;

        for (let i = 0; i < left; i++) {
            const j = Math.floor(Math.random() * (i + 1)); // random index 0..i
            array.push(array[j]!);   // fill with random existing letters
        }
        return array;
    }

    resetRightArray() {
        this.lettersRight = this.letters.map(row => row.map(_ => false));
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

            Game.game.currentWord += Game.game.board.letters[x]?.[y] ?? "";
            Game.game.filterPossibleWords();
            
            if (Game.game.possibleWords.length > 0) { 
                console.log("Possible words: " + Game.game.possibleWords.join(", "));
                Game.game.board.lettersRight[x]![y] = true;
            }

            console.log("Current word: " + Game.game.currentWord);

            return [this.x, this.y];
            
        }
        return false;
    }
}

class Knight extends ChessPeice {
    override canMove(x: number, y: number): boolean {

        console.log(`Knight move from (${this.x}, ${this.y}) to (${x}, ${y})`);
        let response: boolean = false;
        
        if (x === this.x + 2 && y === this.y + 1) response = true;
        if (x === this.x + 2 && y === this.y - 1) response = true;
        if (x === this.x - 2 && y === this.y + 1) response = true;
        if (x === this.x - 2 && y === this.y - 1) response = true;
        if (x === this.x + 1 && y === this.y + 2) response = true;
        if (x === this.x + 1 && y === this.y - 2) response = true;
        if (x === this.x - 1 && y === this.y + 2) response = true;
        if (x === this.x - 1 && y === this.y - 2) response = true;

        console.log(`Knight move valid: ${response}`);

        return response;
    }
}

export { Board, ChessPeice, Knight, Game };