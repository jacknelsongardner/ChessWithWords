import { useState, useEffect, useRef } from "react";
import {GameController} from "../control/GameController";
import {CircleButton} from "./CircleButton"
import {Grid} from "./Grid";
import {Timer} from "./Timer";
import {UI} from "./UI";
import { Peice } from "./Peice";
import { Popup } from "../Popup"
import "./Cursor.css";
import { CurrentWord } from "./CurrentWord";
import { Level } from "./Level"
    
import { HighScores } from "./HighScore";

import { context } from '@devvit/web/client';



function GameView() {


    const [complete, setComplete] = useState(false);

    const [highScore, setHighScore] = useState(0);
    const [highScores, setHighScores] = useState([]);
    const [scoreToggle, setScoreToggle] = useState(false);

    const postScore = async (postId: string, score: number, username: string) => {
      console.log("postscore inputs: ", postId, score, username);

      try {
        const res = await fetch("/api/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId, score, username }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        console.log("scores : ", data);

        setHighScores(data["top"]);
        setHighScore(data["highscore"]);

        setScoreToggle(true);

        return data.top; // leaderboard array or null
      } catch (err) {
        console.error("Failed to post score:", err);
        return null;
      }
    };

    useEffect(() => {
      GameController.subscribe(GameController.onStart, startTimer)
      GameController.subscribe(GameController.onEnd, endGame)
      GameController.subscribe(GameController.onCheer, () => {setComplete(true)})

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
          
          { !scoreToggle &&
              <div style={{justifyContent: "center", 
                          alignItems: "center", 
                          display: "flex", 
                          flexDirection: "column",
                        }}>
              {complete &&
                <img style={{maxWidth: "175px"}} src={"redditGuy.png"}/>
              }

              {!complete &&
                <img style={{maxWidth: "140px"}} src={"tryagain.png"}/>
              }
              
              <div> Score break down: </div>
              <div>   Word Score : {GameController.game.wordScore}</div>
              <div> + Time Left Bonus : {GameController.game.timeScore}</div>
              <div> + Complete Puzzle Bonus : {GameController.game.completeScore}</div>
              <div> - {3 - hintsLeft} 💡 left x 60 : {(3 - hintsLeft)*60}</div>
              <div> - {3 - skipsLeft} ⏩ left x 40 : {(3 - skipsLeft)*20}</div>
              <div>   _________________ </div>
              <div>                     </div>
              <div> Final Score : {GameController.game.finalScore - (3-hintsLeft)*60 - (3-skipsLeft)*60}</div>

              <button
                  className="mt-4 px-2 py-1 bg-red-600 text-white rounded-lg shadow flex items-center space-x-2 text-sm"
                  onClick={() => {
                    var score = GameController.game.finalScore - (3-hintsLeft)*60 - (3-skipsLeft)*60
                    postScore(context.postId, score, context.userId!);
                  }}
                  style={{height: "40px"}}
                  >

                <span>Submit your Score!</span>
                <img src="redditHead.png" alt="Reddit" className="w-5 h-5" />
              
              </button>
          </div>
          }

          
          {scoreToggle && 
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              justifyContent: "center" 
            }}>
              <HighScores scores={highScores}/>

              <p style={{color: "darkgrey"}}>                 
                Your High Score: {" "}
                <span style={{fontWeight: "bold", color: "black"}}> 
                  {highScore}
                </span>
              </p>

              <p style={{color: "darkgrey"}}> 
                Your Score: {" "}
                <span style={{fontWeight: "bold", color: "black"}}>
                  {GameController.game.finalScore 
                                              - (3-hintsLeft) * 60 
                                              - (3-skipsLeft) * 60 }
                </span> 
              </p>
              
            </div>
          }

          <div style={{justifyContent: "center", display: "flex"}}>
            <button
                className="mt-4 px-2 py-1 bg-blue-600 text-white rounded-lg shadow flex items-center space-x-2 text-sm"
                onClick={() => {window.location.reload(); }}
                style={{height: "40px"}}
              >
                <span>Try again</span>
            </button>
          </div>
        </Popup>



      <Level textColor="white"/>

      <UI subscribe={GameController.onTimerTick}> 
        <Timer/>
      </UI>


      <UI subscribe ={ GameController.onTileSelected }>
        <CurrentWord/>
      </UI>

      <UI subscribe={ GameController.onReset }>
          <Grid/>
      </UI>
        
      
      <div style={{display: "flex", justifyContent: "right", marginTop: "10px"}}>
        {

        }

        <div style={{ display: "flex", justifyContent: "left", width: "50px"}}>
          <CircleButton  onClick={() => {
            GameController.notifySubscribed(
              GameController.onEnd)}} content={`🛑`} /> 
        </div>
        
        <div style={{ display: "flex", justifyContent: "left" }}>
          <CircleButton onClick={handleHintClick} content={`💡 x ${hintsLeft}`} /> 
        </div>

        <div style={{ display: "flex", justifyContent: "left" }}>
          <CircleButton onClick={handleSkipClick} content={`⏩ x ${skipsLeft}`} /> 
        </div>
        


      </div>
       

    </div>
  );

}


export {GameView};
