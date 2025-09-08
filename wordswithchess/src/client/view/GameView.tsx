import { useState, useEffect } from "react";
import {GameController} from "../control/GameController";
import {CircleButton, Grid} from "./View"

import "./Cursor.css";

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

  const currentWordStyle: React.CSSProperties = {

    fontSize: '1.5em',
    fontWeight: 'bold',
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

  const gottenStyle: React.CSSProperties = {
    color: "darkgrey",
  }

  const toGetStyle: React.CSSProperties = {
    color: "white",
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


      <p style={currentWordStyle}>
        {GameController.getCurrentWord() || ""}
        <span className="cursor">|</span>
      </p>

      <div className="text-base text-center text-gray-600 " style={wordsToGoStyle}>
        {GameController.getWordsToGo().map((word: string, i: number) => {
          
          if (GameController.getWordsGot().includes(word)) {
            return <div style={gottenStyle} key={i}> {`${word}`} </div>
          }
          else {
            return <div style={toGetStyle} key={i}> {`${word}`} </div>
          }
        })}
      </div>

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
