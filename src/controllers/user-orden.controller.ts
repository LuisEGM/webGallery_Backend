import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  User,
  Orden,
} from '../models';
import {UserRepository} from '../repositories';

export class UserOrdenController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/ordens', {
    responses: {
      '200': {
        description: 'Array of User has many Orden',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Orden)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Orden>,
  ): Promise<Orden[]> {
    return this.userRepository.ordenes(id).find(filter);
  }

  @post('/users/{id}/ordens', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Orden)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.idUser,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Orden, {
            title: 'NewOrdenInUser',
            exclude: ['idOrden'],
            optional: ['idUser']
          }),
        },
      },
    }) orden: Omit<Orden, 'idOrden'>,
  ): Promise<Orden> {
    return this.userRepository.ordenes(id).create(orden);
  }

  @patch('/users/{id}/ordens', {
    responses: {
      '200': {
        description: 'User.Orden PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Orden, {partial: true}),
        },
      },
    })
    orden: Partial<Orden>,
    @param.query.object('where', getWhereSchemaFor(Orden)) where?: Where<Orden>,
  ): Promise<Count> {
    return this.userRepository.ordenes(id).patch(orden, where);
  }

  @del('/users/{id}/ordens', {
    responses: {
      '200': {
        description: 'User.Orden DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Orden)) where?: Where<Orden>,
  ): Promise<Count> {
    return this.userRepository.ordenes(id).delete(where);
  }
}
