import { NextFunction, Request, Response, Router } from "express";
import tronService from "../bll/tron";

const router = Router();

router.post('/create-wallet/:user_id', async(req: Request, res: Response, next: NextFunction) => {
  try {
    const wallet = await tronService.createWallet();
    res.status(200).json(wallet);
  } catch (error) {
    next(error);
  }
});

router.get('/address-balance/:address', async(req: Request, res: Response, next: NextFunction) => {
  try {
    const address = req.params.address;
    const balance = await tronService.getBalance(address);
    res.status(200).json(balance);
  } catch (error) {
    next(error);
  }
});


export default router;