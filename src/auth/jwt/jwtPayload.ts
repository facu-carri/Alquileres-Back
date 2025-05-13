import { UserRole } from "src/user/user.entity"

export type JwtPayload = {
    email: string,
    rol: UserRole
}