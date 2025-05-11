import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { UserModule } from 'src/users/client/user.module';

@Module({
    imports: [UserModule],
    controllers: [RegisterController],
    providers: [RegisterService],
})
export class RegisterModule {}
