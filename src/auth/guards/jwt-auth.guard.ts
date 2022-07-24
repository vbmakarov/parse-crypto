import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";


@Injectable()
export class JwtAuthGuard implements CanActivate{

    constructor(private JwtService: JwtService){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>{

        const request = context.switchToHttp().getRequest();
        try{
            const headerAuthorization = request.headers.authorization
            const bearer = headerAuthorization.split(' ')[0]
            const token = headerAuthorization.split(' ')[1]
            if(bearer!=='Bearer' || !token){
                throw new UnauthorizedException({message:"Пользователь не авторизован"})
            }
            const user = this.JwtService.verify(token)
            request.user = user
            return true
        }catch(e){
            throw new UnauthorizedException({message:"Пользователь не авторизован"})
        }
    }
}