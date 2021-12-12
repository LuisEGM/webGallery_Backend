import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Obra,
  User,
} from '../models';
import {ObraRepository} from '../repositories';

export class ObraUserController {
  constructor(
    @repository(ObraRepository)
    public obraRepository: ObraRepository,
  ) { }

  @get('/obras/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Obra',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Obra.prototype.idObra,
  ): Promise<User> {
    return this.obraRepository.propietario(id);
  }
}
