import { text } from "express";
import {GameController} from "../control/Control"


interface TileProps {
  x: number;
  y: number;
  size: number;
}

function Tile({ x, y, size }: TileProps) {
  
  let tileColor: string = "brown"; // default color, if something fails
  let textColor: string = "rgba(255, 255, 255, 1)";

  if (x % 2 === 0 && y % 2 === 0) {
    tileColor = "rgba(105, 180, 242, 1)"; // light tile
    //textColor = "rgba(32, 127, 194, 1)"
  } else if (x % 2 === 1 && y % 2 === 1) {
    // odd row, odd col
    // white tile
    tileColor = "rgba(105, 180, 242, 1)";
    //textColor = "rgba(32, 127, 194, 1)"

  }
  else {
    tileColor = "rgba(53, 101, 174, 1)";
    textColor = "rgba(255, 255, 255, 1)"

  }

  
  
  const textStyle: React.CSSProperties = {
    width: size,
    height: size,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    position: "relative",
    backgroundColor: tileColor,
    border: `0px`,
    borderRadius: "8px",
    color: textColor,
    fontFamily: "Franklin Gothic, sans-serif",
    fontSize: "27px",
    fontWeight: 'bold',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)',
  };

  return  <div style={textStyle} onClick={() => GameController.tryMove(x, y)}> 
            <span style={{ pointerEvents: "none" }}>
              {GameController.getBoardContent(x, y)}
            </span>
          </div>;
}

export {Tile}