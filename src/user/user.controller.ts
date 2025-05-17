import { Body, Controller, Delete, Get, Param, ParseIntPipe, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { JwtPayload } from 'src/auth/jwt/jwtPayload';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Get(':id')
    @UseGuards(AuthGuard)
    async getUser(@Param('id', ParseIntPipe) id: number): Promise<Partial<User>> {
        const { email, dni, telefono, nacimiento, nombre, apellido } = await this.userService.getUserById(id)
        return { email, dni, telefono, nacimiento, nombre, apellido }
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    async modifyUser(
        @Param('id', ParseIntPipe) id: number,
        @Body() userDto: UpdateUserDto,
        @Req() req: Request
    ) {
        const { email, rol }: JwtPayload = req['user']
        return await this.userService.modifyUser({ email, id }, userDto, rol)
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async deleteUser(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: Request
    ) {
        const { email, rol } = req['user']
        return await this.userService.deleteUser({email, id}, rol)
    }
}