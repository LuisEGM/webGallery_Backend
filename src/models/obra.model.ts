import {Entity, hasMany, model, property, belongsTo} from '@loopback/repository';
import {OrdenDetails} from './orden-details.model';
import {User} from './user.model';

@model()
export class Obra extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  idObra?: string;

  @property({
    type: 'string',
    required: true,
  })
  nombre: string;

  @property({
    type: 'string',
    required: true,
  })
  autor: string;

  @property({
    type: 'string',
    default: "Descripcion de la obra x",
  })
  descripcion?: string;

  @property({
    type: 'number',
    required: true,
  })
  precio: number;

  @property({
    type: 'string',
    required: true,
  })
  imagen: string;

  @property({
    type: 'string',
    required: true,
  })
  estado: string;

  @property({
    type: 'date',
    required: true,
  })
  fechaCreacion: string;

  @hasMany(() => OrdenDetails, {keyTo: 'idObra'})
  ordenDetails: OrdenDetails[];

  @belongsTo(() => User, {name: 'propietario'})
  idUser: string;

  constructor(data?: Partial<Obra>) {
    super(data);
  }
}

export interface ObraRelations {
  // describe navigational properties here
}

export type ObraWithRelations = Obra & ObraRelations;
