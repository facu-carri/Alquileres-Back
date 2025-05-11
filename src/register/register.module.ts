import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { ClientModule } from 'src/users/client/client.module';

@Module({
    imports: [ClientModule],
    controllers: [RegisterController],
    providers: [RegisterService],
})
export class RegisterModule {}
