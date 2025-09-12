// App.tsx
import { useState } from "react";
import { GameView } from "./view/View";
import { GameController } from "./control/GameController.js";
import "./view/background.css";
import { Popup } from "./Popup";
import { Slideshow } from "./Slideshow";

export const App = () => {
  const [popupOpen, setPopupOpen] = useState(true); // starts open

  const backgroundStyle = {
    backgroundImage: 'url("/background3.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div
      className="blur-bg flex relative flex-col justify-center items-center min-h-screen w-screen gap-4"
      style={backgroundStyle}
    >
      {/* Greyed out while popup is open */}
      <div className="blur-bg flex relative flex-col justify-center items-center min-h-screen w-screen gap-4" style={backgroundStyle}> 
        <GameView/> 
      </div>

      {/* Popup */}
      <Popup isOpen={popupOpen} onClose={() => setPopupOpen(false)}>
        <Popup isOpen={popupOpen} onClose={() => setPopupOpen(false)}>
          <Slideshow
            onFinish={() => setPopupOpen(false)}
            slides={[
              { image: "/images/slide1.png", text: "Welcome to the game! Here’s how it works." },
              { image: "/images/slide2.png", text: "Defeat enemies by solving puzzles." },
              { image: "/images/slide3.png", text: "Collect rewards and level up!" },
              { image: "/images/slide4.png", text: "Good luck! Let's get started." },
            ]}
          />
        </Popup>

      </Popup>
    </div>
  );
};
