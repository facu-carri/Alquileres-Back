import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Alquiler } from "./alquiler.entity";
import { Reseña } from "./reseña.entity";
import { AlquilerController } from "./alquiler.controller";
import { AlquilerService } from "./alquiler.service";
import { User } from "src/user/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Alquiler, Reseña, User])],
    controllers: [AlquilerController],
    providers: [AlquilerService],
    exports: [AlquilerService]
})
export class AlquilerModule {}