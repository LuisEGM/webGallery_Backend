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
  Orden,
} from '../models';
import {OrdenDetailsRepository} from '../repositories';

export class OrdenDetailsOrdenController {
  constructor(
    @repository(OrdenDetailsRepository)
    public ordenDetailsRepository: OrdenDetailsRepository,
  ) { }

  @get('/orden-details/{id}/orden', {
    responses: {
      '200': {
        description: 'Orden belonging to OrdenDetails',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Orden)},
          },
        },
      },
    },
  })
  async getOrden(
    @param.path.string('id') id: typeof OrdenDetails.prototype.idOrdenDetail,
  ): Promise<Orden> {
    return this.ordenDetailsRepository.orden(id);
  }
}
