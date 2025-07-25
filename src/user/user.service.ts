import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not } from 'typeorm';
import { User, UserRole } from './user.entity';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { response } from 'express';
import { Reserva, ReservaStates } from 'src/reserva/reserva.entity';
import { AlquilerService } from 'src/alquiler/alquiler.service';
import { AlquilerStates } from 'src/alquiler/alquiler.entity';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Reserva)
        private readonly reservaRepository: Repository<Reserva>,

        private readonly alquilerService: AlquilerService
    ) {}

    async create(userDto: UserDto, rol: UserRole): Promise<User> {
        return await this.userRepository.save({ ...userDto, rol: rol });
    }

    async findAll(rol: UserRole): Promise<User[]> {
        if (rol === UserRole.Admin) {
            return await this.userRepository.find({ 
                where: { rol: Not(UserRole.Admin) }, 
                select: ['id', 'email', 'dni', 'nombre', 'apellido', 'nacimiento', 'telefono', 'isActive', 'fecha_creacion', 'rol']
            });
        }
        if (rol === UserRole.Empleado) {
            return await this.userRepository.find({ 
                where: { rol: In([UserRole.Cliente]), isActive: true }, 
                select: ['id', 'email']
            });
        }
    }

    async findAllByRol(rol: UserRole): Promise<User[]> {
        return await this.userRepository.findBy({ rol })
    }

    async findOne(id: number): Promise<User> {
        return await this.userRepository.findOneBy({ id });
    }
    
    async findOneByEmail(email: string): Promise<User> {
        return await this.userRepository.findOneBy({ email })
    }

    async findOneByDni(dni: string): Promise<User> {
        return await this.userRepository.findOneBy({ dni })
    }

    async existBy(obj: Partial<User>): Promise<boolean> {
        return !!(await this.userRepository.findOneBy(obj))
    }

    async getUserById(id: number): Promise<User> {
        const user = await this.findOne(id);
        if(!user) throw new NotFoundException('No se encontro el id')
        return user
    }

    async sameUserById(email: string, id: number): Promise<boolean> {
        const userByEmail = await this.findOneByEmail(email)
        const userById = await this.getUserById(id)
        return userByEmail && userById ? userByEmail.id == userById.id : false
    }

    async update(obj: Partial<User>, updateUserDto: UpdateUserDto): Promise<any> {
        if (!this.existBy(obj)) throw new NotFoundException('No se encontro el usuario')
        await this.userRepository.update(obj, updateUserDto);
        return response.status(200)
    }

    // El email enviado en obj suele ser el cargado en payload
    // si se quiere modificar un usuario mediante un rol
    // El email debe ser cambiado por el del usuario target (se lo busca segun el id)
    async getTargetEmail(obj: Partial<User>, role: UserRole, wantedRoles: UserRole[]): Promise<void> {
        if (wantedRoles.includes(role)) {
            const user = await this.getUserById(obj.id ?? 0)
            if (user) obj.email = user.email
            else obj.email = ''
        }
    }

    async modifyUser(obj: Partial<User>, updateUserDto: UpdateUserDto, role: UserRole): Promise<any> {
        await this.getTargetEmail(obj, role, [UserRole.Admin])
        const temp = await this.findOneByDni(updateUserDto.dni)
        if (temp && temp.id != obj.id) throw new BadRequestException('El DNI ya se encuentra registrado.')
        return await this.update(obj, updateUserDto)
    }

    async deleteUser(obj: Partial<User>, role: UserRole): Promise<any> {
        await this.getTargetEmail(obj, role, [UserRole.Admin])
        return this.remove(obj)
    }

    async remove(obj: Partial<User>): Promise<any> {
        if (!this.existBy(obj)) throw new NotFoundException('No se encontro el usuario')
        await this.userRepository.delete(obj);
        return response.status(200)
    }

    async deactivateUser(id: number, user: Partial<User>): Promise<any> {
        const userToDeactivate = await this.getUserById(id);
        if (!userToDeactivate) throw new NotFoundException('No se encontro el usuario');

        if (!userToDeactivate.isActive) {
            throw new BadRequestException('El usuario ya está desactivado');
        }

        if (user.rol === UserRole.Cliente && userToDeactivate.email !== user.email) {
            throw new BadRequestException('No tenés permiso para desactivar este usuario');
        }

        if (userToDeactivate.rol === UserRole.Empleado && user.rol !== UserRole.Admin) {
            throw new BadRequestException('Solo un administrador puede desactivar empleados');
        }   

        if (userToDeactivate.rol === UserRole.Admin) {
            throw new BadRequestException('No se puede desactivar un usuario administrador');
        }

        const reservas = await this.reservaRepository.find({
            where: {
            usuario: userToDeactivate,
            estado: In([ReservaStates.Activa, ReservaStates.Cancelada])
            }
        });
        if (reservas.length > 0){
            throw new BadRequestException('No se puede eliminar la cuenta porque tiene reservas pendientes.');
        }

        const alquileres = await this.alquilerService.find({
            where: {
                usuario: userToDeactivate,
                estado: In([AlquilerStates.Activo, AlquilerStates.Retrasado])
            }
        })

        if (alquileres.length > 0) {
            throw new BadRequestException('No se puede eliminar la cuenta porque tiene alquileres pendientes.');
        }

        userToDeactivate.isActive = false;
        await this.userRepository.save(userToDeactivate);

        return { message: "Usuario desactivado exitosamente"};
    }

    async activateUser(id: number) {
        const user = await this.getUserById(id);
        if (!user.isActive) {
            await this.userRepository.save({ ...user, isActive: true })
            return response.status(200)
        }
        throw new BadRequestException('El usuario se encuentra activado')
    }

    async changeCreationDate(id: number, newDate: Date): Promise<any> {
        const user = await this.getUserById(id);
        if (!user) throw new NotFoundException('No se encontro el usuario');

        user.fecha_creacion = newDate;
        await this.userRepository.save(user);

        return { message: "Fecha de creación actualizada exitosamente" };
    }
}