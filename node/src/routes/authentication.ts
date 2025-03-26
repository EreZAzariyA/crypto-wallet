import express, { NextFunction, Request, Response } from "express";
import { UserModel, CredentialsModel } from "../models";
import authLogic from "../bll/auth-logic";
import config from "../utils/config";

const router = express.Router();

router.post("/signup", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = new UserModel(req.body);
    await authLogic.signup(user);
    res.sendStatus(201);
  } catch (err: any) {
    next(err);
  }
});

router.post("/signin", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const credentials = new CredentialsModel(req.body);
    const { token, user_id } = await authLogic.signin(credentials);
    res.cookie('token', token, {
      httpOnly: config.isProduction,
      maxAge: config.loginExpiresIn,
      secure: config.isProduction,
      priority: 'high',
      path: '/'
    }).status(201).json(user_id);
  } catch (err: any) {
    next(err);
  }
});

router.post("/logout", async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('token', {
      httpOnly: config.isProduction,
      secure: config.isProduction,
      priority: 'high',
      path: '/'
    });
    res.sendStatus(201);
  } catch (err: any) {
    next(err);
  }
});

export default router;