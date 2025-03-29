import express, { NextFunction, Request, Response } from "express";
import { CredentialsModel } from "../models";
import { Users } from "../collections";
import { authLogic } from "../bll";
import config from "../utils/config";

const router = express.Router();

router.post("/signup", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = new Users(req.body);
    await authLogic.signup(user);
    res.sendStatus(201);
  } catch (err: any) {
    next(err);
  }
});

router.post("/signin", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const credentials = new CredentialsModel(req.body);
    const token = await authLogic.signin(credentials);
    res.cookie('token', token, {
      maxAge: config.loginExpiresIn,
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      priority: 'high',
    }).status(201).json(token);
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