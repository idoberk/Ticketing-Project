import {
	ExpirationCompleteEvent,
	Listener,
	OrderStatus,
	Subjects,
} from '@idoberktickets/common';
import { QUEUE_GROUP_NAME } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/Order';
import { OrderCancelledPublisher } from '../publishers/orderCancelledPublisher';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
	readonly subject = Subjects.ExpirationComplete;
	queueGroupName = QUEUE_GROUP_NAME;

	async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
		const order = await Order.findById(data.orderId);
		console.log(order);

		if (!order) {
			throw new Error('Order not found');
		}

		order.set({
			status: OrderStatus.Cancelled,
		});

		await order.save();

		await new OrderCancelledPublisher(this.client).publish({
			id: order.id,
			version: order.version,
			ticket: {
				id: order.ticket.toString(),
			},
		});

		msg.ack();
	}
}
