import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {OrdenDetails, OrdenDetailsRelations, Orden, Obra} from '../models';
import {OrdenRepository} from './orden.repository';
import {ObraRepository} from './obra.repository';

export class OrdenDetailsRepository extends DefaultCrudRepository<
  OrdenDetails,
  typeof OrdenDetails.prototype.idOrdenDetail,
  OrdenDetailsRelations
> {

  public readonly orden: BelongsToAccessor<Orden, typeof OrdenDetails.prototype.idOrdenDetail>;

  public readonly obra: BelongsToAccessor<Obra, typeof OrdenDetails.prototype.idOrdenDetail>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('OrdenRepository') protected ordenRepositoryGetter: Getter<OrdenRepository>, @repository.getter('ObraRepository') protected obraRepositoryGetter: Getter<ObraRepository>,
  ) {
    super(OrdenDetails, dataSource);
    this.obra = this.createBelongsToAccessorFor('obra', obraRepositoryGetter,);
    this.registerInclusionResolver('obra', this.obra.inclusionResolver);
    this.orden = this.createBelongsToAccessorFor('orden', ordenRepositoryGetter,);
    this.registerInclusionResolver('orden', this.orden.inclusionResolver);
  }
}
