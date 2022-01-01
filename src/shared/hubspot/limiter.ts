import { RateLimiterMemory, RateLimiterQueue } from 'rate-limiter-flexible';

const limiterFlexible = new RateLimiterMemory({
  points: 1,
  duration: 1,
});

export const limiterQueue = new RateLimiterQueue(limiterFlexible, {
  maxQueueSize: 101,
});
