import { GameController } from "../control/GameController";
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

    public wordIndex: number = 0;
    public wordToMake: string = "";

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

        this.setWordToMake();
        this.timeLeft = words.length * 10;

        

        return this;
        
    }

    setWordToMake(): void {
        if (this.wordsOnBoard.length > 1 && 
            this.wordIndex < this.wordsOnBoard.length)
        {
            this.wordToMake = this.wordsOnBoard[this.wordIndex]!;
            this.wordIndex++;
        }
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

        if (!this.wordToMake.startsWith(this.currentWord))
        {
            this.currentWord = "";
        }

        if (this.currentWord == this.wordToMake) {
            this.wordsGot.push(this.currentWord);
            this.currentWord = "";

            this.setWordToMake();
        }

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

    allFound() {
        return this.wordsGot.length === this.wordsOnBoard.length;
    }

}

export { Game };