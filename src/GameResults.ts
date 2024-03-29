import { durationFormatter } from 'human-readable';

const formatterDefault = durationFormatter(); 
const formatterYMD = durationFormatter({
    allowMultiples: ['y', 'mo', 'd']
});
// Type definitions...

export type ChessPlayer = {
    name: string;
    color: "white" | "black";
};

export type GameResult = {
    winner: string;
    players: ChessPlayer[];
    start: string;
    end: string;
};

export type LeaderboardEntry = {
    wins: number;
    losses: number;
    avg: number;
    name: string;
};

export type GeneralFacts = {
    totalGames: number;
    lastPlayed: string;
    shortestGame: string;
    longestGame: string;
};


// External Functions...

export const getPreviousPlayers = (results: GameResult[]) => {

    const previousPlayers = results.flatMap(
        x => x.players
    ).map(x => x.name);

    return [
        ...new Set(previousPlayers)
    ].sort(
        (a, b) => a.localeCompare(b)
    );

};

export const getLeaderboard = (results: GameResult[]): LeaderboardEntry[] => {
    
    const players = getPreviousPlayers(results);
    
    return players.map(
        x => getLeaderboardEntryForPlayer(results, x)
    ).sort(
        // (a, b) => b.avg - a.avg

        // i-o-g
        (a, b) => (b.avg * 1000 + b.wins + b.losses) - (a.avg * 1000 + a.wins + a.losses)
    );
};

export const getGeneralFacts = (results: GameResult[]): GeneralFacts => {

    const now = Date.now();

    const gameEndDatesInMilliseconds = results.map(
        x => Date.parse(x.end)
    );

    const gameDurationsInMilliseconds = results.map(
        x => Date.parse(x.end) - Date.parse(x.start)
    );

    return {
        totalGames: results.length
        , lastPlayed: 
            results.length 
            ? `${formatterYMD(
                now - Math.max(...gameEndDatesInMilliseconds)
            )} ago`
            : "n/a"
        , shortestGame: 
            results.length
            ? formatterDefault(
                Math.min(...gameDurationsInMilliseconds)
        ) as string
        : "n/a"
        , longestGame: 
            results.length
            ? formatterDefault(
                Math.max(...gameDurationsInMilliseconds)
        ) as string
        : "n/a"
    };
};

// Internal Functions...

const getLeaderboardEntryForPlayer = (results: GameResult[], player: string): LeaderboardEntry => {

    const playerWins = results.filter(x => x.winner === player).length;
    const playerGames = results.filter(
        x => x.players.some(
            y => y.name === player
        )
    ).length;

    return {
        wins: playerWins
        , losses: playerGames - playerWins

        , avg: playerGames > 0
            ? playerWins / playerGames
            : 0
            
        , name: player
    };
};



