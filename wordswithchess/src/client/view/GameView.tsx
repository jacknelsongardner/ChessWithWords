import { useState, useEffect } from "react";
import {GameController} from "../control/GameController";
import {CircleButton} from "./CircleButton"
import {Grid} from "./Grid"

import "./Cursor.css";
import { CurrentWord } from "./CurrentWord";
import {WordsToGo} from "./WordsToGo"

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

  function handleResetClick() {
    GameController.tryScrambleBoard(); 
    setRender(0); 
  }

  function handleHintClick() {
    GameController.tryScrambleBoard(); 
    setRender(0); 
  }

  const style: React.CSSProperties = {
    position: "relative",
  }

  const timeStyle: React.CSSProperties = {
    fontSize: '1.2em',
    fontWeight: 'bold',
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


      <CurrentWord/>

      <WordsToGo/>

      <Grid onClick={handleTileClick}/>
        
      <div style={{ display: "grid", 
                    gridTemplateColumns: "repeat(3, 1fr)", 
                    gridTemplateRows: "repeat(1, 1fr)", 
                    width: "100%",
                    marginTop: "10px"}}>
        
        <div style={{display: "flex", justifyContent: "left"}}>
          <CircleButton onClick={handleResetClick} content={"🎲"}/> 
        </div>

        <p style={timeStyle}>
          🕚 {timeLeft}s
        </p>

        <div style={{display: "flex", justifyContent: "right"}}>
          <CircleButton onClick={handleHintClick} content={"💡"} /> 
        </div>

      </div> 
      

    </div>
  );

}


export {GameView};
