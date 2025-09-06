import { navigateTo } from '@devvit/web/client';
//import { useCounter } from './hooks/useCounter';
import GameView from './pieces/tileMap.tsx';
import {Game} from './pieces/chessPiece.tsx';


const game: Game = new Game(6, 6, ["at", "be", "to", "tea", "bat", "tab", "abet", "beta", "beat", "bead", "bad", "cab", "cat", "act", "ace"]);

export const App = () => {
  //const { count, username, loading, increment, decrement } = useCounter();
  

  const backgroundStyle = {
    backgroundImage: 'url("/scrabble.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };
  
  return (
    <div className="flex relative flex-col justify-center items-center min-h-screen w-screen gap-4" style={backgroundStyle}>
      {/*}
      <div className="flex flex-col items-center gap-2">
        <p className="text-2xl font-bold text-center text-gray-900 ">
          {username ? `${username}` : ''}
        </p>
      </div>
      */}

      <GameView/>

      <footer className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 text-[0.8em] text-gray-600">
        <button
          className="cursor-pointer"
          onClick={() => navigateTo('https://developers.reddit.com/docs')}
        >
          Docs
        </button>
        <span className="text-gray-300">|</span>
        
      </footer>
    </div>
  );
};
