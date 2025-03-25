import express, { NextFunction, Request, Response } from "express";
import walletsLogic, { CoinTypes } from "../bll/wallets";

const router = express.Router();

router.post("/create-wallet", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, coin } = req.body;
    const newWallet = await walletsLogic.createWallet(user_id, CoinTypes[coin]);
    res.status(200).json(newWallet);
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