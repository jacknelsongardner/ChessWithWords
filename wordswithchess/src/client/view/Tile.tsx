import {GameController} from "../control/Control"


interface TileProps {
  x: number;
  y: number;
  size: number;
}

function Tile({ x, y, size }: TileProps) {
  
  let color: string = "brown"; // default color, if something fails

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

  return  <div style={style} onClick={() => GameController.tryMove(x, y)}> 
            <span style={{ pointerEvents: "none" }}>
              {GameController.getBoardContent(x, y)}
            </span>
          </div>;
}

export {Tile}