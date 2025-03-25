import express, { NextFunction, Request, Response } from "express";
import tronLogic from "../bll/tron-logic";

const router = express.Router();

router.post("/create-wallet/TRX/:user_id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = req.params.user_id;
    const newWallet = await tronLogic.createWallet(user_id);
    res.status(200).json(newWallet);
  } catch (error) {
    next(error);
  }
});

router.get("/get-wallet/:address", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const address = req.params.address;
    const walletDetails = await tronLogic.getWalletDetails(address);
    res.status(200).json(walletDetails);
  } catch (error) {
    next(error);
  }
});

router.get("/get-transactions/:address", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const address = req.params.address;
    const transactions = await tronLogic.fetchWalletTransactions(address);
    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
});

export default router;