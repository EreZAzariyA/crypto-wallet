import { Router, Request, Response, NextFunction } from 'express';
import { transactionsLogic } from '../bll';

const router = Router();

router.get('/:user_id', async(req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = req.params.user_id;
    const queryOptions = req.query;
    const data = await transactionsLogic.getUserTransactions(user_id, queryOptions);
    res.status(200).json(data)
  } catch (error) {
    next(error);
  }
});

export default router;