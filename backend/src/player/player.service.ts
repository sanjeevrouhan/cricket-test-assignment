import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { IPlayer } from 'src/schemas/player.schema';

@Injectable()
export class PlayerService {
  constructor(@InjectModel('Player') private playerModel: Model<IPlayer>) {}

  async create(createPlayerDto: CreatePlayerDto): Promise<IPlayer> {
    const createdPlayer = new this.playerModel(createPlayerDto);
    return createdPlayer.save();
  }

  async findAllWithFilters(
    search?: string,
    sort?: string,
    order: 'asc' | 'desc' = 'asc',
    page = 1,
    limit = 10,
    ageMin?: number,
    ageMax?: number,
    heightMin?: number,
    heightMax?: number,
    weightMin?: number,
    weightMax?: number,
    team?: string,
    position?: string,
  ): Promise<{ players: IPlayer[]; total: number }> {
    const query = this.playerModel.find();

    if (search) {
      query.or([
        { name: { $regex: search, $options: 'i' } },
        { team: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } },
      ]);
    }

    if (team) {
      query.where('team').equals(team);
    }

    if (position) {
      query.where('position').equals(position);
    }

    if (ageMin !== undefined || ageMax !== undefined) {
      query
        .where('age')
        .gte(ageMin || 0)
        .lte(ageMax || Number.MAX_SAFE_INTEGER);
    }

    if (heightMin !== undefined || heightMax !== undefined) {
      query
        .where('height')
        .gte(heightMin || 0)
        .lte(heightMax || Number.MAX_SAFE_INTEGER);
    }

    if (weightMin !== undefined || weightMax !== undefined) {
      query
        .where('weight')
        .gte(weightMin || 0)
        .lte(weightMax || Number.MAX_SAFE_INTEGER);
    }

    if (sort) {
      query.sort({ [sort]: order });
    }

    const total = await this.playerModel.countDocuments(query.getFilter());

    const players = await query
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return { players, total };
  }

  async findOne(id: string): Promise<IPlayer> {
    return this.playerModel.findById(id).exec();
  }

  async update(id: string, updatePlayerDto: UpdatePlayerDto): Promise<IPlayer> {
    return this.playerModel
      .findByIdAndUpdate(id, updatePlayerDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<IPlayer> {
    return this.playerModel.findByIdAndDelete(id).exec();
  }

  async seedPlayers(players: Partial<IPlayer>[]): Promise<string> {
    const savedPlayers = await this.playerModel.insertMany(players);
    return `Successfully seeded ${savedPlayers.length} players`;
  }
}
