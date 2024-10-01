import mongoose, { Schema, Document } from 'mongoose';

export interface IPlayer extends Document {
  name: string;
  dateOfBirth: Date;
  country: string;
  role: string;
  battingStyle: string;
  bowlingStyle?: string;
  jerseyNumber?: number;
  stats: {
    matches: number;
    runs: number;
    wickets: number;
    battingAverage: number;
    bowlingAverage?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export const PlayerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    country: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: [
        'Batsman',
        'Bowler',
        'All-rounder',
        'Wicket-keeper',
        'Wicket-keeper-batsman',
      ],
    },
    battingStyle: {
      type: String,
      required: true,
      enum: ['Right-handed', 'Left-handed'],
    },
    bowlingStyle: {
      type: String,
      enum: [
        'Right-arm-fast',
        'Left-arm-fast',
        'Right-arm-medium',
        'Left-arm-medium',
        'Right-arm-off-break',
        'Left-arm-orthodox',
        'Leg-break',
        'Right-arm-leg-break',
      ],
    },
    jerseyNumber: { type: Number },
    stats: {
      matches: { type: Number, default: 0 },
      runs: { type: Number, default: 0 },
      wickets: { type: Number, default: 0 },
      battingAverage: { type: Number, default: 0 },
      bowlingAverage: { type: Number },
    },
  },
  { timestamps: true },
);

export default mongoose.model<IPlayer>('Player', PlayerSchema);
