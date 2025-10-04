import e from "express";
import {Game} from "../model/Model";


class GameController {
    
    static words: string[] = ["at", "be", "to", "tea", "bat", "tab", "abet", "beta", "beat", "bead", "bad", "cab", "cat", "act", "ace", "face", "fade", "decaf", "cafe", "fade", "deaf", "beef", "feed", "faced", "bade", "bead", "beefed"];
    static game: Game = new Game(GameController.words, 6, 6);
        
    static loading: boolean;

    static playing: boolean = true;

    static paused: boolean;
    static timesStarted: number;

    static onStart: string = "onStart";
    static onTileSelected: string = "onTileSelect";
    static onReset: string = "onReset";
    static onTimerTick: string = "onTimerTick";
    static onHint: string = "onHint";
    static onEnd: string = "onEnd";
    static onWrong: string = "onWrong";
    static onRight: string = "onRight";
    static onCheer: string = "onCheer";

    static functions: {[key: string] : (() => any)[]} = {}; 

    static difficulty: string = "";
    static theme: string = "";


    static hint: [number, number] = [-1, -1];
    static hintsEnabled: boolean = false;

    static canMove(x: number, y: number) {
        if (Game.game.peice.canMove(x,y)) {
            return true;
        }
        return false;
    }

    static setupGame(words: string[], difficulty: string) {
        GameController.words = words;

        if (difficulty == "easy") {
            GameController.game = new Game(GameController.words, 4, 4);
            GameController.game.timeLeft = 120
        }
        else if (difficulty == "medium") {
            GameController.game = new Game(GameController.words, 5, 5);
            GameController.game.timeLeft = 150
        }
        else if (difficulty == "hard") {
            GameController.game = new Game(GameController.words, 6, 6);
            GameController.game.timeLeft = 180
        }

                
    }

    static startGame() {
        GameController.notifySubscribed(GameController.onStart);
    }

    static tick() {
        if (!GameController.paused) {
            if (GameController.game.timerTick()) {
                GameController.notifySubscribed(GameController.onTimerTick);
            }

            if (GameController.game.testEnd()) {
                console.log(" end tested and found")
                GameController.game.calculateFinalStats();

                if (GameController.playing) {
                    GameController.playing = false;

                    GameController.notifySubscribed(GameController.onEnd);
                    
                    if (GameController.game.completeScore == 0)
                    {
                        GameController.notifySubscribed(GameController.onRight);
                    } else {
                        GameController.notifySubscribed(GameController.onCheer);
                    }


                }
            }
        }
        
    }

    static getFinalStats() {
        return [
            GameController.game.wordScore,
            GameController.game.timeScore,
            GameController.game.finalScore
        ]
    }

    static notifySubscribed(key: string): void {
        const funcs = GameController.functions[key]
        console.log(key);

        if (funcs) {
            for (var func of funcs) {
                func()
            }
        }
    }

    static getWordToGet() {
        if (GameController.game.wordToMake) {
            return GameController.game.wordToMake;
        }   
    }

    static subscribe(key: string, func: (() => any)) {
        if (!(key in GameController.functions)) {
            GameController.functions[key] = []
        }
        
        if (GameController.functions[key]?.push(func))
        {
            console.log("Subscribed", key);
        } 
        else { console.log("Subscribed failed"); }
    }

    static getTimeLeft() {
        if (GameController.game.timeLeft) {
            return GameController.game.timeLeft
        } else {return 0; }
    }

    static getBoardSize(): number {
        var x = GameController.game.board.content.length
        var y = GameController.game.board.content[0]!.length

        if (x && y) {
            return x*y;
        } else { return 0; } 
    }

    static getBoardDimensions(): [number, number] {
        var dimensions: [number, number] = [GameController.game.board.content.length, GameController.game.board.content[0]!.length]
        
        if (dimensions) {
            return dimensions;
        } else { return [0,0] }
         
    }

    static getBoardContent(x: number, y: number): string {
        return GameController.game.board.content[x]![y]! || "";
    }

    static getPieceCoordinates(): [number, number] {
        if (GameController.game.peice) {
            return [GameController.game.peice.x, GameController.game.peice.y];
        } else {return [0,0]}
    }

    static tryMove(x: number, y: number): [number, number] | false {
        
        var wordsBefore = GameController.game.wordsOnBoard.length;
        var currentWordBefore: string = GameController.game.currentWord;

        const moved = GameController.game.peice.move(x,y);

        if (GameController.game.peice.x == GameController.hint[0] &&
            GameController.game.peice.y == GameController.hint[1]
        ) {
            GameController.hintsEnabled = false;
        }

        GameController.notifySubscribed("onTileSelect");

        if (wordsBefore != GameController.game.wordsOnBoard.length)
        {
            GameController.notifySubscribed(GameController.onRight);
        }
        else if (currentWordBefore.length > GameController.game.currentWord.length 
                    && GameController.game.wordsOnBoard.length != 0 )
        {
            GameController.notifySubscribed(GameController.onWrong);
        }

        return moved;
    } 

    static getCurrentWord(): string {
        if (GameController.game.currentWord) {
            return GameController.game.currentWord
        } else {return "";}
    }

    static getWordsGot(): string[] {
        
        if (GameController.game.currentWord) {
            return GameController.game.wordsGot;
        } else {return [];}
    }

    static getWordsToGo(): string[] {
        return GameController.game.wordsOnBoard.map((word: string) => {
            if (GameController.game.wordsGot.includes(word))
            {
                return ""
            }
            else {
                return word
            }
        })
    }

    static getTiles(): {x: number; y: number; letter: string;}[] {
        var board: string[][] = GameController.game.board.content;
        var tiles: {x: number; y: number; letter: string;}[] = []

        for (var y = 0; y < board.length; y++ ) {
            for (var x = 0; x < board[0]!.length; x++ ) {
                tiles.push({
                    x: x,
                    y: y, 
                    letter: board[x]![y]!
                })
            }
        }

        return tiles;
    }

    static tryScrambleBoard(): void {
        GameController.notifySubscribed("onReset");
        GameController.game.resetBoard();
    }

    static getHint(): void {
        GameController.hint = GameController.game.nextHint()!;
        GameController.hintsEnabled = true;
        
        GameController.notifySubscribed(GameController.onTileSelected);
    }

    static trySkip(): void {
        GameController.game.skipWord();
        GameController.hintsEnabled = false;
        GameController.notifySubscribed(GameController.onTileSelected);
    }

    


}

export {GameController};