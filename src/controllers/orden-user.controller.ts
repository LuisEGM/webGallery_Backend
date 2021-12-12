import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Orden,
  User,
} from '../models';
import {OrdenRepository} from '../repositories';

export class OrdenUserController {
  constructor(
    @repository(OrdenRepository)
    public ordenRepository: OrdenRepository,
  ) { }

  @get('/ordens/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Orden',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Orden.prototype.idOrden,
  ): Promise<User> {
    return this.ordenRepository.user(id);
  }
}
