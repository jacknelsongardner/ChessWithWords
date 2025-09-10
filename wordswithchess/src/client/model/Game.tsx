import { shuffleArray} from "./ArrayHelper";
import {Board} from "./Board"
import {ChessPeice} from "./ChessPeice"
import {Knight} from "./Knight"

class Game {


    static game: Game; // singleton instance 

    public board: Board;
    public peice: ChessPeice;
    public width: number = 0;
    public height: number = 0;

    public timeLeft: number = 0;

    public theme: string = "pets"; // future use

    public wordsToGet: string[] = [];
    public wordsGot: string[] = [];
    public currentWord: string = "";
    public possibleWords: string[] = [];

    public penalty: number = 0;

    public wordsOnBoard: string[] = [];
    public ticking: boolean = false;

    constructor(words: string[], sizeX: number, sizeY: number) {
        Game.game = this;
        this.ticking = true;
        this.wordsToGet = words;
        this.board = new Board(sizeX, sizeY, words.join(''));
        this.peice = new Knight(0,0, this.onPlayerPeiceMove.bind(this));
        this.resetBoard();
        console.log(this.wordsToGet.slice(0, 20));
        
        this.timeLeft = words.length * 10;


        const timer = setInterval(() => {

            console.log("tick");
        }, 1000);

        return this;
        
    }

    timerTick(): boolean {
        if (this.timeLeft > 0 && this.ticking) {
            this.timeLeft--;
            return true;
        } 

        return false;
    }

    testEnd(): boolean {
        var end = false;

        if (this.timeLeft <= 0) {
            end = true;
        }else if (this.allFound()){
            end = true;
        }

        if (end) { this.ticking = false; }
        
        return end;
    }

    calculateScore(): number {
        var score = 0;

        for( const word of this.wordsGot) {
            for (const letter of word) {
                score += 10;
            }
        }

        score += 5 * this.timeLeft;

        return score;
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

        if (this.allFound()) {
            alert("You win!");
            return;
        }

        if (this.wordsOnBoard.length === 0) {
            alert("You win!");
            return;
        }

    
    }

    allFound(): boolean {
        return this.wordsOnBoard.length === this.wordsGot.length;
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

export { Game };