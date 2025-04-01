import express from 'express';
import config from './utils/config';
import serviceRouter from './routes';

const app = express();
app.use(express.json());

app.use('/', serviceRouter);

app.listen(config.port, () => {
  config.log.info(`Listening on port: ${config.port} in ${app.get('env')} mode.`);
});