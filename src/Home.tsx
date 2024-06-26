import { useNavigate } from "react-router-dom";
import { GeneralFacts, LeaderboardEntry } from "./GameResults";
import { FC, useEffect } from "react";

export const AppTitle = "Chess Companion App";

interface HomeProps {
    leaderboardData: LeaderboardEntry[];
    setTitle: (t: string) => void;
    generalFacts: GeneralFacts;
    avgGameDurationsByPlayerCount: {
        numberOfPlayers:number;
        avgGameDuration: any;
    }[];
}

export const Home: FC<HomeProps> = ({ 
    leaderboardData
    , setTitle
    , generalFacts
    , avgGameDurationsByPlayerCount
 }) => {


    console.log(avgGameDurationsByPlayerCount);

    useEffect(
        () => setTitle(AppTitle)
        , []
    );

    const nav = useNavigate();

    return (
        <div
            className="flex flex-col gap-3"
        >

            <button
                className="btn btn-lg btn-primary"
                onClick={() => nav('./setup')}
            >
                Play
            </button>
            <div
                className="card bg-base-100 shadow-xl"
            >
                <div
                    className="card-body p-3"
                >
                    <h2
                        className="card-title"
                    >
                        General
                    </h2>
                    <table
                        className="table"
                    >
                        <tbody>
                            <tr>
                                <td>
                                    Total Games
                                </td>
                                <td>
                                    {generalFacts.totalGames}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Last Played
                                </td>
                                <td>
                                    {generalFacts.lastPlayed}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Shortest Game
                                </td>
                                <td>
                                    {generalFacts.shortestGame}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Longest Game
                                </td>
                                <td>
                                    {generalFacts.longestGame}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div
                className="card bg-base-100 shadow-xl"
            >
                <div
                    className="card-body p-3"
                >
                    <h2
                        className="card-title"
                    >
                        Leaderboard
                    </h2>
                    {
                        leaderboardData.length > 0
                            ? (
                                <table
                                    className="table"
                                >
                                    <thead>
                                        <tr>
                                            <th>Wins</th>
                                            <th>Losses</th>
                                            <th>Avg.</th>
                                            <th>Player</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            leaderboardData.map(lbe => (
                                                <tr
                                                    key={lbe.name}
                                                >
                                                    <td>
                                                        {lbe.wins}
                                                    </td>
                                                    <td>
                                                        {lbe.losses}
                                                    </td>
                                                    <td>
                                                        {lbe.avg.toFixed(2)}
                                                    </td>
                                                    <td>
                                                        {lbe.name}
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            )
                            
                            : (
                                <p>
                                    Play a game to see the leaderboard!
                                </p>
                            )
                    }
                    
                </div>
            </div>
            <div
                className="card bg-base-100 shadow-xl"
            >
                <div
                    className="card-body p-3"
                >
                    <h2
                        className="card-title text-nowrap"
                    >
                        Average Game Time
                    </h2>
                    {
                        avgGameDurationsByPlayerCount.length > 0
                            ? (
                                        
                                            avgGameDurationsByPlayerCount.map(agdbpc => (
                                                
                                                <h1 
                                                    className="text-sm"
                                                    key={agdbpc.avgGameDuration}
                                                >
                                                    {agdbpc.avgGameDuration}
                                                </h1>

                                            ))
                                        
                            )
                            
                            : (
                                <p>
                                    Play a game to see the average game times!
                                </p>
                            )
                    }
                    
                </div>
            </div>
            <div
                className="card bg-base-100 shadow-xl"
            >
                <div
                    className="card-body p-3"
                >
                    <h2
                        className="card-title"
                    >
                        Average White Pieces Chosen
                    </h2>
                    
                </div>
            </div>
        </div>
    );
};