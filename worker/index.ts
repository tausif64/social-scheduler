import { Queue, Worker } from "bullmq";
import Redis from "ioredis";

const connection = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379");

export const postQueue = new Queue("post", { connection });

export const worker = new Worker(
  "post",
  async (job) => {
    console.log(`Processing job ${job.id}:`, job.data);
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});
