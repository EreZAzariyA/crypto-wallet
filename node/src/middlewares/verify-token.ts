import { NextFunction, Request, Response } from "express";
import ClientError from "../models/client-error";
import jwt from "../utils/jwt";
import config from "../utils/config";

const verifyToken = async(req: Request, res: Response, next: NextFunction):Promise<void> => {
  try {
    const refreshedToken = await jwt.verifyToken(req);
    res.cookie('token', refreshedToken, {
      httpOnly: config.isProduction,
      maxAge: config.loginExpiresIn,
      secure: config.isProduction,
      priority: 'high',
      path: '/'
    })
  } catch (err: any) {
    const error = new ClientError(401, err);
    next(error);
  }

  next();
};

export default verifyToken;
