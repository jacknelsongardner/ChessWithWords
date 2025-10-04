

abstract class ChessPeice {

    public x: number = 0
    public y: number = 0; 
    public onPeiceMove: () => any;

    constructor(x: number, y: number, onPeiceMove: () => any) {
        this.x = x;
        this.y = y;
        this.onPeiceMove = onPeiceMove;
    }

    abstract canMove(x: number, y: number): boolean;

    move(x: number, y: number): [number, number] | false {
        if (this.canMove(x, y)) {
            this.x = x;
            this.y = y;
            this.onPeiceMove(); 

            return [this.x, this.y];
            
        }
        

        return false;
    }
}

export {ChessPeice};