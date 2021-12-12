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
  Obra,
} from '../models';
import {UserRepository} from '../repositories';

export class UserObraController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/obras', {
    responses: {
      '200': {
        description: 'Array of User has many Obra',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Obra)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Obra>,
  ): Promise<Obra[]> {
    return this.userRepository.obras(id).find(filter);
  }

  @post('/users/{id}/obras', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Obra)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.idUser,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Obra, {
            title: 'NewObraInUser',
            exclude: ['idObra'],
            optional: ['idUser']
          }),
        },
      },
    }) obra: Omit<Obra, 'idObra'>,
  ): Promise<Obra> {
    return this.userRepository.obras(id).create(obra);
  }

  @patch('/users/{id}/obras', {
    responses: {
      '200': {
        description: 'User.Obra PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Obra, {partial: true}),
        },
      },
    })
    obra: Partial<Obra>,
    @param.query.object('where', getWhereSchemaFor(Obra)) where?: Where<Obra>,
  ): Promise<Count> {
    return this.userRepository.obras(id).patch(obra, where);
  }

  @del('/users/{id}/obras', {
    responses: {
      '200': {
        description: 'User.Obra DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Obra)) where?: Where<Obra>,
  ): Promise<Count> {
    return this.userRepository.obras(id).delete(where);
  }
}
