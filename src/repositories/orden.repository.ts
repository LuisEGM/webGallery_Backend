import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Orden, OrdenRelations, User, OrdenDetails} from '../models';
import {UserRepository} from './user.repository';
import {OrdenDetailsRepository} from './orden-details.repository';

export class OrdenRepository extends DefaultCrudRepository<
  Orden,
  typeof Orden.prototype.idOrden,
  OrdenRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Orden.prototype.idOrden>;

  public readonly ordenDetails: HasManyRepositoryFactory<OrdenDetails, typeof Orden.prototype.idOrden>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('OrdenDetailsRepository') protected ordenDetailsRepositoryGetter: Getter<OrdenDetailsRepository>,
  ) {
    super(Orden, dataSource);
    this.ordenDetails = this.createHasManyRepositoryFactoryFor('ordenDetails', ordenDetailsRepositoryGetter,);
    this.registerInclusionResolver('ordenDetails', this.ordenDetails.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
