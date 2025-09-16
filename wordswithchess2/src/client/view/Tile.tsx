import { text } from "express";
import {GameController} from "../control/Control"
import { useEffect, useState } from "react";


interface TileProps {
  x: number;
  y: number;
  size: number;
}

function Tile({ x, y, size }: TileProps) {
  
  useEffect(() => {
   GameController.subscribe(GameController.onTileSelected, () => setCanMove((val) => !val))
  }, []);

  const [canMove, setCanMove] = useState(false);

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



  function CenterDot() {
    return (<div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "28px",
        height: "28px",
        borderRadius: "50%",
        backgroundColor: "rgba(0, 0, 0, 0.22)",
        pointerEvents: "none",
        zIndex: 0, // push it behind
      }}
    />)

  }

  function HintDot() {
    return (<div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "28px",
        height: "28px",
        borderRadius: "50%",
        backgroundColor: "rgba(255, 242, 126, 1)",
        pointerEvents: "none",
        zIndex: 0, // push it behind
      }}
    />)

  }

  return  <div style={textStyle} onClick={() => GameController.tryMove(x, y)}> 
            {GameController.canMove(x,y) &&
              <div>
                <CenterDot/>
              </div>
            }

            {x == GameController.hint[0] && 
             y == GameController.hint[1] &&
             GameController.hintsEnabled &&
              <div>
                <HintDot/>
              </div>
            }
            
            <span style={{ pointerEvents: "none", zIndex: 1 }}>
              {GameController.getBoardContent(x, y)}
            </span>

            
            
          </div>;
}

export {Tile}