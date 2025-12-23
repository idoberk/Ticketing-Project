import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/expirationCompletePublisher';
import { natsWrapper } from '../natsWrapper';

interface PayLoad {
	orderId: string;
}

const expirationQueue = new Queue<PayLoad>('order:expiration', {
	redis: {
		host: process.env.REDIS_HOST,
	},
});

expirationQueue.process(async (job) => {
	new ExpirationCompletePublisher(natsWrapper.client).publish({
		orderId: job.data.orderId,
	});
});

export { expirationQueue };
