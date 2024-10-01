import mongoose, { Schema, Document } from 'mongoose';
import { extraScoreSchema } from './match.schema';

export interface IBallByBallCommentary extends Document {
  matchId: mongoose.Types.ObjectId;
  over: number;
  ball: number;
  bowler: mongoose.Types.ObjectId;
  batsman: mongoose.Types.ObjectId;
  nonStriker: mongoose.Types.ObjectId;
  runs: number;
  isWicket: boolean;
  dismissalType?: string;
  fielder?: mongoose.Types.ObjectId;
  extras?: {
    wides: number;
    noBalls: number;
    byes: number;
    legByes: number;
    overThrow: number;
  };
  commentary: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaginatedCommentary {
  data: IBallByBallCommentary;
  page: number;
  total: number;
}

export const BallByBallCommentarySchema: Schema = new Schema(
  {
    matchId: { type: Schema.Types.ObjectId, ref: 'Match', required: true },
    over: { type: Number, required: true },
    ball: { type: Number, required: true, min: 1, max: 6 },
    bowler: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
    batsman: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
    nonStriker: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
    runs: { type: Number, required: true, default: 0 },
    isWicket: { type: Boolean, required: true, default: false },
    dismissalType: { type: String },
    fielder: { type: Schema.Types.ObjectId, ref: 'Player' },
    extras: extraScoreSchema,
    commentary: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model<IBallByBallCommentary>(
  'BallByBallCommentary',
  BallByBallCommentarySchema,
);
