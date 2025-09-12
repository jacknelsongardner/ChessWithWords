import {GameController} from "../control/Control"
import {Tile} from "./Tile"
import {Peice} from "./Peice"
import {UI} from "./UI"

function Grid() {
  const size = 50;


  const boardStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${GameController.getBoardDimensions()[0]}, ${size}px)`,
    gridTemplateRows: `repeat(${GameController.getBoardDimensions()[1]}, ${size}px)`,
    position: "relative",
    border: "20px solid rgba(255, 255, 255, 1)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.37)",
    backgroundColor: "rgba(105, 180, 242, 1)",
    borderRadius: "16px",
    marginTop: "12px",
    overflow: "hidden"
  };

  return (
    <div style={boardStyle}>
      {GameController.getTiles().map((tile: {x: number, y: number}) => {
        return (
          <Tile key={`${tile.x}-${tile.y}`} x={tile.x} y={tile.y} size={size}/>
        );
      })}

      <Peice/>
    </div>
  );
}

export {Grid}