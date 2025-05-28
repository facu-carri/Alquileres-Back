import { MaquinariaDto } from "src/maquinaria/dto/maquinaria.dto"
import { MaquinariaService } from "src/maquinaria/maquinaria.service";
import { MaquinariaCategory, Location, ReturnPolicy, MaquinariaStates } from "src/maquinaria/maquinaria.entity";


export class InitializeMaquinarias {

    private maquinarias: Array<MaquinariaDto> = [
        {
            inventario: "MM001",
            nombre: 'Tractor',
            marca: 'Ford',
            modelo: 'TW 20',
            precio: 25000,
            anio_adquisicion: 2020,
            sucursal: Location.LaPlata,
            politica: ReturnPolicy.devolucion_0,
            categoria: MaquinariaCategory.Agricultura,
            imagen: 'https://www.ipesa.com.pe/blog/wp-content/uploads/2023/09/potencia-tractor-agricola-ipesa-768x554.jpg',
            state: MaquinariaStates.Eliminado
        },
        {
            inventario: "MM452",
            nombre: 'Excavadora',
            marca: 'Caterpillar',
            modelo: '320D',
            precio: 45000,
            anio_adquisicion: 2018,
            sucursal: Location.LosHornos,
            politica: ReturnPolicy.devolucion_100,
            categoria: MaquinariaCategory.Construcción,
            imagen: 'https://th.bing.com/th/id/OIP.UfCmJjOqZ-iLqRdV_LmT9QHaFj?rs=1&pid=ImgDetMain',
            state: MaquinariaStates.Disponible
        },
        {
            inventario: "AH235",
            nombre: 'Cosechadora',
            marca: 'John Deere',
            modelo: 'S670',
            precio: 60000,
            anio_adquisicion: 2021,
            sucursal: Location.Zarate,
            politica: ReturnPolicy.devolucion_20,
            categoria: MaquinariaCategory.Agricultura,
            imagen: 'https://th.bing.com/th/id/OIP.Y9DnaZE9kv74B8qcOODWlgHaFi?rs=1&pid=ImgDetMain',
            state: MaquinariaStates.Disponible
        },
        {
            inventario: "4BG79",
            nombre: 'Retroexcavadora',
            marca: 'JCB',
            modelo: '3CX',
            precio: 35000,
            anio_adquisicion: 2019,
            sucursal: Location.Ensenada,
            politica: ReturnPolicy.devolucion_0,
            categoria: MaquinariaCategory.Construcción,
            imagen: 'https://th.bing.com/th/id/OIP.nnQJ7eLSER-mFlxVSU0AdAHaFj?rs=1&pid=ImgDetMain',
            state: MaquinariaStates.Disponible
        },
        {
            inventario: "GBN12",
            nombre: 'Grúa',
            marca: 'Liebherr',
            modelo: 'LTM 1055',
            precio: 80000,
            anio_adquisicion: 2017,
            sucursal: Location.BahíaBlanca,
            politica: ReturnPolicy.devolucion_20,
            categoria: MaquinariaCategory.Logística,
            imagen: 'https://th.bing.com/th/id/R.fb39018a7ff8d913a8fbbaafd0fadff3?rik=dOPdp3AMrJNDyw&pid=ImgRaw&r=0',
            state: MaquinariaStates.Mantenimiento
        },
        {
            inventario: "FF807",
            nombre: 'Camión',
            marca: 'Volvo',
            modelo: 'FH 16',
            precio: 2000,
            anio_adquisicion: 2020,
            sucursal: Location.Quilmes,
            politica: ReturnPolicy.devolucion_100,
            categoria: MaquinariaCategory.Transporte,
            imagen: 'https://th.bing.com/th/id/OIP.WhwY-IeDw-sCdNMMchH7uwHaE6?rs=1&pid=ImgDetMain',
            state: MaquinariaStates.Mantenimiento
        },
    ]

    constructor(private readonly maquinariaService: MaquinariaService) {
    }

    async init() {
        await Promise.all(this.maquinarias.map(maq => this.inyectMaquinaria(maq)));
    }

    async inyectMaquinaria(maq:MaquinariaDto) {
        try {
            await this.maquinariaService.create(maq);
        } catch {}
    }
}