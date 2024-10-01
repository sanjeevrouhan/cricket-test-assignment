import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MatchService } from './match.service';
import { IMatch } from 'src/schemas/match.schema';
@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  create(@Body() createMatchDto: Partial<IMatch>) {
    return this.matchService.create(createMatchDto);
  }

  @Get()
  findAll() {
    return this.matchService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMatchDto: Partial<IMatch>) {
    return this.matchService.update(id, updateMatchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchService.remove(id);
  }
}
