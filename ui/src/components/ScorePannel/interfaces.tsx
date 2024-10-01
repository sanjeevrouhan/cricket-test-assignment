export interface IBatsmanStats {
  wickets: number;
  name?: string;
  runs: number;
  balls: number;
  fours?: number;
  sixes?: number;
}
// Add this new interface
export interface IBallCommentary {
  _id: string;
  over: number;
  ball: number;
  commentary: string;
  runs: number;
}

export interface IBowlerStats {
  fours: number;
  sixes: number;
  name?: string;
  overs: number;
  runs: number;
  maidens: number;
  wickets: number;
}

export interface ITeamStats {
  _id?: string;
  value?: string;
  runs: number;
  wickets: number;
  overs: number;
  extras: IExtras;
}

export interface IExtras {
  overThrow: number;
  wides: number;
  noBalls: number;
  byes: number;
  legByes: number;
}

// Define the type for your context value
export type CricketContextType = {
  teamStats: ITeamStats;
  bowlerStats: { [key: string]: IBowlerStats };
  batsmanStats: { [key: string]: IBatsmanStats };
  strikerBatsman: string;
  nonStrikerBatsman: string;
  selectedBowler: string;
  matchStats: {
    playingTeam: { value: string; runs: number; wickets: number; overs: number; extras: number };
    nonPlayingTeam: { value: string; runs: number; wickets: number; overs: number; extras: number };
    result: null;
  };
  currentInning: number;
  ballHistory: string[];
  ballCommentary: IBallCommentary[] | [];
} | null;
