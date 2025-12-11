import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';

export interface ITokenPayload {
  id: string;
  email: string;
}

export const generateToken = (payload: ITokenPayload): string => {
  return jwt.sign(payload, config.jwt.secret as string, {
    expiresIn: config.jwt.expire,
  } as SignOptions);
};

export const verifyToken = (token: string): ITokenPayload => {
  return jwt.verify(token, config.jwt.secret) as ITokenPayload;
};
