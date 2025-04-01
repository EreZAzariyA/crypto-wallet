import { Router, Request, Response, NextFunction } from 'express';
import serviceRegistry from '../service';
import config from '../utils/config';

const router = Router();

router.get('/find/:name/:version', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, version } = req.params;
    const service = serviceRegistry.get(name, version);
    if (!service) {
      const msg = `Service ${name} not found`;
      res.status(400).json(msg);
      config.log.warn(msg);
    }

    res.status(200).json(service);
  } catch (error) {
    next(error);
  }
});

router.put('/register/:name/:version/:port', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, version, port } = req.params;
    const remoteAddress = req.connection.remoteAddress;
    const serviceIp = remoteAddress.includes('::') ? `[${remoteAddress}]` : remoteAddress;

    const serviceKey = serviceRegistry.register({
      name,
      version,
      port,
      ip: serviceIp
    });
    res.status(200).json({ result: serviceKey });
  } catch (error) {
    next(error);
  }
});

router.delete('/unregister/:name/:version/:port', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, version, port } = req.params;
    const remoteAddress = req.connection.remoteAddress;
    const serviceIp = remoteAddress.includes('::') ? `[${remoteAddress}]` : remoteAddress;
    
    const serviceKey = serviceRegistry.unregister({
      name,
      version,
      port,
      ip: serviceIp
    });

    res.status(200).json({ result: `Deleted ${serviceKey}.` });
  } catch (error) {
    next(error);
  }
});



export default router;