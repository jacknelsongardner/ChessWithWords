import { useState, useEffect } from "react";
import {GameController} from "./gameController.tsx";
import "./Cursor.css";

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



function Peice () { 

  const size = 50; 

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


function GameView() {
  const [timeLeft, setTime] = useState(60); // 60 seconds

  useEffect(() => {
    if (timeLeft <= 0) return; // stop when time runs out

    const interval = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval); // cleanup
  }, [timeLeft]);

  const [render, setRender] = useState(0); // state to trigger re-render
  
  function handleTileClick(x: number, y: number) {
    var move = GameController.tryMove(x,y);
    if (move) {
      setRender(render + 1); // trigger re-render
    }
  }

  const style: React.CSSProperties = {
    position: "relative",
  }



  const currentThemeStyle: React.CSSProperties = {
    fontSize: '1.2em',
    fontWeight: 'bold',
    margin: '10px 0',
    color: 'white',
    textShadow: '2px 2px 4px #000000',
    textAlign: 'center' as const
  }

  const currentWordStyle: React.CSSProperties = {
    fontSize: '1.5em',
    fontWeight: 'bold',
    margin: '10px 0',
    color: 'black',
    backgroundColor: 'white',
    padding: '10px',
    borderRadius: '8px',
    textAlign: 'center' as const,
    minWidth: '150px',
    minHeight: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'pre-wrap' as const,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.37)",
    userSelect: "none", // prevent text selection


  }

  const wordsToGoStyle: React.CSSProperties = {
    columnWidth: "60px",     // target width of each column
    columnGap: "1rem",        // space between columns

    display: "grid",  
    gridTemplateColumns: `repeat(4, 1fr)`,
    gridTemplateRows: `repeat(3, 1fr)`,
    
    whiteSpace: "pre-line",
    color: "white",
    textShadow: "2px 2px 4px #000000",
    textAlign: "center" as const,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.37)",
    backgroundColor: "rgba(0, 0, 0, 0.23)",
    padding: "1px",
    borderRadius: "8px",
    marginTop: "5px",
    marginBottom: "5px",
    userSelect: "none", // prevent text selection
    minHeight: "80px",
    maxHeight: "80px",       // enforce a minimum height before wrapping

  }


  const resetButtonStyle: React.CSSProperties = {
    width: "50px",          // same width & height
    height: "50px",
    fontSize: "1.2em",
    fontWeight: "bold",
    color: "black",
    backgroundColor: "#ffffffff", // picked a blue (since #ffffffff was invalid)
    border: "none",
    borderRadius: "50%",    // makes it a circle
    cursor: "pointer",
    display: "flex",        // center content
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.37)",
    transition: "background-color 0.3s, box-shadow 0.3s",
  };


  const timeStyle: React.CSSProperties = {
    fontSize: '1.2em',
    fontWeight: 'bold',
    margin: '10px 0',
    color: timeLeft <= 10 ? 'red' : 'black', // red if 10 seconds or less
    textAlign: 'center' as const,
    backgroundColor: "white",
    padding: '2px',
    borderRadius: '10px',
    minWidth: '80px',
    minHeight: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.37)", // glow effect if 10 seconds or less
  }

  return (
    <div style={style}>


      <p style={currentWordStyle}>
        {GameController.getCurrentWord() || ""}
        <span className="cursor">|</span>
      </p>

      <div className="text-base text-center text-gray-600 " style={wordsToGoStyle}>
        {GameController.getWordsToGo().map((word: string, i: number) => {
          return <div key={i}> {`${word}`} </div>
        })}
      </div>

      <Grid onClick={handleTileClick}/>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", marginTop: "20px", width: "100%" }}>
        {/* Reset button - left */}
        <button style={resetButtonStyle} onClick={() => {GameController.tryScrambleBoard(); setRender(0); }}>
          🎲
        </button>

        {/* Timer - absolutely centered */}
        <p style={timeStyle}>
          🕚 {timeLeft}s
        </p>

        {/* Logo - right */}
        <img src="/logo.png" alt=":D" style={{ width: "50px", height: "50px" }} />
      </div>

    </div>
  );

}

function Grid({onClick}: {onClick: ((x: number, y: number) => void)}) {
  const size = 50;


  const boardStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${GameController.getBoardDimensions()[0]}, ${size}px)`,
    gridTemplateRows: `repeat(${GameController.getBoardDimensions()[1]}, ${size}px)`,
    position: "relative",
    border: "20px solid rgba(255, 255, 255, 1)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.37)",
    backgroundColor: "rgba(104, 167, 209, 1)",
    borderRadius: "16px",
    marginTop: "10px"
  };

  return (
    <div style={boardStyle}>
      {GameController.getTiles().map((tile: {x: number, y: number}) => {
        return (
          <Tile key={`${tile.x}-${tile.y}`} x={tile.x} y={tile.y} size={size} onClick={onClick}/>
        );
      })}
      <Peice/>
    </div>
  );
}

export default GameView;
