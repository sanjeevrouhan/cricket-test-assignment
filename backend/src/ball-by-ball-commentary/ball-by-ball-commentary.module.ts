import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BallByBallCommentaryController } from './ball-by-ball-commentary.controller';
import { BallByBallCommentaryService } from './ball-by-ball-commentary.service';
import { BallByBallCommentarySchema } from '../schemas/ball.commentory.schema';
// import { MatchService } from 'src/match/match.service';
import { MatchModule } from 'src/match/match.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'BallByBallCommentary', schema: BallByBallCommentarySchema },
    ]),
    MatchModule,
  ],
  controllers: [BallByBallCommentaryController],
  providers: [BallByBallCommentaryService],
})
export class BallByBallCommentaryModule {}
