import { useNavigate } from "react-router-dom";
import { LeaderboardEntry } from "./GameResults";
import { FC, useEffect } from "react";

export const AppTitle = "Chess Companion App";

interface HomeProps {
    leaderboardData: LeaderboardEntry[];
    setTitle: (t: string) => void;
}

export const Home: FC<HomeProps> = ({ leaderboardData, setTitle }) => {

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
                    className="card-body"
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
        </div>
    );
};