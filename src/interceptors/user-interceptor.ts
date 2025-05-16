import { ExecutionContext, Injectable, NestInterceptor, CallHandler } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from 'src/auth/jwt/jwtPayload';
import { UserRole } from 'src/user/user.entity';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const req = context.switchToHttp().getRequest();
    const token = req.headers['authorization']?.split(' ')[1];

    req.user = (token ? await this.jwtService.verifyAsync(token) : { rol: 'visitante' });
    return next.handle();
  }
}