import { RegisterService } from "src/register/register.service"
import { UserDto } from "src/user/dto/user.dto"
import { UserRole } from "src/user/user.entity"
import { UserService } from "src/user/user.service"

export class InitializeUsers {

    readonly randomUserCount = 10;

    private users: Record<UserRole, UserDto[]> = {
        [UserRole.Admin]: [
            {
                nombre: 'admin',
                apellido: '',
                password: '12345678',
                email: 'mannimaquinarias@gmail.com',
                telefono: '',
                dni: '',
                nacimiento: '',
            }
        ],
        [UserRole.Cliente]: [
            {
                nombre: 'Test',
                apellido: 'Tester',
                password: '12345678',
                email: 'cliente@hotmail.com',
                telefono: '+542215555555',
                dni: '56789012',
                nacimiento: '2001-01-01'
            },
            {
                nombre: 'TestDos',
                apellido: 'TesterDos',
                password: '12345678',
                email: 'eliminado@hotmail.com',
                telefono: '+542215555555',
                dni: '56789012',
                nacimiento: '2001-01-01',
                isActive: false
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
        [UserRole.Empleado]: [
            {
                nombre: 'Empleado',
                apellido: 'Empleado',
                password: '12345678',
                email: 'empleado@hotmail.com',
                telefono: '+542215555555',
                dni: '56789012',
                nacimiento: '2001-01-01'
            },
        ],
    }
    constructor(private readonly registerService: RegisterService, private readonly userService: UserService) {
    }
    async init() {
        for (const [rol, users] of Object.entries(this.users)) {
            if (users.length == 0) continue
            users.forEach(async(user) => await this.inyectUser(user, rol as UserRole))
        }

        let i: number;
        for ( i = 0; i < this.randomUserCount; i++) {
            const user: UserDto = {
                nombre: `Test${i}`,
                apellido: `Tester${i}`,
                password: '12345678',
                email: `test${i}@hotmail.com`,
                telefono: '+542215555555',
                dni: '56789012',
                nacimiento: '2001-01-01'
            }
            await this.inyectUser(user, UserRole.Cliente)
        }
    }

    async inyectUser(user:UserDto, rol:UserRole) {
        try {
            await this.registerService.register(user, rol)
            if (rol === UserRole.Cliente){
                const randomDays = Math.floor(Math.random() * 150)
                await this.userService.changeCreationDate((
                    await this.userService.findOneByEmail(user.email)).id, 
                    new Date(Date.now() - randomDays * 24 * 60 * 60 * 1000))
            }
            else {
                await this.userService.changeCreationDate((
                    await this.userService.findOneByEmail(user.email)).id, 
                    new Date(2025, 0, 1))
            }
        } catch {}
    }
}