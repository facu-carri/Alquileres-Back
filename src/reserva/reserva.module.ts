import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './reserva.entity';
import { ReservaController } from './reserva.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Reserva])],
    controllers: [ReservaController],
    providers: [ReservaController]
})
export class ReservaModule {}