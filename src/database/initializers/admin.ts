import { RegisterService } from "src/register/register.service"
import { UserDto } from "src/user/dto/user.dto"
import { UserRole } from "src/user/user.entity"

export class InitializeAdmin {

    constructor(private readonly registerService: RegisterService) {
        this.initAdminUser()
        this.initClientUser()
    }

    async initAdminUser() {
        const userAdminData: UserDto = {
            nombre: 'admin',
            apellido: '',
            password: '12345678',
            email: 'mannimaquinarias@gmail.com',
            telefono: '',
            dni: '',
            nacimiento: ''
        }
        try {
            await this.registerService.register(userAdminData, UserRole.Admin)
        } catch {}
    }

    async initClientUser() {
        const userClientData: UserDto = {
            nombre: 'Matias',
            apellido: 'Lozano',
            password: '12345678',
            email: 'matilozano96@hotmail.com',
            telefono: '123456789',
            dni: '19011452',
            nacimiento: '02/02/1996'
        }
        try {
            await this.registerService.register(userClientData, UserRole.Cliente)
        } catch {}
    }
}