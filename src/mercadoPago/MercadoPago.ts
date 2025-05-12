import MercadoPagoConfig, { Preference } from "mercadopago";
import { Items } from "mercadopago/dist/clients/commonTypes";
import { BackUrls, PreferenceResponse } from "mercadopago/dist/clients/preference/commonTypes";

export class MercadoPago {

	private static instance: MercadoPago
	private client: MercadoPagoConfig
	private preference: Preference
	private backUrls: BackUrls = {
		success: 'http://localhost:3000/payment/sucess',
		failure: 'http://localhost:3000/payment/failure',
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

	async getPreferenceId(): Promise<string> {
		const item = this.createExampleItem()
		const pref = await this.createPreference(item)
		return pref.id
	}

	private createExampleItem(): Items { // Item Example
		return {
			id: 'product',
			title: 'Producto',
			description: 'this is just a test',
			quantity: 1,
			unit_price: 2000,
			currency_id: 'ARS',
			picture_url: 'https://www.mercadopago.com/org-img/MP3/home/logomp3.gif'
		}
	}

	async createPreference(item: Items): Promise<PreferenceResponse> {
		const preferenceRes: PreferenceResponse = await this.preference.create({
			body: {
				items: [item],
				back_urls: this.backUrls,
				binary_mode: true,
				auto_return: 'all'
			}
		})
		return preferenceRes
	}
}