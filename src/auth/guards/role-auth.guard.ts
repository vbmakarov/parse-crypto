import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { Role } from "../enums/role.enum";
import { ROLES_KEY } from "../decorators/roles.decorator";


@Injectable()
export class RolesGuard implements CanActivate{

    constructor(private JwtService: JwtService, private reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>{

        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
          ]);

          if (!requiredRoles) {
            return true;
          }

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
            return requiredRoles.some((role) => request.user.role?.includes(role));
        }catch(e){
            console.log(e)
            throw new HttpException({message:"У Вас нет доступа к данному ресурсу"}, HttpStatus.FORBIDDEN)
        }
    }
}