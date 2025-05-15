import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtPayload } from 'src/auth/jwt/jwtPayload';
import { UserRole } from 'src/user/user.entity';

@Injectable()
export class RoleGuard extends AuthGuard {

    constructor(private roles: UserRole[], protected jwtService: JwtService) {
        super(jwtService)
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest()
        const isValidToken = await super.canActivate(context)
        if (!isValidToken) return false
        
        const payload: JwtPayload = req['user']
        return this.roles.includes(payload.rol)
    }
}