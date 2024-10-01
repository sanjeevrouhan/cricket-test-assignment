import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  IBallByBallCommentary,
  IPaginatedCommentary,
} from '../schemas/ball.commentory.schema';
import { MatchService } from 'src/match/match.service';

@Injectable()
export class BallByBallCommentaryService {
  constructor(
    @InjectModel('BallByBallCommentary')
    private readonly ballByBallCommentaryModel: Model<IBallByBallCommentary>,
    private readonly matchService: MatchService,
  ) {}

  async create(commentaryData: Partial<any>): Promise<IBallByBallCommentary> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { extras, value, ...currentScore } = commentaryData.teamUpdatedStats;
    const {
      currentBowler,
      currentBatsmen,
      matchId,
      currentInnings,
      recentBalls,
    } = commentaryData;
    const dataUpdateInMatch = {
      currentScore,
      extras,
      currentBowler,
      currentBatsmen,
      currentInnings,
      recentBalls,
    };
    const newCommentary = new this.ballByBallCommentaryModel(commentaryData);
    const commentary = await newCommentary.save();
    await this.matchService.update(matchId, dataUpdateInMatch);
    return commentary;
  }

  async findByMatchId(
    matchId: string,
    query: any,
  ): Promise<IPaginatedCommentary> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
    } = query;
    const skip = (page - 1) * limit;
    const filter: any = { matchId };
    if (search) {
      filter.$or = [
        { commentary: { $regex: search, $options: 'i' } },
        { bowler: { $regex: search, $options: 'i' } },
        { batsman: { $regex: search, $options: 'i' } },
      ];
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [data, total] = await Promise.all([
      this.ballByBallCommentaryModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select({ id: 1, runs: 1, commentary: 1, matchId: 1, createdAt: 1 }),
      this.ballByBallCommentaryModel.countDocuments(filter),
    ]);
    return {
      data: data,
      total,
      page: Number(page),
    } as unknown as IPaginatedCommentary;
  }

  async update(
    id: string,
    updateData: Partial<IBallByBallCommentary>,
  ): Promise<IBallByBallCommentary | null> {
    return await this.ballByBallCommentaryModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );
  }

  async remove(id: string): Promise<IBallByBallCommentary | null> {
    return await this.ballByBallCommentaryModel.findByIdAndDelete(id);
  }
}
