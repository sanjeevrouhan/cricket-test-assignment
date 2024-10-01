import { Injectable } from '@nestjs/common';
import { UpdateTeamDto } from './dto/update-team.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITeam } from '../schemas/team';
import { getJson } from '../common/utils/fileReaders';

@Injectable()
export class TeamService {
  constructor(@InjectModel('Team') private teamModel: Model<ITeam>) {}
  create(_) {
    return 'This action adds a new team';
  }

  findAll() {
    return `This action returns all team`;
  }

  findOne(id: number) {
    return `This action returns a #${id} team`;
  }

  update(id: number, updateTeamDto: UpdateTeamDto) {
    return `This action updates a #${id} team`;
  }

  remove(id: number) {
    return `This action removes a #${id} team`;
  }
  async seed() {
    const data = getJson('teams');
    for (const team of data) {
      const existingTeam = await this.teamModel.findOne({ _id: team._id });
      if (!existingTeam) {
        await this.teamModel.create(team);
      }
    }
    return 'Seed operation completed';
  }
}
