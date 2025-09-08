import {Game} from "./chessPiece.tsx";


class GameController {
    
    static words: string[] = ["at", "be", "to", "tea", "bat", "tab", "abet", "beta", "beat", "bead", "bad", "cab", "cat", "act", "ace", "face", "fade", "decaf", "cafe", "fade", "deaf", "beef", "feed", "faced", "bade", "bead", "beefed"];
    static game: Game = new Game(this.words, 6, 6);
        
    static loading: boolean;

    static timesStarted: number;

    static onTimerTick: () => void;
    static onTileClick: (x: number, y: number) => boolean;

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
        return [GameController.game.peice.x, GameController.game.peice.y];
    }

    static tryMove(x: number, y: number): [number, number] | false{
        return GameController.game.peice.move(x,y);
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
        return GameController.game.resetBoard();
    }



}

export {GameController};