import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { PagoDto } from './dto/pago.dto';
import { MercadoPago } from './MercadoPago';
import { Items } from 'mercadopago/dist/clients/commonTypes';

@Injectable()
export class MercadoPagoService {
    
    private mercadoPago: MercadoPago;
    
    constructor(){
        this.mercadoPago = MercadoPago.getInstance()
    }
    
    async getPreferenceId(pagoData: PagoDto) {
        const item: Items = this.mercadoPago.createItem(pagoData)
        const pref = await this.mercadoPago.createPreference(item)
        return pref.id
    }
}
