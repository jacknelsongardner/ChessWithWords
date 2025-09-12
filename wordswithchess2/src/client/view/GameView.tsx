import { useState, useEffect } from "react";
import {GameController} from "../control/GameController";
import {CircleButton} from "./CircleButton"
import {Grid} from "./Grid";
import {Timer} from "./Timer";
import {UI} from "./UI";



import "./Cursor.css";
import { CurrentWord } from "./CurrentWord";
//import {WordsToGo} from "./WordsToGo";



function GameView() {

    // start game timer
    useEffect(() => {
      const timer = setInterval(() => {
        GameController.tick();
        console.log(GameController.getWordToGet());
        console.log(GameController.getCurrentWord());
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
  

    const topWordsStyle: React.CSSProperties = {
        color: "white",
        fontFamily: "'Permanent Marker', sans-serif", // marker-style font
        fontSize: "30px",
         textShadow: `
          -2px -2px 0 black,  
          2px -2px 0 black,  
          -2px 2px 0 black,  
          2px 2px 0 black
        `,
    }

  return (
    <div style={style}>

      <div style={bottomStyle}>
        

        <UI subscribe={GameController.onTimerTick}> 
          <Timer/>
        </UI>

        <div style={{display: "flex", justifyContent: "right"}}>
          <CircleButton onClick={handleHintClick} content={"💡"} /> 
        </div>


        { /** 
        <div style={{display: "flex", justifyContent: "left"}}>
          <CircleButton onClick={handleResetClick} content={"🎲"}/> 
        </div>

        <div style={{display: "flex", justifyContent: "right"}}>
          <CircleButton onClick={handleHintClick} content={"💡"} /> 
        </div>*/}

      </div>
      

      

      {/* <div style={topWordsStyle} > Your current word is: </div> */}

      

      <UI subscribe ={ GameController.onTileSelected }>
        <CurrentWord/>
      </UI>

      <UI subscribe={ GameController.onReset }>
          <Grid/>
      </UI>
        
      
       
      
      

    </div>
  );

}


export {GameView};
