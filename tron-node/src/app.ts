import express from 'express';
import config from './utils/config';
import router from './routes/tron';

const app = express();
app.use(express.json());

app.use('/api', router);

app.listen(config.port, () => {
  console.log(`Listening on port ${config.port}`);
});