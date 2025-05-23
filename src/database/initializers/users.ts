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
                nombre: 'Matias',
                apellido: 'Lozano',
                password: '12345678',
                email: 'matilozano96@hotmail.com',
                telefono: '123456789',
                dni: '19011452',
                nacimiento: '02/02/1996'
            }
        ],
        [UserRole.Empleado]: [],
    }


    constructor(private readonly registerService: RegisterService) {
        this.initUsers()
    }

    async initUsers() {
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