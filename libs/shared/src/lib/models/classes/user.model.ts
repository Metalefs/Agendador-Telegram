import { AuthModel } from './auth.model';
export class UserModel extends AuthModel {
  id?: string;
  _id?: string;
  username?: string;
  password!: string;
  email?: string;
  token?: string;
  roles?: number[] = [];
  // personal information
  // personal information
  firstName?: string;
  lastName?: string;
}
