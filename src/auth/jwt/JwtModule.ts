import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./jwtContants";

export const JwtModuleConfigured = JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: {
        expiresIn: '1d'
    }
})