import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IMatch } from 'src/schemas/match.schema';

@Injectable()
export class MatchService {
  constructor(@InjectModel('Match') private matchModel: Model<IMatch>) {}

  create(createMatchDto: Partial<IMatch>) {
    return this.matchModel.create(createMatchDto);
  }

  async findAll(): Promise<IMatch[]> {
    return this.matchModel.find().exec();
  }

  async findOne(id: string): Promise<IMatch> {
    return await this.matchModel.findById(id).populate({
      path: 'teams',
      populate: {
        path: 'players',
        model: 'Player',
      },
    });
  }

  async update(id: string, updateMatchDto: Partial<IMatch>) {
    const updatedMatch = await this.matchModel
      .findByIdAndUpdate(id, updateMatchDto, { new: true })
      .exec();
    if (!updatedMatch) {
      throw new NotFoundException(`Match with ID "${id}" not found`);
    }
    return updatedMatch;
  }

  remove(id: string) {
    return `This action removes a #${id} match`;
  }

  seed(createMatchDto) {
    return this.matchModel.create(createMatchDto);
  }
}
