import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {OrdenDetails} from '../models';
import {OrdenDetailsRepository} from '../repositories';

export class OrdenDetailsController {
  constructor(
    @repository(OrdenDetailsRepository)
    public ordenDetailsRepository : OrdenDetailsRepository,
  ) {}

  @post('/orden-details')
  @response(200, {
    description: 'OrdenDetails model instance',
    content: {'application/json': {schema: getModelSchemaRef(OrdenDetails)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrdenDetails, {
            title: 'NewOrdenDetails',
            exclude: ['idOrdenDetail'],
          }),
        },
      },
    })
    ordenDetails: Omit<OrdenDetails, 'idOrdenDetail'>,
  ): Promise<OrdenDetails> {
    return this.ordenDetailsRepository.create(ordenDetails);
  }

  @get('/orden-details/count')
  @response(200, {
    description: 'OrdenDetails model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(OrdenDetails) where?: Where<OrdenDetails>,
  ): Promise<Count> {
    return this.ordenDetailsRepository.count(where);
  }

  @get('/orden-details')
  @response(200, {
    description: 'Array of OrdenDetails model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(OrdenDetails, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(OrdenDetails) filter?: Filter<OrdenDetails>,
  ): Promise<OrdenDetails[]> {
    return this.ordenDetailsRepository.find(filter);
  }

  @patch('/orden-details')
  @response(200, {
    description: 'OrdenDetails PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrdenDetails, {partial: true}),
        },
      },
    })
    ordenDetails: OrdenDetails,
    @param.where(OrdenDetails) where?: Where<OrdenDetails>,
  ): Promise<Count> {
    return this.ordenDetailsRepository.updateAll(ordenDetails, where);
  }

  @get('/orden-details/{id}')
  @response(200, {
    description: 'OrdenDetails model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(OrdenDetails, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(OrdenDetails, {exclude: 'where'}) filter?: FilterExcludingWhere<OrdenDetails>
  ): Promise<OrdenDetails> {
    return this.ordenDetailsRepository.findById(id, filter);
  }

  @patch('/orden-details/{id}')
  @response(204, {
    description: 'OrdenDetails PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrdenDetails, {partial: true}),
        },
      },
    })
    ordenDetails: OrdenDetails,
  ): Promise<void> {
    await this.ordenDetailsRepository.updateById(id, ordenDetails);
  }

  @put('/orden-details/{id}')
  @response(204, {
    description: 'OrdenDetails PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() ordenDetails: OrdenDetails,
  ): Promise<void> {
    await this.ordenDetailsRepository.replaceById(id, ordenDetails);
  }

  @del('/orden-details/{id}')
  @response(204, {
    description: 'OrdenDetails DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.ordenDetailsRepository.deleteById(id);
  }
}
