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
  Orden,
  OrdenDetails,
} from '../models';
import {OrdenRepository} from '../repositories';

export class OrdenOrdenDetailsController {
  constructor(
    @repository(OrdenRepository) protected ordenRepository: OrdenRepository,
  ) { }

  @get('/ordens/{id}/orden-details', {
    responses: {
      '200': {
        description: 'Array of Orden has many OrdenDetails',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(OrdenDetails)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<OrdenDetails>,
  ): Promise<OrdenDetails[]> {
    return this.ordenRepository.ordenDetails(id).find(filter);
  }

  @post('/ordens/{id}/orden-details', {
    responses: {
      '200': {
        description: 'Orden model instance',
        content: {'application/json': {schema: getModelSchemaRef(OrdenDetails)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Orden.prototype.idOrden,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrdenDetails, {
            title: 'NewOrdenDetailsInOrden',
            exclude: ['idOrdenDetail'],
            optional: ['idOrden']
          }),
        },
      },
    }) ordenDetails: Omit<OrdenDetails, 'idOrdenDetail'>,
  ): Promise<OrdenDetails> {
    return this.ordenRepository.ordenDetails(id).create(ordenDetails);
  }

  @patch('/ordens/{id}/orden-details', {
    responses: {
      '200': {
        description: 'Orden.OrdenDetails PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrdenDetails, {partial: true}),
        },
      },
    })
    ordenDetails: Partial<OrdenDetails>,
    @param.query.object('where', getWhereSchemaFor(OrdenDetails)) where?: Where<OrdenDetails>,
  ): Promise<Count> {
    return this.ordenRepository.ordenDetails(id).patch(ordenDetails, where);
  }

  @del('/ordens/{id}/orden-details', {
    responses: {
      '200': {
        description: 'Orden.OrdenDetails DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(OrdenDetails)) where?: Where<OrdenDetails>,
  ): Promise<Count> {
    return this.ordenRepository.ordenDetails(id).delete(where);
  }
}
