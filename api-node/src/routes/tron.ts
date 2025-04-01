import { NextFunction, Request, Response, Router } from "express";
import { tronLogic } from "../bll";

const router = Router();

router.post('/create-wallet/:user_id', async(req: Request, res: Response, next: NextFunction) => {
  try {
    const wallet = await tronLogic.createWallet();
    res.status(200).json(wallet);
  } catch (error) {
    next(error);
  }
});


export default router;