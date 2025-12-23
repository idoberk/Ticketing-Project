import { Listener, OrderCreatedEvent, Subjects } from '@idoberktickets/common';
import { QUEUE_GROUP_NAME } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expirationQueue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated;
	queueGroupName = QUEUE_GROUP_NAME;

	async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
		const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

		console.log(`Waiting ${delay} milliseconds to process the job`);

		await expirationQueue.add(
			{
				orderId: data.id,
			},
			{
				delay,
			},
		);

		msg.ack();
	}
}
