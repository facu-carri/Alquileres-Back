import { BadRequestException, Body, Controller, Delete, Get, Param, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserRole } from './user.entity';
import { UserDto } from './dto/user.dto';
import { JwtPayload } from 'src/auth/jwt/jwtPayload';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Get(':id')
    async getUser(@Param('id') id: number): Promise<User> {
        return await this.userService.getUserById(id)
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    async modifyUser(
        @Param('id') id: number,
        @Body() userDto: UpdateUserDto,
        @Req() req: Request
    ) {
        const { email, rol }: JwtPayload = req['user']
        return await this.userService.modifyUser({ email, id }, userDto, rol)
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async deleteUser(
        @Param('id') id: number,
        @Req() req: Request
    ) {
        const { email, rol } = req['user']
        return await this.userService.deleteUser({email, id}, rol)
    }
}