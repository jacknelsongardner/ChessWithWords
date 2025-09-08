import {GameController} from "../control/GameController.tsx"

interface TileProps {
  x: number;
  y: number;
  size: number;
  onClick: (x: number, y: number) => void;
}

function Tile({ x, y, size, onClick }: TileProps) {
  
  let color: string = "brown"; // default color, if something fails

  /* if (Game.game.board.lettersRight[x]?.[y]) {
    color = "lightgreen"; // found letter
  } else {*/ 

      if (x % 2 === 0 && y % 2 === 0) {
        color = "rgba(104, 167, 209, 1)"; // light tile
      } else if (x % 2 === 1 && y % 2 === 1) {
        // odd row, odd col
        // white tile
        color = "rgba(104, 167, 209, 1)";
      }
      else {
        color = "rgba(31, 67, 129, 1)";
      }
  //}

  
  
  const style: React.CSSProperties = {
    width: size,
    height: size,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    position: "relative",
    backgroundColor: color,
    border: `0px`,
    borderRadius: "8px",
    color: "white",
  };

  return  <div style={style} onClick={() => onClick(x, y)}> 
            <span style={{ pointerEvents: "none" }}>
              {GameController.getBoardContent(x, y)}
            </span>
          </div>;
}

export {Tile}