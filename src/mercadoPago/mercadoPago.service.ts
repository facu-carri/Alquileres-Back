import { BadRequestException, Injectable } from '@nestjs/common';
import { PagoDto } from './dto/pago.dto';
import { MercadoPago } from './MercadoPago';
import { Items } from 'mercadopago/dist/clients/commonTypes';
import { MaquinariaService } from 'src/maquinaria/maquinaria.service';
import { Item } from './Item';

@Injectable()
export class MercadoPagoService {
    
    private mercadoPago: MercadoPago;
    
    constructor(
        private maquinariaService:MaquinariaService
    ){
        this.mercadoPago = MercadoPago.getInstance()
    }
    
    async getPreferenceId(pagoData: PagoDto) {
        const maq = await this.maquinariaService.findOne(pagoData.id)
        
        if (!maq) throw new BadRequestException('No se pudo encontrar la maquinaria')
        if (pagoData.days <= 0) throw new BadRequestException('Cantidad de dias invalida')
        
        const itemData: Item = {
            name: maq.nombre,
            price: maq.precio * pagoData.days
        }

        const item: Items = this.mercadoPago.createItem(itemData)
        const pref = await this.mercadoPago.createPreference(item)
        return pref.id
    }
}
