import express, { NextFunction, Request, Response } from "express";
import { walletsLogic, CoinTypes } from "../bll";
import jwtService from "../utils/jwt";
import walletsService from "../services/WalletsServices";

const router = express.Router();

router.get("/get-wallets/:user_id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.params;
    const newWallet = await walletsService.getUserWallets(user_id);
    res.status(200).json(newWallet);
  } catch (error) {
    next(error);
  }
});

router.post("/create-wallet", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, coin } = req.body;
    const user = jwtService.getUserFromTokenString(req.cookies.token);
    const newWallet = await walletsService.createWallet(user_id, CoinTypes[coin], user?.admin);
    res.status(200).json(newWallet);
  } catch (error) {
    next(error);
  }
});

router.post("/send-coins", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { wallet, to, amount } = req.body;
    const trans = await walletsLogic.sendCoins(wallet, to, amount);
    res.status(200).json(trans);
  } catch (error) {
    next(error);
  }
});

export default router;