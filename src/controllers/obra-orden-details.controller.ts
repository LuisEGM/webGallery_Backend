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
  Obra,
  OrdenDetails,
} from '../models';
import {ObraRepository} from '../repositories';

export class ObraOrdenDetailsController {
  constructor(
    @repository(ObraRepository) protected obraRepository: ObraRepository,
  ) { }

  @get('/obras/{id}/orden-details', {
    responses: {
      '200': {
        description: 'Array of Obra has many OrdenDetails',
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
    return this.obraRepository.ordenDetails(id).find(filter);
  }

  @post('/obras/{id}/orden-details', {
    responses: {
      '200': {
        description: 'Obra model instance',
        content: {'application/json': {schema: getModelSchemaRef(OrdenDetails)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Obra.prototype.idObra,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrdenDetails, {
            title: 'NewOrdenDetailsInObra',
            exclude: ['idOrdenDetail'],
            optional: ['idObra']
          }),
        },
      },
    }) ordenDetails: Omit<OrdenDetails, 'idOrdenDetail'>,
  ): Promise<OrdenDetails> {
    return this.obraRepository.ordenDetails(id).create(ordenDetails);
  }

  @patch('/obras/{id}/orden-details', {
    responses: {
      '200': {
        description: 'Obra.OrdenDetails PATCH success count',
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
    return this.obraRepository.ordenDetails(id).patch(ordenDetails, where);
  }

  @del('/obras/{id}/orden-details', {
    responses: {
      '200': {
        description: 'Obra.OrdenDetails DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(OrdenDetails)) where?: Where<OrdenDetails>,
  ): Promise<Count> {
    return this.obraRepository.ordenDetails(id).delete(where);
  }
}
