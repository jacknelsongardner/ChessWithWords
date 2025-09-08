
import {GameView} from './view/View';
import { GameController } from './control/GameController.js';
import "./view/background.css";



export const App = () => {

  const backgroundStyle = {
    backgroundImage: 'url("/background5.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };
  
  return (
    <div className="blur-bg flex relative flex-col justify-center items-center min-h-screen w-screen gap-4" style={backgroundStyle}>

      <GameView/>

    </div>
  );
};
