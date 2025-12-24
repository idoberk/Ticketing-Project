import { OrderCancelledEvent, OrderStatus } from '@idoberktickets/common';
import { natsWrapper } from '../../../natsWrapper';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/Order';
import { OrderCancelledListener } from '../orderCancelledListener';

const setup = async () => {
	const listener = new OrderCancelledListener(natsWrapper.client);
	const order = Order.build({
		id: new mongoose.Types.ObjectId().toHexString(),
		status: OrderStatus.Created,
		version: 0,
		userId: '12345',
		price: 10,
	});

	await order.save();

	const data: OrderCancelledEvent['data'] = {
		id: order.id,
		version: 1,
		ticket: {
			id: '3453',
		},
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, order, data, msg };
};

it('updates the status of the order', async () => {
	const { listener, order, data, msg } = await setup();

	await listener.onMessage(data, msg);

	const updatedOrder = await Order.findById(order.id);

	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
	const { listener, data, msg } = await setup();

	await listener.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});
