import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Obra} from '../models';
import {ObraRepository} from '../repositories';

// @authenticate('admin')
export class ObraController {
  constructor(
    @repository(ObraRepository)
    public obraRepository: ObraRepository,
  ) {}

  @post('/obras')
  @response(200, {
    description: 'Obra model instance',
    content: {'application/json': {schema: getModelSchemaRef(Obra)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Obra, {
            title: 'NewObra',
            exclude: ['idObra'],
          }),
        },
      },
    })
    obra: Omit<Obra, 'idObra'>,
  ): Promise<Obra> {
    return this.obraRepository.create(obra);
  }

  @get('/obras/count')
  @response(200, {
    description: 'Obra model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Obra) where?: Where<Obra>): Promise<Count> {
    return this.obraRepository.count(where);
  }

  @get('/obras')
  @response(200, {
    description: 'Array of Obra model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Obra, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Obra) filter?: Filter<Obra>): Promise<Obra[]> {
    return this.obraRepository.find(filter);
  }

  @patch('/obras')
  @response(200, {
    description: 'Obra PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Obra, {partial: true}),
        },
      },
    })
    obra: Obra,
    @param.where(Obra) where?: Where<Obra>,
  ): Promise<Count> {
    return this.obraRepository.updateAll(obra, where);
  }

  @get('/obras/{id}')
  @response(200, {
    description: 'Obra model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Obra, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Obra, {exclude: 'where'}) filter?: FilterExcludingWhere<Obra>,
  ): Promise<Obra> {
    return this.obraRepository.findById(id, filter);
  }

  @patch('/obras/{id}')
  @response(204, {
    description: 'Obra PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Obra, {partial: true}),
        },
      },
    })
    obra: Obra,
  ): Promise<void> {
    await this.obraRepository.updateById(id, obra);
  }

  @put('/obras/{id}')
  @response(204, {
    description: 'Obra PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() obra: Obra,
  ): Promise<void> {
    await this.obraRepository.replaceById(id, obra);
  }

  @del('/obras/{id}')
  @response(204, {
    description: 'Obra DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.obraRepository.deleteById(id);
  }
}
