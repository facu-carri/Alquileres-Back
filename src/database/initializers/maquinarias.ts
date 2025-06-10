import { MaquinariaDto } from "src/maquinaria/dto/maquinaria.dto"
import { MaquinariaService } from "src/maquinaria/maquinaria.service";
import { MaquinariaStates } from "src/maquinaria/maquinaria.entity";
import { Categoria } from "src/utils/enums";
import { Sucursal } from "src/utils/enums";
import { Politica } from "src/utils/enums";

export class InitializeMaquinarias {

    private maquinarias: Array<MaquinariaDto> = [
        {
            inventario: "MM001",
            nombre: 'Tractor',
            marca: 'Ford',
            modelo: 'TW 20',
            precio: 25000,
            anio_adquisicion: 2020,
            sucursal: Sucursal.LaPlata,
            politica: Politica.devolucion_0,
            categoria: Categoria.Agricultura,
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
            sucursal: Sucursal.LosHornos,
            politica: Politica.devolucion_100,
            categoria: Categoria.Construcción,
            imagen: 'https://th.bing.com/th/id/OIP.UfCmJjOqZ-iLqRdV_LmT9QHaFj?rs=1&pid=ImgDetMain',
            state: MaquinariaStates.Disponible
        },
        {
            inventario: "AB232",
            nombre: 'Cosechadora',
            marca: 'John Deere',
            modelo: 'S670',
            precio: 10,
            anio_adquisicion: 2021,
            sucursal: Sucursal.LaPlata,
            politica: Politica.devolucion_20,
            categoria: Categoria.Agricultura,
            imagen: 'https://www.muyinteresante.com/wp-content/uploads/sites/5/2022/10/18/634dd1f412bb5.jpeg',
            state: MaquinariaStates.Disponible
        },
        {
            inventario: "AH235",
            nombre: 'Cosechadora',
            marca: 'John Deere',
            modelo: 'S670',
            precio: 60000,
            anio_adquisicion: 2021,
            sucursal: Sucursal.Zarate,
            politica: Politica.devolucion_20,
            categoria: Categoria.Agricultura,
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
            sucursal: Sucursal.Ensenada,
            politica: Politica.devolucion_0,
            categoria: Categoria.Construcción,
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
            sucursal: Sucursal.BahíaBlanca,
            politica: Politica.devolucion_20,
            categoria: Categoria.Logística,
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
            sucursal: Sucursal.Quilmes,
            politica: Politica.devolucion_100,
            categoria: Categoria.Transporte,
            imagen: 'https://th.bing.com/th/id/OIP.WhwY-IeDw-sCdNMMchH7uwHaE6?rs=1&pid=ImgDetMain',
            state: MaquinariaStates.Mantenimiento
        },
    ]

    constructor(private readonly maquinariaService: MaquinariaService) {}

    async init() {
        await Promise.all(this.maquinarias.map(maq => this.inyectMaquinaria(maq)));
    }

    async inyectMaquinaria(maq:MaquinariaDto) {
        try {
            await this.maquinariaService.create(maq);
        } catch {}
    }
}