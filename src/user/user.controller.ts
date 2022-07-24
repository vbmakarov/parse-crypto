import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role-auth.guard';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {

    constructor(private UserService: UserService){}

    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @Get('/find/:id')
    fetchUserById(@Param('id') id:number){
        return this.UserService.findUserById(id)
    }
}
