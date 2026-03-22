import { Queue } from 'bullmq';
import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const redisOptions = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
  tls: process.env.REDIS_HOST?.includes('upstash') ? {} : undefined,
};

export const connection = new Redis(redisOptions);

export const assignmentQueue = new Queue('assignment-generation', { connection: connection as any });

export const addAssignmentJob = async (assignmentId: string, data: any) => {
  await assignmentQueue.add('generate-paper', { assignmentId, ...data }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  });
};
