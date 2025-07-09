import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserRole } from './user.entity';
import { JwtPayload } from 'src/auth/jwt/jwtPayload';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateUserDtoWithoutPassword } from './dto/update-user.dto';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Get()
    @UseGuards(RoleGuard.bind(RoleGuard, [UserRole.Empleado, UserRole.Admin]))
    async getAllUsers(@Req() req: Request): Promise<User[]> {
        return await this.userService.findAll(req['user'].rol);
    }

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
        @Body() userDto: UpdateUserDtoWithoutPassword,
        @Req() req: Request
    ) {
        const { email, rol }: JwtPayload = req['user']
        return await this.userService.modifyUser({ email, id }, userDto, rol)
    }

    @Delete(':id/deactivate')
    @UseGuards(RoleGuard.bind(RoleGuard, [UserRole.Admin, UserRole.Cliente]))
    async deactivateUser(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: Request
    ) {
        const { email, rol } = req['user']
        return await this.userService.deactivateUser(id, { email, rol });
    }

    @Delete(':id/activate')
    @UseGuards(RoleGuard.bind(RoleGuard, [UserRole.Admin]))
    async activateUser(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return await this.userService.activateUser(id);
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