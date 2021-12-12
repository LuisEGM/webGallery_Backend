import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Llaves} from '../config/llaves';
import {User} from '../models';
import {RolRepository, UserRepository} from '../repositories';

const encryptPassword = require('crypto-js');
const generatePassword = require('password-generator');
const jwt = require('jsonwebtoken');
@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(RolRepository)
    public rolRepository: RolRepository
  ) {}

  /**
   * Generador de contraseña
   *
   * @returns Una contraseña de 6 caracteres
   */
  generatePasswordFunction() {
    return generatePassword(6,false);
  }

  /**
   * Encriptar constraseña
   *
   * @param password The password
   * @returns La contraseña cifrada
   */
  encryptPasswordFunction(password:string) {
    return encryptPassword.MD5(password).toString();
  }

  /**
   * Identificar usuario
   *
   * @param email The email
   * @param password The passwword
   * @returns Informacion del ususario
   */
  async identificarUser(email:string, password:string) {
    try {
      const user = await this.userRepository.findOne({where: {email: email, password: this.encryptPasswordFunction(password)}});
      if (user) {
        return user;
      }
      return false;
    }
    catch (e) {
      return false;
    }
  }

  /**
   * Generar token
   * @param user The usuario
   * @returns Informacion del ususario junto al token
   */
  async generarTokenJWT(user: User) {
    try {
      const rol = await this.rolRepository.findOne({where: { idRol: user.idRol }});
      if (rol) {
        const token = jwt.sign({
          data: user.idUser,
          email: user.email,
          name: user.nombres + " " + user.apellidos,
          rol: rol.nombre,
        }, Llaves.claveJWT);
        return [token, rol.nombre];
      }
      return [];
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  /**
   * Validacion de tokens
   *
   * @param token El token
   * @returns La data que contiene el token
   */
  validarTokenJWT(token: string) {
    try {
      const datos = jwt.verify(token, Llaves.claveJWT);
      return datos;
    } catch {
      return false;
    }
  }

}
