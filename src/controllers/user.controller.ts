import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, HttpErrors, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {Llaves} from '../config/llaves';
import {Credenciales, User} from '../models';
import {UserRepository} from '../repositories';
import {AutenticacionService} from '../services';

const fetch = require('node-fetch');

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository : UserRepository,
    @service(AutenticacionService)
    public autenticacionService: AutenticacionService
  ) {}

  @post('/users/autenticacion', {
    responses: {
      "200": {
        description: "Identificación de ususarios"
      }
    }
  })
  async userAuthentication(
    @requestBody() credenciales: Credenciales
  ) {
    const user = await this.autenticacionService.identificarUser(credenciales.email, credenciales.password)
    if (user) {
      const token = await this.autenticacionService.generarTokenJWT(user);
      return {
        datos: {
          id: user.idUser,
          nombreCompleto: `${user.nombres} ${user.apellidos}`,
          correo: user.email,
          avatar: user.avatar,
          telefono: user.telefono,
          direccion: user.direccion,
          documento: user.documento,
          rol: token[1]
        },
        token: token[0]
      }
    }
    else {
      throw new HttpErrors[401]("Datos inválidos")
    }
  }

  @post('/users/recuperar-password')
  @response(200, {
    description: 'Recuperar contraseña'
  })
  async recuperarPassword(
    @requestBody() credenciales: Credenciales
  ) {

    const user = await this.userRepository.findOne({where: {email: credenciales.email}});

    if (user) {
      const password = this.autenticacionService.generatePasswordFunction();
      const passwordEncrypted = this.autenticacionService.encryptPasswordFunction(password);
      user.password = passwordEncrypted;

      await this.userRepository.update(user);

      const {nombres, apellidos} = user;

      fetch(`${Llaves.urlServicoNotificaciones}/api/v1/notification/email/change-password`, {
        method: 'POST',
        body: JSON.stringify({
          "receiver": credenciales.email,
          "name": `${nombres} ${apellidos}`,
          "password": password
        }),
        headers: {'Content-Type': 'application/json'}
      })
      return user;
    }
    else {
      throw new HttpErrors[401](`No existe un usuario con email: ${credenciales.email}`)
    }
  }

  @post('/users')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['idUser'],
          }),
        },
      },
    })
    user: Omit<User, 'idUser'>,
  ): Promise<User> {
    const password = this.autenticacionService.generatePasswordFunction();
    const passwordEncrypted = this.autenticacionService.encryptPasswordFunction(password);
    user.password = passwordEncrypted;
    const instanceUser = await this.userRepository.create(user);

    //Cuerpo del email
    const receiver = user.email;

    fetch(`${Llaves.urlServicoNotificaciones}/api/v1/notification/email/confirm-register`, {
      method: 'POST',
      body: JSON.stringify({
        "receiver": receiver,
        "name": `${instanceUser.nombres} ${instanceUser.apellidos}`,
        "email": instanceUser.email,
        "password": password
      }),
      headers: {'Content-Type': 'application/json'}
    })
    return instanceUser;
  }

  @get('/users/count')
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @patch('/users')
  @response(200, {
    description: 'User PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
