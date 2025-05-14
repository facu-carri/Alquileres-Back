import { Injectable } from '@nestjs/common';
import { InitializeAdmin } from './initializers/admin';
import { RegisterService } from 'src/register/register.service';

@Injectable()
export class DatabaseService {

    constructor(
        private readonly registerService: RegisterService,
    ) {
        new InitializeAdmin(this.registerService)
    }
}