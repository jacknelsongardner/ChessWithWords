import { useState, useEffect } from "react";
import {GameController} from "../control/GameController";
import {CircleButton} from "./CircleButton"
import {Grid} from "./Grid";
import {Timer} from "./Timer";
import {UI} from "./UI";



import "./Cursor.css";
import { CurrentWord } from "./CurrentWord";
import {WordsToGo} from "./WordsToGo";



function GameView() {

    // start game timer
    useEffect(() => {
      const timer = setInterval(() => {
        GameController.tick();
        console.log("tick");
      }, 1000);

      // stoptimer on unmount
      return () => clearInterval(timer);
    },[])

    function handleResetClick() {
        GameController.tryScrambleBoard(); 
    }

    function handleHintClick() {
        GameController.tryScrambleBoard(); 
    }

    const style: React.CSSProperties = {
      position: "relative",
    }

    const bottomStyle: React.CSSProperties = {
        display: "grid", 
        gridTemplateColumns: "repeat(3, 1fr)", 
        gridTemplateRows: "repeat(1, 1fr)", 
        width: "100%",
        marginTop: "12px"
      }
  

  return (
    <div style={style}>

      <UI subscribe ={ GameController.onTileSelected }>
        <CurrentWord/>
      </UI>

      <UI subscribe={ GameController.onTileSelected }>
          <WordsToGo/>
      </UI>

      <UI subscribe={ GameController.onReset }>
          <Grid/>
      </UI>
        
      <div style={bottomStyle}>
        
        <div style={{display: "flex", justifyContent: "left"}}>
          <CircleButton onClick={handleResetClick} content={"🎲"}/> 
        </div>

        <UI subscribe={GameController.onTimerTick}> 
            <Timer/>
        </UI>

        <div style={{display: "flex", justifyContent: "right"}}>
          <CircleButton onClick={handleHintClick} content={"💡"} /> 
        </div>

      </div> 
      

    </div>
  );

}


export {GameView};
