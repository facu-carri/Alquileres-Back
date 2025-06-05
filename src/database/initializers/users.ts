import { RegisterService } from "src/register/register.service"
import { UserDto } from "src/user/dto/user.dto"
import { UserRole } from "src/user/user.entity"

export class InitializeUsers {

    private users: Record<UserRole, UserDto[]> = {
        [UserRole.Admin]: [
            {
                nombre: 'admin',
                apellido: '',
                password: '12345678',
                email: 'mannimaquinarias@gmail.com',
                telefono: '',
                dni: '',
                nacimiento: ''
            }
        ],
        [UserRole.Cliente]: [
            {
                nombre: 'Test',
                apellido: 'Tester',
                password: '12345678',
                email: 'cliente@hotmail.com',
                telefono: '+542215555555',
                dni: '567890123',
                nacimiento: '2001-01-01'
            },
            {
                nombre: 'TestDos',
                apellido: 'TesterDos',
                password: '12345678',
                email: 'eliminado@hotmail.com',
                telefono: '+542215555555',
                dni: '567890123',
                nacimiento: '2001-01-01',
                isActive: false
            },
            {
                nombre: 'Juan Manuel',
                apellido: 'Sisti',
                password: '12345678',
                email: 'sistijuanmanuel@gmail.com',
                telefono: '2213649785',
                dni: '44519668',
                nacimiento: '1996-01-14'
            },
            {
                nombre: 'Facundo',
                apellido: 'Carrizo',
                password: '12345678',
                email: 'facuc4rr@gmail.com',
                telefono: '+5491122221111',
                dni: '11223344',
                nacimiento: '2001-10-10'
            },
        ],
        [UserRole.Empleado]: [],
    }
    constructor(private readonly registerService: RegisterService) {
    }
    async init() {
        for (const [rol, users] of Object.entries(this.users)) {
            if (users.length == 0) continue
            users.forEach(async(user) => await this.inyectUser(user, rol as UserRole))
        }
    }

    async inyectUser(user:UserDto, rol:UserRole) {
        try {
            await this.registerService.register(user, rol)
        } catch {}
    }
}