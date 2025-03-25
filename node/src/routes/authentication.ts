import express, { NextFunction, Request, Response } from "express";
import { UserModel, CredentialsModel } from "../models";
import authLogic from "../bll/auth-logic";

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
    (req.session as any).token = token;
    res.status(201).json(user_id);
  } catch (err: any) {
    next(err);
  }
});

router.post("/logout", async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send('Could not log out');
      }
    });
    res.sendStatus(201);
  } catch (err: any) {
    next(err);
  }
});

export default router;