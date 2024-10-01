import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { LoggerModule } from './logger/logger.module';
import { AdminSeederService } from './migrations/admin-seeder.service';
import { User, UserSchema } from './schemas/user.schema';
// import { BallByBallCommentaryModule } from './ball-by-ball-commentary/ball-by-ball-commentary.module';
// import { BallByBallCommentaryService } from './ball-by-ball-commentary/ball-by-ball-commentary.service';
import { PlayerModule } from './player/player.module';
import { BallByBallCommentaryModule } from './ball-by-ball-commentary/ball-by-ball-commentary.module';
import { MatchModule } from './match/match.module';
import { TeamModule } from './team/team.module';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('DB_URL'),
      }),
    }),
    AuthModule,
    LoggerModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    BallByBallCommentaryModule,
    PlayerModule,
    MatchModule,
    TeamModule,
  ],
  controllers: [AppController],
  providers: [AppService, AdminSeederService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly adminSeederService: AdminSeederService) {}

  // Automatically create the admin on app startup
  async onModuleInit() {
    await this.adminSeederService.createAdmin();
  }
}
