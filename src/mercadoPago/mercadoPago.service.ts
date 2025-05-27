import { BadRequestException, Injectable } from '@nestjs/common';
import { PagoDto } from './dto/pago.dto';
import { Items } from 'mercadopago/dist/clients/commonTypes';
import { MaquinariaService } from 'src/maquinaria/maquinaria.service';
import { Item } from './Item';
import MercadoPagoConfig, { Payment, Preference } from 'mercadopago';
import { BackUrls, PreferenceResponse } from 'mercadopago/dist/clients/preference/commonTypes';
import { response } from 'express';
import { generateCode } from 'src/utils/Utils';

@Injectable()
export class MercadoPagoService {
    
    private client: MercadoPagoConfig
    private preference: Preference
    private payment: Payment
    
    constructor(
        private maquinariaService:MaquinariaService
    ){
        this.client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_TOKEN })
        this.preference = new Preference(this.client)
        this.payment = new Payment(this.client)
    }
    
    async getPreferenceId(pagoData: PagoDto) {
        const maq = await this.maquinariaService.findOne(pagoData.id)
        
        if (!maq) throw new BadRequestException('No se pudo encontrar la maquinaria')
        if (pagoData.days <= 0) throw new BadRequestException('Cantidad de dias invalida')
        
        const itemData: Item = {
            name: maq.nombre,
            price: maq.precio * pagoData.days
        }

        const item: Items = this.createItem(itemData)
        const pref = await this.createPreference(item)
        return pref.id
    }

    private createItem(data: Item): Items {
        return {
            id: data.name + generateCode(5).toString(),
            title: data.name,
            description: data.name,
            quantity: 1,
            unit_price: data.price,
            currency_id: 'ARS',
            picture_url: 'https://www.mercadopago.com/org-img/MP3/home/logomp3.gif'
        }
    }

    private async createPreference(item: Items): Promise<PreferenceResponse> {
        try {
            return await this.preference.create({
                body: {
                    items: [item],
                    back_urls: {
                        success: `${process.env.FRONT_URL}/inicio`,
                        failure: `${process.env.FRONT_URL}/inicio`
                    },
                    auto_return: 'all',
                    binary_mode: true,
                    notification_url: `${process.env.MERCADO_PAGO_NOTIFICATION_URL}/mercadoPago/notification`
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

    async getPayment(id: number) {
        return await this.payment.get({ id })
    }

    async getNotification(data: any) {
        const type = data.type

        if (type == 'payment') {
            console.log('payment realizado')
            const paymentId = data.data.id
            const payment = await this.getPayment(paymentId)
            const item: Items = payment.additional_info.items[0]
            // guardar item en db
            console.log(item)
        }
        return response.status(200)
    }
}
