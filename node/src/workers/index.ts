import { ScheduledTask } from "node-cron";
import { CoinTypes } from "../bll/wallets";
import { ethJob, tronJob } from "./tron";

type CronJobsType = Record<CoinTypes, { run: boolean, job: ScheduledTask }>

const Jobs: CronJobsType = {
  [CoinTypes.TRX]: {
    run: false,
    job: tronJob
  },
  [CoinTypes.ETH]: {
    run: false,
    job: ethJob
  }
};

class CronJobs {
  public jobs: CronJobsType = Jobs;

  constructor() {
    Object.values(this.jobs).forEach((job) => {
      job.job.stop();
      job.run = false;
    })
  }

  startJob(coin: CoinTypes) {
    this.jobs[coin].run = true;
    this.jobs[coin].job.start();
  };

  startJobs(coins: CoinTypes[]) {
    coins.forEach((coin) => {
      const job = this.jobs[coin];
      if (job) {
        job.job.start();
        job.run = true;
      }
    });
  };

  stopJob(coin: CoinTypes) {
    this.jobs[coin].run = false;
    this.jobs[coin].job.stop();
  };

  stopAllJobs() {
    Object.values(this.jobs).forEach((cronJob) => {
      cronJob.run = false;
      cronJob.job.stop();
    });
  };
};

const cronJobs = new CronJobs();
export default cronJobs;