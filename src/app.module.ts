import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import {UserModel} from './user/user.model'
import { ConfigModule } from '@nestjs/config';
import { ParsingModule } from './parsing/parsing.module';
import { SocketIoGateway } from './socketio/socketio.gateway';
import { ParseModel } from './parsing/parsing.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({envFilePath: '.env'}),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [UserModel, ParseModel], 
      autoLoadModels:true,
    }),
    AuthModule,
    UserModule,
    ParsingModule],
  controllers: [AppController],
  providers: [AppService, SocketIoGateway],
})
export class AppModule {}
