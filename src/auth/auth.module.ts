import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModuleConfigured } from './jwt/JwtModule';

@Module({
  imports: [UserModule, JwtModuleConfigured],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
