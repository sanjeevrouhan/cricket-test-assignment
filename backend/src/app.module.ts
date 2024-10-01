import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { LoggerModule } from './logger/logger.module';
import { PlayerModule } from './player/player.module';
import { BallByBallCommentaryModule } from './ball-by-ball-commentary/ball-by-ball-commentary.module';
import { MatchModule } from './match/match.module';
import { TeamModule } from './team/team.module';
import { TeamService } from './team/team.service';
import { MatchService } from './match/match.service';
import { PlayerService } from './player/player.service';
import { RolesGuard } from './common/guards/role-guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('DB_URL'),
      }),
    }),
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '60m' },
    }),
    AuthModule,
    BallByBallCommentaryModule,
    PlayerModule,
    MatchModule,
    TeamModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly authService: AuthService,
    private readonly teamService: TeamService,
    private readonly playerService: PlayerService,
    private readonly matchService: MatchService,
  ) {}

  // Automatically create the admin on app startup
  async onModuleInit() {
    await this.authService.seed();
    await this.teamService.seed();
    await this.playerService.seed();
    await this.matchService.seed();
  }
}
