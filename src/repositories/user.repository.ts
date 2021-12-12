import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Rol, User, UserRelations, Orden, Obra} from '../models';
import {RolRepository} from './rol.repository';
import {OrdenRepository} from './orden.repository';
import {ObraRepository} from './obra.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.idUser,
  UserRelations
> {

  public readonly rol: BelongsToAccessor<Rol, typeof User.prototype.idUser>;

  public readonly ordenes: HasManyRepositoryFactory<Orden, typeof User.prototype.idUser>;

  public readonly obras: HasManyRepositoryFactory<Obra, typeof User.prototype.idUser>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('RolRepository') protected rolRepositoryGetter: Getter<RolRepository>, @repository.getter('OrdenRepository') protected ordenRepositoryGetter: Getter<OrdenRepository>, @repository.getter('ObraRepository') protected obraRepositoryGetter: Getter<ObraRepository>,
  ) {
    super(User, dataSource);
    this.obras = this.createHasManyRepositoryFactoryFor('obras', obraRepositoryGetter,);
    this.registerInclusionResolver('obras', this.obras.inclusionResolver);
    this.ordenes = this.createHasManyRepositoryFactoryFor('ordenes', ordenRepositoryGetter,);
    this.registerInclusionResolver('ordenes', this.ordenes.inclusionResolver);
    this.rol = this.createBelongsToAccessorFor('rol', rolRepositoryGetter,);
    this.registerInclusionResolver('rol', this.rol.inclusionResolver);
  }
}
