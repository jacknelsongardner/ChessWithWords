// App.tsx
import { useEffect, useState } from "react";
import { GameView } from "./view/View";
import { GameController } from "./control/GameController.js";
import "./view/background.css";
import { Popup } from "./Popup";
import { Slideshow } from "./Slideshow";
import { CountdownCircle } from "./Countdown";

console.log("opening client");
  
export const App = () => {

  
  const [popupOpen, setPopupOpen] = useState(true); // starts open
   
  useEffect(() => {
      GameController.subscribe(GameController.onEnd, onEndGame)
  }, []);
  
  function onEndGame() {
      setDone(true);
  }

  const backgroundStyle = {
    backgroundImage: 'url("/background3.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const [howToPlay, setHowToPlay] = useState(false);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  const [countDown, setCountDown] = useState(4);

  function startCountdown() {
    setStarted(true);     // show the countdown
    setHowToPlay(false);
    setCountDown(4);      // reset to 3 before starting

    let timer = setInterval(() => {
      setCountDown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setPopupOpen(false); // close popup at the end
          GameController.startGame();

          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }



  return (
    <div
      className="blur-bg flex relative flex-col justify-center items-center min-h-screen w-screen gap-4"
      style={backgroundStyle}
    >

        {/* Overlay GIF */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            opacity: done ? 1 : 0,
            pointerEvents: "none"
          }}
        >
          {done && 
          <img src="confetti.gif" alt="Overlay" style={{ width: "100%", height: "100%" }} />
          }
        </div>

      {/* Greyed out while popup is open */}
      { started &&
      <div className="blur-bg flex relative flex-col justify-center items-center min-h-screen w-screen gap-4" style={backgroundStyle}> 
        <GameView/> 
      </div>
      }
      

      {/* Popup */}
      <Popup isOpen={popupOpen} onClose={() => setPopupOpen(false)}>
        {started && !howToPlay &&
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              
            }}
          >
            <CountdownCircle count={countDown} />
          </div>
        }
        
        {!howToPlay && !started &&
          <div style={{justifyContent: "center", 
                       alignItems: "center", 
                       display: "flex", 
                       flexDirection: "column",
                     }}>

            <img src="wordswithchess.png" style={{ maxWidth: "250px", 
                                                    //marginBottom: "50px"
                                                }}/>
            <img src="logo.png" style={{ maxWidth: "150px", 
                                         //marginBottom: "-50px"
                                      }}/>

            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
                    onClick={() => setHowToPlay(true)}>
              How to play
            </button>

            <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow"
                    onClick={() => startCountdown()}>
                  Start Game
            </button>
          </div>
        }

        { howToPlay &&
          <Slideshow
            onFinish={() => startCountdown()}
            slides={[
              { image: "/images/slide1.png", text: "The knight moves in an L shape around the board." },
              { image: "/images/slide2.png", text: "Collect letters around the board to spell words." },
              { image: "/images/slide3.png", text: "Longer words are worth more points." },
              { image: "/images/slide3.png", text: "Watch the time! Spell all of todays words to get bonus points!." },
              { image: "/images/slide4.png", text: "Good luck! Let's get started." },
            ]}
        />}

        


      </Popup>
    </div>
  );
};
