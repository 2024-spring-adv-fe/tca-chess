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

export type WhitePiecePercentEntry = {
    name: string;
    percent: string;
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
        (x) => Date.parse(x.end)
    );

    const gameDurationsInMilliseconds = results.map(
       (x) => getGameDurationInMilliseconds(x)
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

export const getAverageGameDurationsByPlayerCount = (grs: GameResult[]) => {

    //Group game results by player count, advanced reduce()...
    const grouped = grs.reduce(
        (acc, x) => acc.set(
            x.players.length
            //, [x]
            , [
                ...acc.get(x.players.length) ?? []
                , x
            ]
        ) 
        , new Map<number, GameResult[]>()
    );

    // const grouped = Map.groupBy(
    //     grs
    //     , (x) => x.players.length

    //     // Show off nonsense, but fun : - )) 
    //     //, (x) => x.winner.length 
    // );

    //console.log(grouped);

    // Shape the grouped results into something to display these fun facts... Includes sorting...
    return [...grouped]
        .sort((a, b) => a[0] - b[0])
        .map(x => ({
            numberOfPlayers: x[0]
            , avgGameDuration: formatterDefault(getAvgGameDuration(x[1]))
        }))
    ;
};

export const getWhitePiecePercentData = (results: GameResult[]): WhitePiecePercentEntry[] => {
    
    const players = getPreviousPlayers(results);
    
    return players.map(
        x => getWhitePiecePercentEntryForPlayer(results, x)
    );
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

const getGameDurationInMilliseconds = (gr: GameResult) => Date.parse(gr.end) - Date.parse(gr.start);

const getAvgGameDuration = (grs: GameResult[]) => {

    // Add up all the game durations, simple reduce()...
    const totalGameTimeInMilliseconds = grs.reduce(
        (acc, x) => acc + getGameDurationInMilliseconds(x)
        , 0
    );

    // Average is that total divided by number of games, accounting for divide by zero errors...
    return grs.length > 0
        ? totalGameTimeInMilliseconds / grs.length
        : 0
    ;
};

const getWhitePiecePercentEntryForPlayer = (results: GameResult[], player: string): WhitePiecePercentEntry => {

    // Get player games...
    // We do this elsewhere around here...
    const playerGames: GameResult[] = [];

    // Get player games where player was white pieces...
    // This is the tricky logic, I may not have it correct ? ? ?
    const playerGamesWhitePieces = playerGames.filter(
        x => x.players.some(
            y => y.name === player && y.color === 'white'
        )
    );

    return playerGames.length > 0
        ? {
            name: player 
            , percent: 'n/a'
        }
        : {
            name: player 
            , percent: (playerGamesWhitePieces.length / playerGames.length * 100).toFixed(2)
        }
}



