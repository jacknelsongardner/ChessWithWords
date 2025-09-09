import {GameController} from "../control/Control"
import { useState, useEffect } from "react";

function Peice () { 

  const size = 50; 

  const [render, useRender] = useState(false);

  // on start
  useEffect(() => {
      GameController.subscribeOnTileSelect(() => {useRender(!render)});
  }, []) 

  const pieceStyle: React.CSSProperties = {
    width: size - 10,
    height: size - 10,
    position: "absolute",
    left: GameController.getPieceCoordinates()[0] * size + 5,
    top: GameController.getPieceCoordinates()[1] * size + 5,
    transition: "left 0.3s, top 0.3s", // smooth move
  };

  return (

      <div style={pieceStyle}> 
        <img src="/knight.GIF" alt="Knight" style={{ width: "100%", height: "100%" }} />
      </div>
  )
}

export {Peice}
