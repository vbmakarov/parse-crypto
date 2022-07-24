import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { NewUserDto } from './dto/new-user.dto'
import {UserModel} from './user.model'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {

    constructor(
        @InjectModel(UserModel) private userTable: typeof UserModel,
    ){}

    async createUser(userDto: NewUserDto){
        const isExistEmail = await this.findUserByEmail(userDto.email)
        if(isExistEmail){
            throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST);
        }
       const hashPassword = await bcrypt.hash(userDto.password, 10);
       const user = await this.userTable.create({...userDto, password: hashPassword})
       return user
    }

    async findUserById(id:number){
        const findUser = await this.userTable.findOne({where:{id}})
        if(!findUser){
            throw new HttpException('Пользователь с таким id не существует', HttpStatus.BAD_REQUEST);
        }
        return findUser
    }

    async findUserByEmail(email:string){
        const findUser =  await this.userTable.findOne({where:{email}})
        return findUser
    }
}
