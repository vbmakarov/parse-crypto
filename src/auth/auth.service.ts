import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginDataDto } from './dto/login.dto';
import { NewUserDto } from '../user/dto/new-user.dto';
import {UserModel} from '../user/user.model'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(private UserService:UserService, private jwtService: JwtService){}

    async login(dto: LoginDataDto){
        const {email, password} = dto
        const userPayload = await this.UserService.findUserByEmail(email)
        if(userPayload){
            const isEqualPassword = await bcrypt.compare(password, userPayload.password)
            if(isEqualPassword){
                const safetyDataPayload = this.generateSafetyPayload(userPayload)
                return {
                    user:safetyDataPayload,
                    token: this.generateToken(safetyDataPayload)
                }
            }

            throw new UnauthorizedException({message:'Пароль неверный'})
        }

        throw new UnauthorizedException({message:'Пользователя с таким email не существует!'})
    }

    async registration(dto:NewUserDto){
        const userPayload = await this.UserService.createUser(dto)
        const safetyDataPayload = this.generateSafetyPayload(userPayload)
        return {
            user:safetyDataPayload,
            token: this.generateToken(safetyDataPayload)
        }
    }

    generateToken(safetyPayload){
        return this.jwtService.sign(safetyPayload)
    }

    generateSafetyPayload(userPayload:UserModel){
        return {id:userPayload.id, email:userPayload.email, role:userPayload.role}
    }

    logout(){

    }


}
