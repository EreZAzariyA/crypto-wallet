import { Request } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { ClientError, IUserModel, UserModel } from "../models";
import { ErrorMessages } from "./helpers";
import config from "./config";

class JWTServices {
  private secretKey: string = config.secretKey;

  public getNewToken(user: IUserModel, customExpiresIn?: number): string {
    const token = jwt.sign(user, this.secretKey, { expiresIn: customExpiresIn || (config.loginExpiresIn / 1000) });
    return token;
  };

  public createNewToken(data: any, customExpiresIn?: number): string {
    const token = jwt.sign(data, this.secretKey, { expiresIn: customExpiresIn || (config.loginExpiresIn / 1000) });
    return token;
  };

  public verifyToken(request: Request): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        const session = request.session;
        const token = (session as any).token;
        if (!token) {
          const error = new ClientError(401, 'No token provide');
          reject(error);
        }

        jwt.verify(token, this.secretKey, async (err: VerifyErrors, decoded: IUserModel) => {
          if (err) {
            const error = new ClientError(401, ErrorMessages.TOKEN_EXPIRED);
            reject(error);
          }

          const user: IUserModel = decoded;
          if (user?._id && typeof user._id === 'string') {
            const userPro = await UserModel.exists({ _id: user._id }).exec();
            if (!userPro._id) {
              const err = new ClientError(401, 'User profile not found. Try to reconnect.');
              reject(err);
            }
          }

          resolve(!!token);
        });
      }
      catch (err: any) {
        reject(err);
      }
    });
    // return new Promise((resolve, reject) => {
    //   try {
    //     const token = request.headers.authorization?.substring(7);
    //     if (!token) {
    //       const error = new ClientError(401, 'No token provide');
    //       reject(error);
    //     }

    //     jwt.verify(token, this.secretKey, async (err: VerifyErrors, decoded: IUserModel) => {
    //       if (err) {
    //         const error = new ClientError(401, ErrorMessages.TOKEN_EXPIRED);
    //         reject(error);
    //       }

    //       const user: IUserModel = decoded;
    //       if (user?._id && typeof user._id === 'string') {
    //         const userPro = await UserModel.exists({ _id: user._id }).exec();
    //         if (!userPro._id) {
    //           const err = new ClientError(401, 'User profile not found. Try to reconnect.');
    //           reject(err);
    //         }
    //       }

    //       resolve(!!token);
    //     });
    //   }
    //   catch (err: any) {
    //     reject(err);
    //   }
    // });
  };

  public getUserFromToken(request: Request): IUserModel {
    const token = request.headers.authorization.substring(7);
    const payload = jwt.decode(token);
    const user = (payload as IUserModel);
    return user;
  };

  public getUserFromTokenString(token: string): IUserModel {
    const payload = jwt.decode(token);
    const user = (payload as IUserModel);
    return user;
  };
};

const jwtService = new JWTServices();
export default jwtService;