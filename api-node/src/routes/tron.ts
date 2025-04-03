import { NextFunction, Request, Response, Router } from "express";
import { tronLogic } from "../bll";
import { walletsLogic } from "../bll/wallets";

const router = Router();

router.post('/create-wallet/:user_id', async(req: Request, res: Response, next: NextFunction) => {
  try {
    const wallet = await tronLogic.createWallet();
    res.status(200).json(wallet);
  } catch (error) {
    next(error);
  }
});

router.get("/get-wallets/:user_id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.params;
    const newWallet = await walletsLogic.getUserWallets(user_id);
    res.status(200).json(newWallet);
  } catch (error) {
    next(error);
  }
});


export default router;