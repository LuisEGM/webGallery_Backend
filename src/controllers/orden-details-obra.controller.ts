import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  OrdenDetails,
  Obra,
} from '../models';
import {OrdenDetailsRepository} from '../repositories';

export class OrdenDetailsObraController {
  constructor(
    @repository(OrdenDetailsRepository)
    public ordenDetailsRepository: OrdenDetailsRepository,
  ) { }

  @get('/orden-details/{id}/obra', {
    responses: {
      '200': {
        description: 'Obra belonging to OrdenDetails',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Obra)},
          },
        },
      },
    },
  })
  async getObra(
    @param.path.string('id') id: typeof OrdenDetails.prototype.idOrdenDetail,
  ): Promise<Obra> {
    return this.ordenDetailsRepository.obra(id);
  }
}
