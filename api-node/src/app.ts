import axios from 'axios';
import express from 'express';
import config from './utils/config';
import router from './routes/tron';
import cronJobs from './workers';
import { CoinTypes } from './utils/coins';
import { mongoose } from './dal';
// import { connectToMongoDB } from './dal';

const app = express();
app.use(express.json());
const serviceRegistryUrl = process.env.SERVICE_REGISTRY_URL;

app.use('/api', router);

const server = app.listen(0, () => {
  mongoose.connectToMongoDB().then((collectionName) => {
    config.log.info(`Successfully connected to ${collectionName}`);
  });

  const port = (server.address() as any).port;
  const registerService = () => axios.put(`${serviceRegistryUrl}/register/${config.name}/${config.version}/${port}`);
  const unregisterService = () => axios.delete(`${serviceRegistryUrl}/unregister/${config.name}/${config.version}/${port}`);

  registerService();

  const interval = setInterval(registerService, 30 * 1000);
  const cleanup = async () => {
    clearInterval(interval);
    await unregisterService();
  };

  process.on('uncaughtException', async () => {
    await cleanup();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    await cleanup();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await cleanup();
    process.exit(0);
  });

  cronJobs.startJobs([CoinTypes.TRX, CoinTypes.ETH]);

  config.log.info(`Listening on port: ${port} in ${app.get('env')} mode.`);
});