import { forwardRef, Module } from '@nestjs/common';
import { ParsingService } from './parsing.service';
import { ParsingController } from './parsing.controller';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ParseModel } from './parsing.model';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [ParsingService],
  controllers: [ParsingController],
  imports:[AuthModule,ConfigModule.forRoot({envFilePath: '.env'}), SequelizeModule.forFeature([ParseModel])],
  exports:[ParsingService]
})
export class ParsingModule {}
