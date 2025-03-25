import express, { Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import authRouter from './routes/authentication';
import tronRouter from './routes/tron';
import walletsRouter from './routes/wallets';
import connectToMongoDB from './dal/dal';
import config from './utils/config';
import { errorsHandler, verifyToken } from './middlewares';
import cronJobs from './workers';
import { CoinTypes } from './bll/wallets';
import SocketIo from './dal/socket';
import session from 'express-session'
import MongoStore from 'connect-mongo';

const app = express();
const httpServer = http.createServer(app);
export const socket = new SocketIo(httpServer);

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

app.use(
  session({
    secret: config.secretKey,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongoUrl: config.mongoConnectionString,
      collectionName: 'sessions',
      ttl: config.loginExpiresIn / 1000
    }),
    cookie: {
      httpOnly: config.isProduction,
      secure: config.isProduction,
      maxAge: config.loginExpiresIn,
      priority: 'high',
    }
  })
);

app.use('/api/auth', authRouter);
app.use('/api/tron', verifyToken, tronRouter);
app.use('/api/wallet', verifyToken, walletsRouter);

app.use('*', async(_: Request, res: Response) => {
  res.status(404).json('Page not found');
});

httpServer.listen(5000, () => {
  config.log.info('Listening on port 5000');
  cronJobs.startJobs([CoinTypes.TRX]);

  connectToMongoDB().then((collectionName) => {
    config.log.info(`Successfully connected to ${collectionName}`);
  });
});

app.use(errorsHandler);