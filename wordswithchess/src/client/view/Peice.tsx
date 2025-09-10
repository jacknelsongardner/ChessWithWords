import { useState, useEffect } from "react";
import { GameController } from "../control/Control";

function Peice() {

  const [coords, setCoords] = useState(GameController.getPieceCoordinates());

  useEffect(() => {
    const callback = () => {
      setCoords(GameController.getPieceCoordinates());
      console.log("knight notified");
    };
    GameController.subscribe("onTileSelect", callback);
  }, []);

  const size = 50; 

  const pieceStyle: React.CSSProperties = {
    width: size - 10,
    height: size - 10,
    position: "absolute",
    left: coords[0] * size + 5,
    top: coords[1] * size + 5,
    transition: "left 0.3s, top 0.3s", // smooth move
  };

  return (

      <div style={pieceStyle}> 
        <img src="/knight.GIF" alt="Knight" style={{ width: "100%", height: "100%" }} />
      </div>
  )
}

export {Peice}
