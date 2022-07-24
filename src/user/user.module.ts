import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {UserModel} from './user.model'
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [forwardRef(()=>AuthModule), 
  SequelizeModule.forFeature([UserModel])
],
  exports:[UserService]
})
export class UserModule {}
