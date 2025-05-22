import { MaquinariaDto } from "src/maquinaria/dto/maquinaria.dto"
import { MaquinariaService } from "src/maquinaria/maquinaria.service";
import { MaquinariaCategory, Location, ReturnPolicy } from "src/maquinaria/maquinaria.entity";


export class InitializeMaquinarias {
    constructor(private readonly maquinariaService: MaquinariaService) {
        this.initMaquinarias()
    }

    async initMaquinarias() {
        const maquinarias: MaquinariaDto[] = [
            {
                inventario: 123456,
                nombre: 'Tractor',
                marca: 'Ford',
                modelo: 'G 601',
                precio: 25000,
                anio_adquisicion: 2020,
                sucursal: Location.LaPlata,
                politica: ReturnPolicy.devolucion_0,
                categoria: MaquinariaCategory.Agricultura,
                imagen: 'https://th.bing.com/th/id/R.59a162af12c29a4763b206c5c2e20e73?rik=tuosPrKVZEgqGg&riu=http%3a%2f%2fimg1.wikia.nocookie.net%2f__cb20080617014328%2ftractors%2fimages%2ff%2ff9%2fFord_TW20.JPG&ehk=%2f2bkiYToufrF1PesaeyScpMq6w3uRpXHbxr6h6lrvMY%3d&risl=&pid=ImgRa5',
            }
        ];

        for (const maquinariaData of maquinarias) {
            try {
                await this.maquinariaService.create(maquinariaData);
            } catch (e) {
                // Optionally log or handle duplicate/failed insertions
                console.warn(`Could not insert maquinaria: ${maquinariaData.nombre}`, e.message);
            }
        }
    }
}