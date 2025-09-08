import { getUniqueLetters, shuffleArray, fillArray } from "./arrayHelper";


class Board {

    public content: string[][];

    constructor(sizeX: number, sizeY: number, words: string) {
        this.content = [];
        
        const totalSize: number = sizeX * sizeY;

        let uniqueLetters = fillArray( totalSize,
                            shuffleArray(
                            Array.from(getUniqueLetters(words))));

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
            this.content.push(array);
        }

    }

    shuffle(wordsToShuffle: string[]): string[] {
        // shuffle words
        
        console.log("Shuffle words: " + wordsToShuffle.join(", "));
        var wordsShuffled: string[] = []

        for (var word of wordsToShuffle) {
            console.log(word);

            if (word.length === 0) continue; // skip found words
            var randomX = Math.floor(Math.random() * this.content.length);
            var randomY = Math.floor(Math.random() * (this.content[0]?.length ?? 1));

            var paths = this.knightPaths([randomX, randomY], word.length);
            
            if (paths.length === 0) {
                console.log("No paths found for word " + word);
                continue;
            }

            var path = paths[Math.floor(Math.random() * paths.length)];

            console.log("Path for word " + word + ": " + path?.toString());

            word = word.toUpperCase();

            for (var i = 0; i < word.length; i++) {
                this.content[path![i]![0]]![path![i]![1]] = word[i]!;
            }

            wordsShuffled.push(word);

        }

        console.table(this.content);

        return wordsShuffled;
    }



    knightPaths(start: [number, number], pathLength: number): [number, number][][] {
        const rows = this.content.length;
        const cols = this.content[0]?.length ?? 0;

        const moves: [number, number][] = [
        [2, 1], [1, 2], [-1, 2], [-2, 1],
        [-2, -1], [-1, -2], [1, -2], [2, -1]
        ];

        const paths: [number, number][][] = [];

        const isValid = (x: number, y: number, visited: [number, number][]) => {
            if (x >= 0 && x < rows && y >= 0 && y < cols ) {
                
                var letter = this.content[x]?.[y];
                var upperLetter = letter?.toUpperCase();
                if (letter != upperLetter &&
                    !visited.some(([vx, vy]) => vx === x && vy === y)) {
                    console.log("valid move")
                    return true;
                }
                console.log("invalid move")
                return false;
            }

            return false;
        };

        const backtrack = (x: number, y: number, visited: [number, number][]) => {
            console.log(`Backtracking at (${x}, ${y}), visited: ${visited.length}`);

            if (visited.length === pathLength) {
                console.log(`Found path: ${JSON.stringify(visited)}`);

                paths.push([...visited]);
                return;
            }

            for (const [dx, dy] of moves) {
                const nx = x + dx;
                const ny = y + dy;
                if (isValid(nx, ny, visited)) {
                visited.push([nx, ny]);
                backtrack(nx, ny, visited);
                visited.pop(); // backtrack
                }
            }
        };

        console.log(`Starting knightPaths from (${start[0]}, ${start[1]}) for length ${pathLength}`);
        if (isValid(start[0], start[1], [])) {
            console.log(paths); 
            console.log("Starting position is valid");
            backtrack(start[0], start[1], [start]);
        }

        console.log(paths);
        return paths;
    }

}

class ChessPeice {

    public x: number = 0
    public y: number = 0; 
    public onPeiceMove: () => any;

    constructor(x: number, y: number, onPeiceMove: () => any) {
        this.x = x;
        this.y = y;
        this.onPeiceMove = onPeiceMove;
    }

    canMove(x: number, y: number): boolean {
        return true;
    }

    move(x: number, y: number): [number, number] | false {
        if (this.canMove(x, y)) {
            this.x = x;
            this.y = y;
            console.log("moved");
            this.onPeiceMove(); 

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


class Game {

    static game: Game; // singleton instance 

    public board: Board;
    public peice: ChessPeice;
    public width: number = 0;
    public height: number = 0;

    public theme: string = "pets"; // future use

    public wordsToGet: string[] = [];
    public wordsGot: string[] = [];
    public currentWord: string = "";
    public possibleWords: string[] = [];

    public wordsOnBoard: string[] = [];


    constructor(words: string[], sizeX: number, sizeY: number) {
        Game.game = this;

        this.wordsToGet = words;
        this.board = new Board(sizeX, sizeY, words.join(''));
        this.peice = new Knight(0,0, this.onPlayerPeiceMove.bind(this));
        this.resetBoard();
        console.log(this.wordsToGet.slice(0, 20));
        
        return this;
        
    }

    onPlayerPeiceMove() {

        this.currentWord += this.board.content[this.peice.x]?.[this.peice.y]?.toLowerCase() ?? "";
        this.filterPossibleWords();
    
        console.log("Possible words: " + this.possibleWords.join(", "));
        console.log("Words on board: " + this.wordsOnBoard.join(", "));
        console.log("Words to get: " + this.wordsToGet.join(", "));  


        console.log("Current word: " + this.currentWord);

    }

    resetBoard() {


        this.wordsOnBoard = [];

        var wordsToShuffle = shuffleArray(Game.game.wordsToGet.map(word => !Game.game.wordsGot.includes(word) ? word : ""))
        
        this.wordsOnBoard = this.board.shuffle(wordsToShuffle);

        this.currentWord = "";

        this.possibleWords = this.possibleWords.map(word => word.toLowerCase());
        this.wordsOnBoard = this.wordsOnBoard.map(word => word.toLowerCase());
        this.wordsToGet = this.wordsToGet.map(word => word.toLowerCase());
        this.wordsGot = this.wordsGot.map(word => word.toLowerCase());
        
        this.board.content = this.board.content.map(row => row.map(letter => letter.toLowerCase()));
        
    }

    testNextBoard() {

        if (this.testWin()) {
            alert("You win!");
            return;
        }

        if (this.wordsOnBoard.length === 0) {
            alert("You win!");
            return;
        }

    
    }

    testWin(): boolean {
        return this.wordsToGet.length === this.wordsGot.length;
    }

    filterPossibleWords(recursion: boolean = false) {
        console.log(this.currentWord)
        this.possibleWords = this.wordsOnBoard.filter(word => word.startsWith(this.currentWord) && !this.wordsGot.includes(word));
        
        // if no possible words, reset current word
        if (this.possibleWords.length === 0 && !recursion) {

            if (this.currentWord.length > 1) {
                console.log("Trying to minimize current word to see possible strings")
                
                const splitArr = this.currentWord.split("");
                splitArr.shift()!;
                this.currentWord = splitArr.join("")


                this.filterPossibleWords();
            } 
            else {

                console.log("No possible words. Resetting current word to: " + Game.game.wordsGot)
                this.currentWord = "";

                this.filterPossibleWords(true); // avoid infinite recursion

                this.currentWord = Game.game.board.content[this.peice.x]?.[this.peice.y] ?? "";
                
            }

        } 
        
        else if (this.possibleWords.includes(Game.game.currentWord)) {
            console.log("found word: " + Game.game.currentWord)
            this.wordsGot.push(Game.game.currentWord);
            


            if (Game.game.wordsOnBoard.length === 0) {
                alert("You win!");
                this.testNextBoard();

            } else {
                alert("You found a word! Words left: " + Game.game.wordsToGet.join(", "));
                
            }
        }
    }

}

export { Board, ChessPeice, Knight, Game };