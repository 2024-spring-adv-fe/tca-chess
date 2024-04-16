import React, { useEffect, useState } from 'react';
import './App.css';

import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";

import { Home, AppTitle } from "./Home"
import { Setup } from "./Setup"
import { Play } from "./Play"
import {
  GameResult
  , getLeaderboard
  , getGeneralFacts
  , getPreviousPlayers
  , ChessPlayer
  , getAverageGameDurationsByPlayerCount
} from './GameResults';
import { loadGamesFromCloud, saveGameToCloud } from './tca-cloud-api';


const App = () => {

  const [gameResults, setGameResults] = useState<GameResult[]>([]);

  const [title, setTitle] = useState(AppTitle);

  const [chosenPlayers, setChosenPlayers] = useState<ChessPlayer[]>([]);

  const [darkMode, setDarkMode] = useState(false);

  useEffect(
    () => {
      const init = async () => {
        
        if (!ignore) {
          const cloudGameResults = await loadGamesFromCloud(
            "julia.cd345@gmail.com"
            , "tca-chess-24s"
          );

          setGameResults(cloudGameResults);
        }
      };

      let ignore = false;

      init();

      return () => {
        ignore = true;
      };
    }
    , []
  );

  const addNewGameResult = async (result: GameResult) => {

    //Save game result to the cloud 
    await saveGameToCloud(
      "julia.cd345@gmail.com" //hardcoded for now
      , "tca-chess-24s"
      , result.end 
      , result
    )
    //Optimistically update the lifted state with the new game result 
    setGameResults(
      [
        ...gameResults
        , result
      ]
    );
  };

  const router = createHashRouter([
    {
      path: "/",
      element: <Home
        leaderboardData={getLeaderboard(gameResults)}
        generalFacts={getGeneralFacts(gameResults)}
        setTitle={setTitle}
        avgGameDurationsByPlayerCount={getAverageGameDurationsByPlayerCount(gameResults)}
      />
    },
    {
      path: "/setup",
      element: <Setup
        setTitle={setTitle}
        previousPlayers={getPreviousPlayers(gameResults)}
        setChosenPlayers={setChosenPlayers}
      />
    },
    {
      path: "/play",
      element: <Play
        addNewGameResult={addNewGameResult}
        setTitle={setTitle}
        chosenPlayers={chosenPlayers}
      />
    }
  ]);


  return (
    <div
      className="App"
      data-theme={darkMode ? "dark" : "nord"}
    >
      <div className='navbar bg-base-300'>
        {
          title === AppTitle &&
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
          </svg>
        }
        <span className='text-lg font-bold ml-3'>
          {title}
        </span>
        <div
          className='ml-auto'
        >
          <label className="swap swap-rotate">

            {/* this hidden checkbox controls the state */}
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />

            {/* sun icon */}
            <svg className="swap-on fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" /></svg>

            {/* moon icon */}
            <svg className="swap-off fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" /></svg>

          </label>
        </div>
      </div>
      <div className='p-3'>
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
