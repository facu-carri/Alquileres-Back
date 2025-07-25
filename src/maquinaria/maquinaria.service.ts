import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Maquinaria, MaquinariaStates} from './maquinaria.entity';
import { Categoria } from "src/utils/enums";
import { Sucursal } from "src/utils/enums";
import { Politica } from "src/utils/enums";
import { MaquinariaDto } from './dto/maquinaria.dto';
import { UpdateMaquinariaDto } from './dto/update-maquinaria.dto';
import { FilterMaquinariaDto } from './dto/filter-maquinaria.dto';
import { Reserva, ReservaStates } from 'src/reserva/reserva.entity';
import { getEnumValues } from 'src/utils/EnumUtils';
import { User, UserRole } from 'src/user/user.entity';
import { ReservaService } from 'src/reserva/reserva.service';
import { AlquilerService } from 'src/alquiler/alquiler.service';
import { Alquiler, AlquilerStates } from 'src/alquiler/alquiler.entity';

@Injectable()
export class MaquinariaService {
    reseñaRepository: any;
    
    constructor(
        @InjectRepository(Maquinaria)
        private readonly maquinariaRepository: Repository<Maquinaria>,
        @InjectRepository(Reserva)
        private readonly reservaRepository: Repository<Reserva>,
        private readonly reservaService: ReservaService,
        private readonly alquilerService: AlquilerService
    ) {}

    async create(maquinariaDto: MaquinariaDto): Promise<Maquinaria> {
        const invExist = await this.maquinariaRepository.findOneBy({ inventario: maquinariaDto.inventario });
        if(invExist) throw new BadRequestException('El numero de inventario ya se encuentra registrado')
        
        const maquinaria = this.maquinariaRepository.create(maquinariaDto);
        return await this.maquinariaRepository.save(maquinaria);
    }

    async findAll(filters: FilterMaquinariaDto, rol: UserRole): Promise<Maquinaria[]> {
        const filterNames = ['like_nombre', 'like_marca', 'like_modelo', 'categoria', 'sucursal', 'politica']
        const query = this.maquinariaRepository.createQueryBuilder('maquinaria');
        const validStates = this.getValidStates(rol)
        
        if(filters.state && validStates.includes(filters.state)) filterNames.push('state')
        else query.andWhere('maquinaria.state IN (:...states)', { states: validStates });
        
        if (filters.text) {
            query.andWhere(
                new Brackets(qb => {
                    qb.where('maquinaria.nombre LIKE :text', { text: `%${filters.text}%` })
                    .orWhere('maquinaria.marca LIKE :text', { text: `%${filters.text}%` })
                    .orWhere('maquinaria.modelo LIKE :text', { text: `%${filters.text}%` });
                })
            );
        }

        for (let filter of filterNames) {
            const useLike = filter.startsWith('like_');
            const field = useLike ? filter.replace(/^like_/, '') : filter;
            const value = filters[field];
            if (value !== undefined && value !== null && value !== '') {
                if (useLike) {
                    query.andWhere(`maquinaria.${field} LIKE :${field}`, { [field]: `%${value}%` });
                } else {
                    query.andWhere(`maquinaria.${field} = :${field}`, { [field]: value });
                }
            }
        }

        if (filters.fecha_inicio && filters.fecha_fin) {
            const fechaInicio = new Date(filters.fecha_inicio);
            const fechaFin = new Date(filters.fecha_fin);

            fechaInicio.setDate(fechaInicio.getDate() - 3);
            fechaFin.setDate(fechaFin.getDate() + 3);

            query.andWhere(qb => {
                const subQuery = qb.subQuery()
                    .select('1')
                    .from(Reserva, 'reserva')
                    .where('reserva.id_maquinaria = maquinaria.id')
                    .andWhere('reserva.fecha_inicio <= :fechaFin')
                    .andWhere('reserva.fecha_fin >= :fechaInicio')
                    .getQuery();
                return `NOT EXISTS ${subQuery}`;
            }, { fechaInicio: fechaInicio.toISOString(), fechaFin: fechaFin.toISOString() });
        }
        
        const maquinarias = await query.getMany();
        for (let maquinaria of maquinarias) {
            const maq_temp = await this.maquinariaRepository.findOne({ where: { id: maquinaria.id }, relations: ['resenias'] });
            maquinaria.puntaje_promedio = maq_temp?.averageScore || null;
        }
        return maquinarias;
    }

