import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecoveryToken } from './token.entity';
import { RecoveryController } from './recovery.controller';
import { RecoveryService } from './recovery.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([RecoveryToken])],
  controllers: [RecoveryController],
  providers: [RecoveryService],
})
export class RecoveryModule {}
