import { Router, Request, Response, NextFunction } from "express";
import adminLogic from "../bll/admin-logic";

const router = Router();

router.get('/get-users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryOptions = req.query;
    const data = await adminLogic.getUsers(queryOptions);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});



export default router;