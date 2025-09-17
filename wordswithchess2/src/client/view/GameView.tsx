import { useState, useEffect } from "react";
import {GameController} from "../control/GameController";
import {CircleButton} from "./CircleButton"
import {Grid} from "./Grid";
import {Timer} from "./Timer";
import {UI} from "./UI";
import { Peice } from "./Peice";
import { Popup } from "../Popup"

import "./Cursor.css";
import { CurrentWord } from "./CurrentWord";


function GameView() {


    useEffect(() => {
      GameController.subscribe(GameController.onStart, startTimer)
      GameController.subscribe(GameController.onEnd, endGame)
    }, [])

    const [hintsLeft, setHintsLeft] = useState(3);
    const [skipsLeft, setSkipsLeft] = useState(3);

    const [popup, setPopup] = useState(false);

    function endGame() {
      setPopup(true);
    }

    // start game timer
    function startTimer() {
      console.log("timer function called")

      const timer = setInterval(() => {
        GameController.tick();
        console.log(GameController.getWordToGet());
        console.log(GameController.getCurrentWord());
      }, 
      1000);

      // stoptimer on unmount
      return () => clearInterval(timer);
    }

    function handleSkipClick() {
      if (skipsLeft > 0) {
        GameController.trySkip();
        setSkipsLeft((val) => val-1); 
      }
    }

    function handleHintClick() {
      if (hintsLeft > 0) {
        GameController.getHint(); 
        setHintsLeft((val) => val-1); 
      }
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



        <Popup isOpen={popup} onClose={() => setPopup(true)}>
          <div style={{justifyContent: "center", 
                                alignItems: "center", 
                                display: "flex", 
                                flexDirection: "column",
                              }}>

              <img style={{maxWidth: "200px"}} src={"redditGuy.png"}/>
              
              <div> Score break down: </div>
              <div>   Word Score : {GameController.game.wordScore}</div>
              <div> + Time Bonus : {GameController.game.timeScore}</div>
              <div>               ______ </div>
              <div> Final Score : {GameController.game.finalScore}</div>

              <button
                className="mt-4 px-2 py-1 bg-red-600 text-white rounded-lg shadow flex items-center space-x-2 text-sm"
                onClick={() => setPopup(false)}
              >
                <span>Comment your score!</span>
                <img src="redditHead.png" alt="Reddit" className="w-5 h-5" />
              </button>
             
             {/* 
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
                      onClick={() => {
                        
                        setPopup(false);
                      }}>
                Try again
              </button>
              */}

          </div>
        </Popup>

        <UI subscribe={GameController.onTimerTick}> 
          <Timer/>
        </UI>

      

      

      {/* <div style={topWordsStyle} > Your current word is: </div> */}

      

      <UI subscribe ={ GameController.onTileSelected }>
        <CurrentWord/>
      </UI>

      <UI subscribe={ GameController.onReset }>
          <Grid/>
      </UI>
        
      
      <div style={bottomStyle}>
        
        <div>
          {/* empy */}
        </div>
       
        
        <div style={{ display: "flex", justifyContent: "left", gap: "8px" }}>
          <CircleButton onClick={handleHintClick} content={`💡 x ${hintsLeft}`} /> 
        </div>

        <div style={{ display: "flex", justifyContent: "left", gap: "8px" }}>
          <CircleButton onClick={handleSkipClick} content={`⏩ x ${skipsLeft}`} /> 
        </div>


      </div>
       
      
      

    </div>
  );

}


export {GameView};
