import { Body, Controller, Post } from '@nestjs/common';
import { NewUserDto } from 'src/user/dto/new-user.dto';
import { AuthService } from './auth.service';
import { LoginDataDto } from './dto/login.dto';

@Controller('/auth')
export class AuthController {

    constructor(private AuthService: AuthService){}

    @Post('/registration')
    registration(@Body() userDto:NewUserDto){
        return this.AuthService.registration(userDto)
    }

    @Post('/login')
    login(@Body() dto: LoginDataDto){
        return this.AuthService.login(dto)
    }
}
