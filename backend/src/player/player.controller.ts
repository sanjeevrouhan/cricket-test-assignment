import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import * as fs from 'fs';
import * as path from 'path';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playerService.create(createPlayerDto);
  }

  @Get()
  findAll() {
    // return this.playerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playerService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
    return this.playerService.update(id, updatePlayerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playerService.remove(id);
  }

  @Post('seed')
  async seed() {
    try {
      const filePath = path.join(
        __dirname,
        '..',
        '..',
        'dummyData',
        'players.json',
      );
      const data = await fs.promises.readFile(filePath, 'utf8');
      const players = JSON.parse(data);
      return this.playerService.seedPlayers(players);
    } catch (error) {
      throw new Error(`Failed to seed players: ${error.message}`);
    }
  }
}
