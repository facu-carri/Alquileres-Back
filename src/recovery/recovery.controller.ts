import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RecoveryPasswordDto } from './dto/password.dto';
import { RecoveryTokenDto } from './dto/token.dto';
import { RecoveryService } from './recovery.service';
import { ChangePasswordDto } from './dto/chnagePassword.dto';

@Controller('recovery')
export class RecoveryController {

    constructor(
        private readonly recoveryService: RecoveryService
    ) { }
    
    @Get('validToken')
    async checkToken(@Query() tokenData: RecoveryTokenDto) {
        return await this.recoveryService.checkToken(tokenData)
    }

    @Post('recovery-password')
    async recoveryPassword(@Body() passwordData: RecoveryPasswordDto) {
        return await this.recoveryService.recoveryPassword(passwordData)
    }

    @Post('change-password')
    async changePassword(@Body() newPasswordData: ChangePasswordDto) {
        return await this.recoveryService.changePassword(newPasswordData)
    }
}