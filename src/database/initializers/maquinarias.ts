import { MaquinariaDto } from "src/maquinaria/dto/maquinaria.dto"
import { MaquinariaService } from "src/maquinaria/maquinaria.service";
import { MaquinariaCategory, Location, ReturnPolicy, MaquinariaStates } from "src/maquinaria/maquinaria.entity";


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
                modelo: 'TW 20',
                precio: 25000,
                anio_adquisicion: 2020,
                sucursal: Location.LaPlata,
                politica: ReturnPolicy.devolucion_0,
                categoria: MaquinariaCategory.Agricultura,
                imagen: 'https://www.ipesa.com.pe/blog/wp-content/uploads/2023/09/potencia-tractor-agricola-ipesa-768x554.jpg',
            },
            {
                inventario: 234567,
                nombre: 'Excavadora',
                marca: 'Caterpillar',
                modelo: '320D',
                precio: 45000,
                anio_adquisicion: 2018,
                sucursal: Location.LosHornos,
                politica: ReturnPolicy.devolucion_100,
                categoria: MaquinariaCategory.Construcción,
                imagen: 'https://th.bing.com/th/id/OIP.UfCmJjOqZ-iLqRdV_LmT9QHaFj?rs=1&pid=ImgDetMain',
            },
            {
                inventario: 345678,
                nombre: 'Cosechadora',
                marca: 'John Deere',
                modelo: 'S670',
                precio: 60000,
                anio_adquisicion: 2021,
                sucursal: Location.Zarate,
                politica: ReturnPolicy.devolucion_20,
                categoria: MaquinariaCategory.Agricultura,
                imagen: 'https://th.bing.com/th/id/OIP.Y9DnaZE9kv74B8qcOODWlgHaFi?rs=1&pid=ImgDetMain',
            },
            {
                inventario: 456789,
                nombre: 'Retroexcavadora',
                marca: 'JCB',
                modelo: '3CX',
                precio: 35000,
                anio_adquisicion: 2019,
                sucursal: Location.Ensenada,
                politica: ReturnPolicy.devolucion_0,
                categoria: MaquinariaCategory.Construcción,
                imagen: 'https://th.bing.com/th/id/OIP.nnQJ7eLSER-mFlxVSU0AdAHaFj?rs=1&pid=ImgDetMain',
            },
            {
                inventario: 567890,
                nombre: 'Grúa',
                marca: 'Liebherr',
                modelo: 'LTM 1055',
                precio: 80000,
                anio_adquisicion: 2017,
                sucursal: Location.BahíaBlanca,
                politica: ReturnPolicy.devolucion_20,
                categoria: MaquinariaCategory.Logística,
                imagen: 'https://th.bing.com/th/id/R.fb39018a7ff8d913a8fbbaafd0fadff3?rik=dOPdp3AMrJNDyw&pid=ImgRaw&r=0',
            },
            {
                inventario: 678901,
                nombre: 'Camión',
                marca: 'Volvo',
                modelo: 'FH 16',
                precio: 2000,
                anio_adquisicion: 2020,
                sucursal: Location.Quilmes,
                politica: ReturnPolicy.devolucion_100,
                categoria: MaquinariaCategory.Transporte,
                imagen: 'https://th.bing.com/th/id/OIP.WhwY-IeDw-sCdNMMchH7uwHaE6?rs=1&pid=ImgDetMain',
            },
        ];

        for (const maquinariaData of maquinarias) {
            try {
                await this.maquinariaService.create(maquinariaData);
            } catch (e) {
                // Optionally log or handle duplicate/failed insertions
                console.warn(`Could not insert maquinaria: ${maquinariaData.nombre}`, e.message);
            }
        }

        // Manipular estados
        const maq = await this.maquinariaService.findByInventario(678901);
        maq.state = MaquinariaStates.Mantenimiento;
        await this.maquinariaService.update(maq.id, maq);
    }
}