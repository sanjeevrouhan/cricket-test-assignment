import mongoose, { Schema, Document } from 'mongoose';

interface ICurrentBatsman {
  player: mongoose.Types.ObjectId;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
}

interface ICurrentBowler {
  player: mongoose.Types.ObjectId;
  overs: number;
  runs: number;
  wickets: number;
}

interface ICurrentScore {
  runs: number;
  wickets: number;
  overs: number;
}

export interface IMatch extends Document {
  teams: mongoose.Types.ObjectId[];
  venue: string;
  date: Date;
  format: string;
  tossWinner: mongoose.Types.ObjectId;
  tossDecision: string;
  result?: string;
  winningTeam?: mongoose.Types.ObjectId;
  playerOfTheMatch?: mongoose.Types.ObjectId;
  umpires: mongoose.Types.ObjectId[];
  status: string;
  currentInnings?: number;
  currentScore?: ICurrentScore;
  currentBatsmen?: ICurrentBatsman[];
  currentBowler?: ICurrentBowler;
  recentOvers?: (number | string)[][];
  createdAt: Date;
  updatedAt: Date;
}

const CurrentBatsmanSchema: Schema = new Schema({
  player: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
  runs: { type: Number, required: true },
  balls: { type: Number, required: true },
  fours: { type: Number, required: true },
  sixes: { type: Number, required: true },
});

const CurrentBowlerSchema: Schema = new Schema({
  player: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
  overs: { type: Number, required: true },
  runs: { type: Number, required: true },
  wickets: { type: Number, required: true },
});

const CurrentScoreSchema: Schema = new Schema({
  runs: { type: Number, required: true },
  wickets: { type: Number, required: true },
  overs: { type: Number, required: true },
});

export const extraScoreSchema: Schema = new Schema({
  wides: { type: Number, required: true, default: 0 },
  noBalls: { type: Number, required: true, default: 0 },
  byes: { type: Number, required: true, default: 0 },
  legByes: { type: Number, required: true, default: 0 },
  overThrow: { type: Number, required: true, default: 0 },
});

export const MatchSchema: Schema = new Schema(
  {
    teams: [{ type: Schema.Types.ObjectId, ref: 'Team', required: true }],
    venue: { type: String, required: true },
    date: { type: Date, required: true },
    format: { type: String, required: true, enum: ['Test', 'ODI', 'T20'] },
    tossWinner: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    tossDecision: { type: String, required: true, enum: ['Bat', 'Field'] },
    result: { type: String },
    winningTeam: { type: Schema.Types.ObjectId, ref: 'Team' },
    playerOfTheMatch: { type: Schema.Types.ObjectId, ref: 'Player' },
    umpires: [{ type: Schema.Types.ObjectId, ref: 'Umpire', required: true }],
    status: {
      type: String,
      required: true,
      enum: ['upcoming', 'ongoing', 'completed'],
    },
    currentInnings: { type: Number, min: 1, max: 2 },
    currentScore: CurrentScoreSchema,
    currentBatsmen: [CurrentBatsmanSchema],
    currentBowler: CurrentBowlerSchema,
    recentOvers: [[Schema.Types.Mixed]],
    extras: extraScoreSchema,
    recentBalls: [Schema.Types.Mixed],
  },
  { timestamps: true },
);

export default mongoose.model<IMatch>('Match', MatchSchema);
