import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModuleConfigured } from './jwt/JwtModule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthCode } from './dto/authCode.entity';

@Module({
  imports: [UserModule, JwtModuleConfigured, TypeOrmModule.forFeature([AuthCode])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}