import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientModule } from 'src/users/client/client.module';
import { JwtModuleConfigured } from './jwt/JwtModule';

@Module({
  imports: [ClientModule, JwtModuleConfigured],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
