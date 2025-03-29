import { Request } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import config from "./config";
import { Users } from "../collections";
import { IUserModel } from "../models";
import { ErrorMessages } from "./helpers";

class JWTServices {
  private secretKey: string = config.secretKey;

  public getNewToken(user: Partial<IUserModel>, customExpiresIn?: number): string {
    const token = jwt.sign(user, this.secretKey, { expiresIn: customExpiresIn || (config.loginExpiresIn / 1000) });
    return token;
  };

  public createNewToken(data: any, customExpiresIn?: number): string {
    const token = jwt.sign(data, this.secretKey, { expiresIn: customExpiresIn || (config.loginExpiresIn / 1000) });
    return token;
  };

  public verifyToken(request: Request): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const { token } = request.cookies;
        if (!token) {
          return reject('No token provide');
        }

        jwt.verify(token, this.secretKey, async (err: VerifyErrors, decodedUser: IUserModel) => {
          if (err) {
            return reject(ErrorMessages.TOKEN_EXPIRED);
          }

          try {
            const userPro = await Users.findById(decodedUser?._id)
              .select({ services: 0, loginAttempts: 0 })
              .exec();

            if (!userPro) {
              return reject('User profile not found. Try to reconnect.');
            }

            const refreshedToken = this.getNewToken(userPro.toObject());
            resolve(refreshedToken);
          } catch (dbError) {
            reject(dbError);
          }
        });
      }
      catch (err: any) {
        reject(err);
      }
    });
  };

  public getUserFromToken(request: Request): IUserModel {
    const token = request.cookies.token;
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