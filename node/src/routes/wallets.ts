import express, { NextFunction, Request, Response } from "express";
import walletsLogic from "../bll/wallets";

const router = express.Router();

router.get("/get-wallets/:user_id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = req.params.user_id;
    const newWallet = await walletsLogic.getUserWallets(user_id);
    res.status(200).json(newWallet);
  } catch (error) {
    next(error);
  }
});

export default router;