    async checkAvailability(id: number, fecha_inicio: Date, fecha_fin: Date): Promise<boolean> {
        const maquinaria = await this.maquinariaRepository.findOneBy({ id });
        if (!maquinaria) {
            throw new NotFoundException(`No se encontró la maquinaria con id ${id}`);
        }
        if (maquinaria.state !== MaquinariaStates.Disponible) {
            throw new BadRequestException(`La maquinaria con id ${id} no está Disponible`);
        }

        // Validar fechas
        if (fecha_inicio >= fecha_fin) {
            throw new BadRequestException('La fecha de inicio debe ser menor que la fecha de fin');
        }

        // Logica de negocio: 3 dias de diferencia
        const bufferInicio = new Date(fecha_inicio);
        bufferInicio.setDate(bufferInicio.getDate() - 3);

        const bufferFin = new Date(fecha_fin);
        bufferFin.setDate(bufferFin.getDate() + 3);

        // Implementar lógica para verificar disponibilidad
        const reservas = await this.reservaRepository.find({
            where: {
                maquinaria: { id },
                fecha_inicio: LessThanOrEqual(bufferFin),
                fecha_fin: MoreThanOrEqual(bufferInicio),
            },
        });
        const alquileres = await this.alquilerService.find({
            where: {
                maquinariaId: id,
                estado: AlquilerStates.Activo,
                fecha_inicio: LessThanOrEqual(bufferFin),
                fecha_fin: MoreThanOrEqual(bufferInicio),
            },
        })
        return reservas.length === 0 && alquileres.length === 0;
    }

    async getOccupiedDates(id: number): Promise<{ fecha_inicio: string, fecha_fin: string }[]> {
        const maquinaria = await this.maquinariaRepository.findOneBy({ id });
        if (!maquinaria) {
            throw new NotFoundException(`No se encontró la maquinaria con id ${id}`);
        }
        if (maquinaria.state !== MaquinariaStates.Disponible) {
            throw new BadRequestException(`La maquinaria con id ${id} no está Disponible`);
        }

        const alquileres = await this.alquilerService.find({
            where: {
                maquinariaId: id,
                estado: AlquilerStates.Activo
            }
        })

        const reservas = await this.reservaRepository.find({
            where: {
                maquinaria: { id },
                estado: ReservaStates.Activa,
            },
        });

        const mergeObjs: Array<Alquiler | Reserva> = [...alquileres, ...reservas]

        return mergeObjs.map((obj) => {

            const daysOffset = 3

            const fecha_inicio = new Date(obj.fecha_inicio);
            fecha_inicio.setDate(fecha_inicio.getDate() - daysOffset);

            const fecha_fin = new Date(obj.fecha_fin);
            fecha_fin.setDate(fecha_fin.getDate() + daysOffset);

            return {
                fecha_inicio: fecha_inicio.toISOString(),
                fecha_fin: fecha_fin.toISOString(),
            };
        });
    }

    async findOne(id: number): Promise<Maquinaria> {
        const maquinaria = await this.maquinariaRepository
            .createQueryBuilder('maquinaria')
            .leftJoinAndSelect('maquinaria.preguntas', 'pregunta')
            .leftJoinAndSelect('maquinaria.alquileres', 'alquiler')
            .leftJoinAndSelect('maquinaria.resenias', 'resenia')
            .leftJoinAndSelect('resenia.autor', 'autor')
            .where('maquinaria.id = :id', { id })
            .getOne();
        if (!maquinaria) {
            throw new NotFoundException(`No se encontró la maquinaria con id ${id}`);
        }
        maquinaria.resenias = maquinaria.resenias.map(reseña => {
            reseña.autor = { id : reseña.autor.id, nombre: reseña.autor.nombre, email: reseña.autor.email} as Partial<User>;
            return reseña;
        });
        maquinaria.resenias.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
        
        maquinaria.puntaje_promedio = maquinaria.averageScore;

        return maquinaria;
    }

