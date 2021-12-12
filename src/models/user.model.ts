import {belongsTo, Entity, model, property, hasMany} from '@loopback/repository';
import {Rol} from './rol.model';
import {Orden} from './orden.model';
import {Obra} from './obra.model';

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  idUser?: string;

  @property({
    type: 'string',
    required: true,
  })
  nombres: string;

  @property({
    type: 'string',
    required: true,
  })
  apellidos: string;

  @property({
    type: 'string',
    required: true,
  })
  documento: string;

  @property({
    type: 'string',
    default: "5555555555",
  })
  telefono?: string;

  @property({
    type: 'string',
    required: true,
  })
  direccion: string;

  @property({
    type: 'string',
    required: true,
  })
  avatar: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @belongsTo(() => Rol, {name: 'rol'})
  idRol: string;

  @hasMany(() => Orden, {keyTo: 'idUser'})
  ordenes: Orden[];

  @hasMany(() => Obra, {keyTo: 'idUser'})
  obras: Obra[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
