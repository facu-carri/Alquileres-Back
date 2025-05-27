import MercadoPagoConfig, { Preference } from "mercadopago";
import { Items } from "mercadopago/dist/clients/commonTypes";
import { BackUrls, PreferenceResponse } from "mercadopago/dist/clients/preference/commonTypes";
import { PagoDto } from "./dto/pago.dto";

export class MercadoPago {

	private static instance: MercadoPago
	private client: MercadoPagoConfig
	private preference: Preference
	private backUrls: BackUrls = {
		success: `${process.env.FRONT_URL}/payment/sucess`,
		failure: `${process.env.FRONT_URL}/payment/failure`,
	}

	private constructor() {
		this.client = new MercadoPagoConfig({
			accessToken: process.env.MERCADO_PAGO_TOKEN
		})
		this.preference = new Preference(this.client)
	}
	
	public static getInstance(): MercadoPago{
		if(!MercadoPago.instance) MercadoPago.instance = new MercadoPago()
		return MercadoPago.instance
	}

	createItem(data: PagoDto): Items {
		return {
			id: 'product',
			title: data.title,
			description: data.title,
			quantity: 1,
			unit_price: data.price,
			currency_id: 'ARS',
			picture_url: 'https://www.mercadopago.com/org-img/MP3/home/logomp3.gif'
		}
	}

	async createPreference(item: Items): Promise<PreferenceResponse> {
		try {
			return await this.preference.create({
				body: {
					items: [item],
					back_urls: this.backUrls,
					binary_mode: true
				}
			})
		} catch (err) {
			console.log(err)
		}
	}
}