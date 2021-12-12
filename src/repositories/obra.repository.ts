import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Obra, ObraRelations, OrdenDetails, User} from '../models';
import {OrdenDetailsRepository} from './orden-details.repository';
import {UserRepository} from './user.repository';

export class ObraRepository extends DefaultCrudRepository<
  Obra,
  typeof Obra.prototype.idObra,
  ObraRelations
> {

  public readonly ordenDetails: HasManyRepositoryFactory<OrdenDetails, typeof Obra.prototype.idObra>;

  public readonly propietario: BelongsToAccessor<User, typeof Obra.prototype.idObra>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('OrdenDetailsRepository') protected ordenDetailsRepositoryGetter: Getter<OrdenDetailsRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Obra, dataSource);
    this.propietario = this.createBelongsToAccessorFor('propietario', userRepositoryGetter,);
    this.registerInclusionResolver('propietario', this.propietario.inclusionResolver);
    this.ordenDetails = this.createHasManyRepositoryFactoryFor('ordenDetails', ordenDetailsRepositoryGetter,);
    this.registerInclusionResolver('ordenDetails', this.ordenDetails.inclusionResolver);
  }
}
