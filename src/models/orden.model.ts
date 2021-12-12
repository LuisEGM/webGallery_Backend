import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {User} from './user.model';
import {OrdenDetails} from './orden-details.model';

@model()
export class Orden extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  idOrden?: string;

  @property({
    type: 'date',
    required: true,
  })
  fechaCreacion: string;

  @property({
    type: 'string',
    required: true,
  })
  estado: string;

  @property({
    type: 'number',
    required: true,
  })
  valor: number;

  @belongsTo(() => User, {name: 'user'})
  idUser: string;

  @hasMany(() => OrdenDetails, {keyTo: 'idOrden'})
  ordenDetails: OrdenDetails[];

  constructor(data?: Partial<Orden>) {
    super(data);
  }
}

export interface OrdenRelations {
  // describe navigational properties here
}

export type OrdenWithRelations = Orden & OrdenRelations;
