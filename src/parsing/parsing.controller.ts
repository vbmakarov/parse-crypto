import { Controller, Get,UseGuards } from '@nestjs/common';
import { ParsingService } from './parsing.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role-auth.guard';

@Controller('/api')
export class ParsingController {

    constructor(private ParsingService: ParsingService){}
    
    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @Get('/startparse')
    startParse(){
        process.env.ALLOW_PARSE = "true"
        this.ParsingService.startParse()
        return "Start parse"
    }

    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @Get('/stopparse')
    stopParse(){
        process.env.ALLOW_PARSE = "false"
        return "Stop parse"
    }


    @Get('/last')
    lastRecord(){
        return this.ParsingService.lastRecord()
    }
}
