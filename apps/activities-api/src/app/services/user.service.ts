require('dotenv').config()
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { Db } from 'mongodb';
import { BaseService } from './base.service';
import { UserModel } from '@uncool/shared';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UserService extends BaseService {

  constructor(@Inject('DATABASE_CONNECTION') protected db: Db) {
    super(db, 'user')
  }

  async authenticate(user: UserModel) {
    console.log('query:', { email: user.email }, { password: user.password });

    if (!user.password) throw "invalid email or password";
    return await this.find({ email: user.email }).then((user: any) => {
      
      if (user == 0) {
        throw "user not found";
      }
      if (user !== undefined)
        if (user && bcrypt.compareSync(user.password, user.password)) {
          const token = jwt.sign({ sub: user._id }, process.env.CRYPT, { expiresIn: '7d' });
          console.log("successful login: ", { ...user, token });

          user.token = token;
          this.updateUserToken({ ...user, token });

          return {
            ...user,
            token
          };
        }

    });
  }

  async create(user: UserModel) {
    // validate
    const find = await this.find({ email: user.email })[0];
    console.log("FIND", find);
    if (find !== 0 && find !== undefined) {
      throw 'email "' + user.email + '" is already being used!';
    }
    // hash password
    if (user.password) {
      user.password = bcrypt.hashSync(user.password, 10);
    }
    console.log("creating user:", user);
    if (user.email && user.password) {
      // save user
      await this.create(user);

      const token = jwt.sign({ sub: user.id }, process.env.CRYPT, { expiresIn: '7d' });
      console.log("usuário cadastrado com sucesso. token gerado", { ...user, token });

      user.token = token;
      this.updateUserToken(user);
      return {
        ...user,
        token
      };
    } else {
      throw 'user not created missing email or password';
    }
  }

  async UpdateInfo(lastChange: UserModel, newChange: UserModel) {
    const changed = Object.assign(lastChange, this.omitEmailPasswordAndType(newChange));
    console.log(changed);
    return await this.update({ id: lastChange.id }, changed).then(x => {
      return x;
    });
  }

  async changePassword(user: UserModel, changePass: string) {
    if (user) {
      if (bcrypt.compareSync(changePass, user.password)) {
        const hashPassword = bcrypt.hashSync(changePass, 10);
        console.log('newp', hashPassword);
        return await this.UpdateUserPassword(user.id, hashPassword);
      }
      else {
        throw 'invalid password'
      }
    }
    else {
      throw 'email not found'
    }
  }

  async getById(id: string) {
    return await this.find({ id })[0] as UserModel[];
  }

  async getByEmail(email: string) {
    return await this.find({ email })[0] as UserModel;
  }

  async getByToken(token: string) {
    const user = await this.find({ token })[0];
    if (user)
      return user as UserModel;
    else throw 'user not found'
  }

  async updateUserToken(_user: UserModel) {
    const user = await this.getById(_user.id)[0];

    // validate
    if (!user) throw 'user not found';

    return this.update({ _id: user.id }, { token: user.token });
  }

  // async _delete(id: string) {
  //     await this.(UserModel.NomeID, {_id : id});
  // }

  async UpdateUserToken(id: string, token: any) { // updates one user token
    await this.update({ _id: id }, { token });
  }

  async UpdateUserPassword(id: string, password: any) { // updates one user token
    await this.update({ _id: id }, { password });
  }

  // helper functions

  omitEmailPasswordAndType(user: UserModel) {
    const { password, email, ...userWithoutEmailAndPassword } = user;
    return userWithoutEmailAndPassword;
  }

  omitPassword(user: UserModel) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

};
