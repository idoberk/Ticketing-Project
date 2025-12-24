import {
	Listener,
	OrderStatus,
	PaymentCreatedEvent,
	Subjects,
} from '@idoberktickets/common';
import { QUEUE_GROUP_NAME } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/Order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
	readonly subject = Subjects.PaymentCreated;
	queueGroupName = QUEUE_GROUP_NAME;

	async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
		const order = await Order.findById(data.orderId);

		if (!order) {
			throw new Error('Order not found');
		}

		order.set({
			status: OrderStatus.Complete,
		});

		await order.save();

		msg.ack();
	}
}
