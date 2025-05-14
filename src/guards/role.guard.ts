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
        const isValidToken = await super.canActivate(context)
        if (!isValidToken) return false
        
        const token = this.getToken(context)
        const decode: JwtPayload = this.jwtService.decode(token) // Trae mas datos, pero en este caso solo importan estos

        return this.roles.includes(decode.rol)
    }
}