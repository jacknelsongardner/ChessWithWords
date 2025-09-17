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
    public wordsLeft: string[] = [];

    public ticking: boolean = false;

    public wordScore: number = 0;
    public timeScore: number = 0;
    public finalScore: number = 0;
    public completeScore: number = 0;

    public wordHints: Record<string, [number, number][]> = {}; // map from word -> hints
    public currentHint: [number, number][] = [];
    public hintIndex: number = 0;

    public wordsWin: number = 0;

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

        console.log("new game created with: ", this.board.content);

        return this;
        
    }

    calculateFinalStats(): void {
        this.wordScore = this.wordsGot.length * 100;
       
        if (this.wordsGot.length == this.wordsOnBoard.length)
        {
            this.completeScore = 100;
        }

        this.timeScore = this.timeLeft;
        
        this.finalScore = this.wordScore + this.timeScore

        console.log(this.wordScore)
        console.log(this.wordsGot)
    }

    setWordToMake(skipped?: boolean): void {
        
        if (this.wordsOnBoard.length >= 1)
        {
            if (skipped) {
                this.wordsOnBoard.push(this.wordToMake)
            }

            this.wordToMake = this.wordsOnBoard.shift()!;;
            this.resetHint();
        }
    }

    skipWord(): void {
        
        this.setWordToMake(true);

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

        if (end) { 
            this.calculateFinalStats(); 
            this.ticking = false; 
        }
        
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

            if (this.board!.content![this.peice.x!]![this.peice.y!]! == this.wordToMake[0]) {
                this.currentWord = this.board!.content![this.peice.x!]![this.peice.y!]!
            }
        } 

        if (this.currentWord == this.wordToMake) {
            this.wordsGot.push(this.currentWord);
            this.currentWord = "";

            this.setWordToMake();
        } else {
            this.incrementHint();
        }


        console.log("Possible words: " + this.possibleWords.join(", "));
        console.log("Words on board: " + this.wordsOnBoard.join(", "));
        console.log("Words to get: " + this.wordsToGet.join(", "));  


        console.log("Current word: " + this.currentWord);

    }

    resetBoard() {


        this.wordsOnBoard = [];

        var wordsToShuffle = shuffleArray(Game.game.wordsToGet.map(word => !Game.game.wordsGot.includes(word) ? word : ""));
        
        [this.wordsOnBoard, this.wordHints] = this.board.shuffle(wordsToShuffle)!;
        
        this.wordsLeft = this.wordsOnBoard;

        this.currentWord = "";



        this.possibleWords = this.possibleWords.map(word => word.toLowerCase());
        this.wordsOnBoard = this.wordsOnBoard.map(word => word.toLowerCase());
        this.wordsToGet = this.wordsToGet.map(word => word.toLowerCase());
        this.wordsGot = this.wordsGot.map(word => word.toLowerCase());
        
        this.board.content = this.board.content.map(row => row.map(letter => letter.toLowerCase()));
        this.wordsWin = this.wordsOnBoard.length;
        this.resetHint();
    }

    allFound() {
        return this.wordsGot.length === this.wordsWin;
    }


    resetHint() {
        this.hintIndex = 0;
        this.currentHint = this.wordHints[this.wordToMake.toUpperCase()]!;
    }

    incrementHint() {
        console.log("hintincrement")
        console.log(this.currentHint);
        console.log(this.hintIndex);
        console.log(this.wordHints);

        if ( this.peice.x == this.nextHint()![0]! &&
             this.peice.y == this.nextHint()![1]! ) 
        {
                this.hintIndex++;
        } 
        else {
            this.hintIndex = 0; 
        }
    }

    nextHint() {
        console.log("next hint :");
        console.log(this.currentHint);
        console.log(this.hintIndex);
        console.log(this.wordHints);

        return this.currentHint[this.hintIndex];
    }
}

export { Game };