import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { BallByBallCommentaryService } from './ball-by-ball-commentary.service';
import {
  IBallByBallCommentary,
  IPaginatedCommentary,
} from '../schemas/ball.commentory.schema';
import { Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('ball-by-ball-commentary')
@Controller('ball-by-ball-commentary')
export class BallByBallCommentaryController {
  logger: Logger;
  constructor(
    private readonly ballByBallCommentaryService: BallByBallCommentaryService,
  ) {
    this.logger = new Logger(BallByBallCommentaryController.name);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new ball-by-ball commentary' })
  @ApiResponse({
    status: 201,
    description: 'The commentary has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(
    @Body() commentaryData: Partial<IBallByBallCommentary>,
  ): Promise<IBallByBallCommentary> {
    try {
      return await this.ballByBallCommentaryService.create(commentaryData);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Error creating commentary',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('match/:matchId')
  @ApiOperation({ summary: 'Get all commentaries for a specific match' })
  @ApiParam({ name: 'matchId', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Return all commentaries for the match.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async findByMatchId(
    @Param('matchId') matchId: string,
    @Query() query,
  ): Promise<IPaginatedCommentary> {
    try {
      const result = await this.ballByBallCommentaryService.findByMatchId(
        matchId,
        query,
      );
      return result;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Error fetching commentary',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a ball-by-ball commentary' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'The commentary has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Commentary not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<IBallByBallCommentary>,
  ): Promise<IBallByBallCommentary> {
    try {
      const updatedCommentary = await this.ballByBallCommentaryService.update(
        id,
        updateData,
      );
      if (!updatedCommentary) {
        throw new HttpException('Commentary not found', HttpStatus.NOT_FOUND);
      }
      return updatedCommentary;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Error updating commentary',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a ball-by-ball commentary' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'The commentary has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Commentary not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    try {
      const deletedCommentary =
        await this.ballByBallCommentaryService.remove(id);
      if (!deletedCommentary) {
        throw new HttpException('Commentary not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Commentary deleted successfully' };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Error deleting commentary',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
