import {ChessPeice} from "./Model"

class Knight extends ChessPeice {
    canMove(x: number, y: number): boolean {
       

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

export {Knight};