    async findByInventario(inventario: string): Promise<Maquinaria> {
        const maquinaria = await this.maquinariaRepository.findOneBy({ inventario });
        if (!maquinaria) {
            throw new NotFoundException(`No se encontró la maquinaria con inventario ${inventario}`);
        }
        return maquinaria;
    }

    async update(id: number, updatemaquinariaDto: UpdateMaquinariaDto): Promise<Maquinaria> {
        const maquinaria = await this.findOne(id);
        this.maquinariaRepository.merge(maquinaria, updatemaquinariaDto);
        return await this.maquinariaRepository.save(maquinaria);
    }

    async changeState(id: number, state: string, user: User, fecha?: Date): Promise<Maquinaria> {
        const maquinaria = await this.findOne(id);
        const rol = user.rol

        if (!maquinaria) {
            throw new NotFoundException(`No se encontró la maquinaria con id ${id}`);
        }

        const validStates = this.getValidStates(rol);
        if (!validStates.includes(state as MaquinariaStates)) {
            throw new BadRequestException(`El estado ${state} no es válido para el rol ${rol}`);
        }

        if (maquinaria.state === state) {
            throw new BadRequestException(`La maquinaria ya se encuentra en el estado ${state}`);
        }

        // Manejar cancelaciones
        if ( maquinaria.state === MaquinariaStates.Disponible ) {
            // Check alquileres
            const alquileres = await this.alquilerService.find({
            where: {
                maquinariaId: id,
                estado: In([AlquilerStates.Activo, AlquilerStates.Retrasado])
            }})
            if (alquileres.length > 0) {
                throw new BadRequestException(`La maquinaria tiene alquileres pendientes`);
            }
            // Fetch reservas
            let query = this.reservaRepository.createQueryBuilder('reserva')
                .where('reserva.maquinaria = :maquinaria', { maquinaria: id })
                .andWhere('reserva.estado = :estado', { estado: ReservaStates.Activa })
                if ( state === MaquinariaStates.Mantenimiento && fecha !== undefined ) {
                    maquinaria.fecha_mantenimiento = fecha
                }

            let reservas = await query.getMany()
            for ( let reserva of reservas ) {
                // Si mantenimiento y se dio fecha de fin, tomar las anteriores a la fecha
                if ( fecha !== undefined && reserva.fecha_inicio > fecha  && state === MaquinariaStates.Mantenimiento ) {
                    continue;
                }
                reserva.politica = Politica.devolucion_100
                reserva.estado = ReservaStates.Cancelada
                await this.reservaRepository.save(reserva)
            }

        
        }
        maquinaria.state = state as MaquinariaStates
        return await this.maquinariaRepository.save(maquinaria);
    }

    async getReviews(id: number): Promise<any> {
        const maquinaria = await this.maquinariaRepository.findOneBy({ id });
        if (!maquinaria) {
            throw new NotFoundException(`No se encontró la maquinaria con id ${id}`);
        }
        
        const reseñas = await this.reseñaRepository.find({
            where: {
                maquinaria: { id }
            },
            relations: ['alquiler']
        });

        return reseñas;
    }

    getAllCategories(): string[] {
        return getEnumValues(Categoria)
    }

    getAllPolitics(): string[] {
        return getEnumValues(Politica)
    }

    getAllLocations(): string[] {
        return getEnumValues(Sucursal)
    }

    getValidStates(rol: UserRole): string[] {
        const states = getEnumValues(MaquinariaStates)

        // temp
        // return states
        
        if (rol == UserRole.Admin) return states

        const e_index = states.indexOf(MaquinariaStates.Eliminado)
        states.splice(e_index, 1)

        if (rol !== UserRole.Empleado) {
            const m_index = states.indexOf(MaquinariaStates.Mantenimiento)
            states.splice(m_index, 1)
        }
        
        return states
    }
}