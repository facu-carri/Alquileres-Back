import { BadRequestException, Injectable } from '@nestjs/common';
import { PagoDto } from './dto/pago.dto';
import { Items } from 'mercadopago/dist/clients/commonTypes';
import { MaquinariaService } from 'src/maquinaria/maquinaria.service';
import { Item } from './Item';
import MercadoPagoConfig, { Payment, Preference } from 'mercadopago';
import { PreferenceResponse } from 'mercadopago/dist/clients/preference/commonTypes';
import { response } from 'express';
import { generateCode } from 'src/utils/Utils';
import { ReservaService } from 'src/reserva/reserva.service';
import { CreateReservaDto } from 'src/reserva/dto/create-reserva.dto';
import { NotificationQuery } from './dto/notification.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MercadoPagoService {
    
    private client: MercadoPagoConfig
    private preference: Preference
    private payment: Payment
    
    constructor(
        private maquinariaService: MaquinariaService,
        private reservaService: ReservaService,
        private userService: UserService
    ){
        this.client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_TOKEN })
        this.preference = new Preference(this.client)
        this.payment = new Payment(this.client)
    }
    
    async getPreferenceId(pagoData: PagoDto, email: string) {
        const maq = await this.maquinariaService.findOne(pagoData.maq_id)
        
        if (!this.userService.existBy({ email: email })) { throw new BadRequestException('No se pudo encontrar el usuario') }
        if (!maq) throw new BadRequestException('No se pudo encontrar la maquinaria')
        if (pagoData.days <= 0) throw new BadRequestException('Cantidad de dias invalida')
        
        const itemData: Item = {
            name: maq.nombre,
            price: maq.precio * pagoData.days,
        }

        const item: Items = this.createItem(itemData)
        const pref = await this.createPreference(item, pagoData, email)
        return pref.id
    }

    private createItem(data: Item): Items {
        return {
            id: generateCode(5).toString(),
            title: data.name,
            description: data.name,
            quantity: 1,
            unit_price: data.price,
            currency_id: 'ARS',
            picture_url: 'https://www.mercadopago.com/org-img/MP3/home/logomp3.gif'
        }
    }

    private async createPreference(item: Items, data: PagoDto, email: string): Promise<PreferenceResponse> {
        try {
            return await this.preference.create({
                body: {
                    items: [item],
                    back_urls: {
                        success: `${process.env.FRONT_URL}/maquinaria/${data.maq_id}?payment=1`,
                        failure: `${process.env.FRONT_URL}/maquinaria/${data.maq_id}?payment=0`
                    },
                    auto_return: 'all',
                    binary_mode: true,
                    notification_url: `${process.env.MERCADO_PAGO_NOTIFICATION_URL}/mercadoPago/notification?email=${email}&maq_id=${data.maq_id}&sd=${data.startDate.toISOString()}&ed=${data.endDate.toISOString()}`
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

    async getPayment(id: number) {
        return await this.payment.get({ id })
    }

    async createReserva(data:CreateReservaDto, id: number) {
        const reserva: CreateReservaDto = {
            id_maquinaria: id,
            email: data.email,
            fecha_inicio: data.fecha_inicio,
            fecha_fin: data.fecha_fin,
        }
        await this.reservaService.create(reserva);
    }

    async getNotification(data: any, query: NotificationQuery) {
        const type = data.type
        if (type == 'payment') {
            await this.reservaService.create({
                email: query.email,
                id_maquinaria: query.maq_id,
                fecha_inicio: new Date(query.sd),
                fecha_fin: new Date(query.ed)
            })
        }
        return response.status(200)
    }
}
