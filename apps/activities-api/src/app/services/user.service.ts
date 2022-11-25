require('dotenv').config()
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { Db } from 'mongodb';
import { UserModel } from '@uncool/shared';
import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class UserService {
  private repo: UserRepository;
  constructor(@Inject('DATABASE_CONNECTION') protected db: Db) {
    this.repo = new UserRepository(db);
  }

  async authenticate(login: Partial<UserModel>) {
    if (!login.password) throw "invalid email or password";
    const user = await this.repo.findOne({ email: login.email }) as unknown as UserModel;

    if (!user) {
      throw "user not found";
    }
    if (user && bcrypt.compareSync(login.password, user.password)) {
      const token = jwt.sign({ sub: user._id }, process.env.CRYPT, { expiresIn: '7d' });

      user.token = token;
      this.updateUserToken({ ...user, token });

      return {
        ...user,
        token
      };
    }
  }

  async create(user: Partial<UserModel>) {
    // validate
    const find = await this.repo.find({ email: user.email })[0];

    if (find !== 0 && find !== undefined) {
      throw 'email "' + user.email + '" is already being used!';
    }
    // hash password
    if (user.password) {
      user.password = bcrypt.hashSync(user.password, 10);
    }
    if (user.email && user.password) {
      // save user
      await this.repo.insert(user);

      const token = jwt.sign({ sub: user.id }, process.env.CRYPT, { expiresIn: '7d' });

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
    return await this.repo.update({ id: lastChange.id }, changed).then(x => {
      return x;
    });
  }

  async changePassword(user: UserModel, changePass: string) {
    if (user) {
      if (bcrypt.compareSync(changePass, user.password)) {
        const hashPassword = bcrypt.hashSync(changePass, 10);
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
    return await this.repo.findOne({ id }) as unknown as UserModel;
  }

  async getByEmail(email: string) {
    return await this.repo.findOne({ email }) as unknown as UserModel;
  }

  async getByToken(token: string) {
    const user = await this.repo.findOne({ token }) as unknown as UserModel;
    if (user)
      return user as UserModel;
    else throw 'user not found'
  }

  async updateUserToken(_user: Partial<UserModel>) {
    const user = await this.getById(_user.id);

    // validate
    if (!user) throw 'user not found';

    return this.repo.update({ _id: user.id }, { token: user.token });
  }

  // async _delete(id: string) {
  //     await this.(UserModel.NomeID, {_id : id});
  // }

  async UpdateUserToken(id: string, token: any) { // updates one user token
    await this.repo.update({ _id: id }, { token });
  }

  async UpdateUserPassword(id: string, password: any) { // updates one user token
    await this.repo.update({ _id: id }, { password });
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
