import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Orden} from './orden.model';
import {Obra} from './obra.model';

@model()
export class OrdenDetails extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  idOrdenDetail?: string;

  @belongsTo(() => Orden, {name: 'orden'})
  idOrden: string;

  @belongsTo(() => Obra, {name: 'obra'})
  idObra: string;

  constructor(data?: Partial<OrdenDetails>) {
    super(data);
  }
}

export interface OrdenDetailsRelations {
  // describe navigational properties here
}

export type OrdenDetailsWithRelations = OrdenDetails & OrdenDetailsRelations;
