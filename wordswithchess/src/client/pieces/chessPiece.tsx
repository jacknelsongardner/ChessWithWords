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
        Game.game = this;

        this.peice = new Knight(0, 0);
        this.width = sixeX;
        this.height = sizeY;
        console.log(`Game created with board size ${sixeX}x${sizeY}`);
        this.wordsToGet = words;
        this.board = new Board(sixeX, sizeY, words.join(''));
        console.table(this.board.letters);

        this.board.shuffleBoard();
        
        this.board.letters.map(row => row.map(letter => letter.toLowerCase()));

        console.log(this.wordsToGet.slice(0, 20));
        
        return this;
        
    }

    resetBoard() {
        this.board.shuffleBoard();
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
            //this.wordsToGet = Game.game.wordsToGet.filter(word => word !== Game.game.currentWord);
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

    
    knightPaths(start: [number, number], pathLength: number): [number, number][][] {
        const rows = this.letters.length;
        const cols = this.letters[0]?.length ?? 0;

        const moves: [number, number][] = [
        [2, 1], [1, 2], [-1, 2], [-2, 1],
        [-2, -1], [-1, -2], [1, -2], [2, -1]
        ];

        const paths: [number, number][][] = [];

        const isValid = (x: number, y: number, visited: [number, number][]) => {
            if (x >= 0 && x < rows && y >= 0 && y < cols ) {
                
                var letter = this.letters[x]?.[y];
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

    shuffleBoard() {
        // shuffle words
        var wordsToShuffle = this.shuffleArray(Game.game.wordsToGet.map(word => !Game.game.wordsGot.includes(word) ? word : ""));
        console.log("Shuffle words: " + wordsToShuffle.join(", "));

        for (var word of wordsToShuffle) {
            console.log(word);

            if (word.length === 0) continue; // skip found words
            var randomX = Math.floor(Math.random() * this.letters.length);
            var randomY = Math.floor(Math.random() * (this.letters[0]?.length ?? 1));

            var paths = this.knightPaths([randomX, randomY], word.length);
            
            if (paths.length === 0) {
                console.log("No paths found for word " + word);
                continue;
            }

            var path = paths[Math.floor(Math.random() * paths.length)];

            console.log("Path for word " + word + ": " + path?.toString());

            word = word.toUpperCase();

            for (var i = 0; i < word.length; i++) {
                this.letters[path![i]![0]]![path![i]![1]] = word[i]!;
            }
        }

        console.table(this.letters);
        this.resetRightArray();

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

            Game.game.currentWord += Game.game.board.letters[x]?.[y]?.toLowerCase() ?? "";
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