// App.tsx
import { useEffect, useRef, useState } from "react";
import { GameView } from "./view/View";
import { GameController } from "./control/GameController.js";
import "./view/background.css";
import { Popup } from "./Popup";
import { Slideshow } from "./Slideshow";
import { CountdownCircle } from "./Countdown";
import { Level } from "./view/Level";
import { context } from '@devvit/web/client';

type SoundKey = "backgroundMusic" | "correct" | "tile" | "start" | "win" | "wrong";

export const App = () => {

    // Refs for each audio element
  const refs: Record<SoundKey, React.RefObject<HTMLAudioElement | null>> = {
    backgroundMusic: useRef<HTMLAudioElement | null>(null),
    correct: useRef<HTMLAudioElement | null>(null),
    tile: useRef<HTMLAudioElement | null>(null),
    start: useRef<HTMLAudioElement | null>(null),
    win: useRef<HTMLAudioElement | null>(null),
    wrong: useRef<HTMLAudioElement | null>(null),
  };

  // General play function
  const playSound = (
    key: SoundKey,
    options: { loop?: boolean; volume?: number } = {}
  ): void => {
    const ref = refs[key];
    if (ref.current) {
      const { loop = false, volume = 1.0 } = options;
      ref.current.loop = loop;
      ref.current.volume = volume;
      ref.current.currentTime = 0;
      void ref.current.play();
    }
  };

  const stopSound = (key: SoundKey): void => {
    const ref = refs[key];
    if (ref.current) {
      ref.current.pause();
      ref.current.currentTime = 0;
    }
  };


  const [popupOpen, setPopupOpen] = useState(true);  


  const backgroundImage = `/splash-${context.postData!["color"]!}.jpg`

  useEffect(() => {
    playSound("backgroundMusic", { loop: true, volume: 0.3 });


    GameController.subscribe(GameController.onCheer, () => playSound("win"));
    GameController.subscribe(GameController.onStart, () => playSound("start"));
    GameController.subscribe(GameController.onTileSelected, () => playSound("tile"));

    GameController.subscribe(GameController.onWrong, () => playSound("wrong"));
    GameController.subscribe(GameController.onRight, () => playSound("correct"));

    GameController.difficulty = String(context.postData?.["difficulty"]);
    GameController.theme = String(context.postData?.["theme"]);

    const words = context.postData?.["words"];
    const difficulty = String(context.postData?.["difficulty"] ?? "");



    if (Array.isArray(words) && words.every(w => typeof w === "string")) {
      GameController.setupGame(words, difficulty);
    } else {

    }
    
    GameController.subscribe(GameController.onCheer, onEndGame);

  }, []);
  
  function onEndGame() {
      setDone(true);
  }
  
  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`,
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
        playSound("tile");

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
          <img src="confetti.gif" alt="" style={{ width: "100%", height: "100%" }} />
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

            <Level textColor={"grey"}/>

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
              { image: "slide1.gif", text: "The knight moves in an L shape around the board." },
              { image: "slide2.gif", text: "Collect letters around the board to spell words. Spell more words to get more points!" },
              { image: "slide3.gif", text: "If you get stuck, you can use a hint or skip a word. Be careful! Using hints and skips uses points." },
              { image: "slide4.gif", text: "Watch the time! Spell all of todays words to get bonus points! " },
              { image: "slide5.gif", text: "Good luck! Score high enough and you can end up on the leaderboard!" },
            ]}
        />}

        


      </Popup>


      
      <audio ref={refs.backgroundMusic} src="/backgroundmusic.mp3" />
      <audio ref={refs.correct} src="/correct.mp3" />
      <audio ref={refs.tile} src="/tile.mp3" />
      <audio ref={refs.start} src="/start.mp3" />
      <audio ref={refs.win} src="/win.mp3" />
      <audio ref={refs.wrong} src="/wrong.mp3" />

    </div>
  );
};
