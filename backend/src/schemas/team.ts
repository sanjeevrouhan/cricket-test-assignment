import mongoose, { Schema, Document } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  shortName: string;
  logo?: string;
  country: string;
  players: mongoose.Types.ObjectId[];
  captain?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const TeamSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    shortName: { type: String, required: true, unique: true },
    logo: { type: String },
    country: { type: String, required: true },
    players: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
    captain: { type: Schema.Types.ObjectId, ref: 'Player' },
  },
  { timestamps: true },
);

export default mongoose.model<ITeam>('Team', TeamSchema);
