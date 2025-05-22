import { Injectable } from '@nestjs/common';
import { InitializeAdmin } from './initializers/admin';
import { InitializeMaquinarias } from './initializers/maquinarias';
import { RegisterService } from 'src/register/register.service';
import { MaquinariaService } from 'src/maquinaria/maquinaria.service';

@Injectable()
export class DatabaseService {

    constructor(
        private readonly registerService: RegisterService,
        private readonly maquinariaService: MaquinariaService
    ) {
        new InitializeAdmin(this.registerService)
        new InitializeMaquinarias(this.maquinariaService)
    }
}