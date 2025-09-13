import {Game} from "../model/Model";


class GameController {
    
    static words: string[] = ["at", "be", "to", "tea", "bat", "tab", "abet", "beta", "beat", "bead", "bad", "cab", "cat", "act", "ace", "face", "fade", "decaf", "cafe", "fade", "deaf", "beef", "feed", "faced", "bade", "bead", "beefed"];
    static game: Game = new Game(GameController.words, 4, 4);
        
    static loading: boolean;

    static paused: boolean;
    static timesStarted: number;

    static onStart: string = "onStart";
    static onTileSelected: string = "onTileSelect";
    static onReset: string = "onReset";
    static onTimerTick: string = "onTimerTick";
    static onHint: string = "onHint";
    static onEnd: string = "onEnd";

    static functions: {[key: string] : (() => any)[]} = {}; 


    static canMove(x: number, y: number) {
        if (Game.game.peice.canMove(x,y)) {
            return true;
        }
        return false;
    }

    static startGame() {
        console.log("starting game");
        GameController.notifySubscribed(GameController.onStart);
    }

    static tick() {
        if (!GameController.paused) {
            if (GameController.game.timerTick()) {
                GameController.notifySubscribed(GameController.onTimerTick);
            }

            if (GameController.game.testEnd()) {
                GameController.notifySubscribed(GameController.onEnd);
            }
        }
        
        console.log(GameController.getTimeLeft())
    }

    static notifySubscribed(key: string): void {
        console.log(GameController.functions);
        const funcs = GameController.functions[key]
        
        console.log("executing for", GameController.functions);

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

    static tryMove(x: number, y: number): [number, number] | false{
        const moved = GameController.game.peice.move(x,y);
        GameController.notifySubscribed("onTileSelect");
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
        GameController.notifySubscribed("onHint");
        //GameController.game.gethint
    }



}

export {GameController};