import { OrderCreatedEvent, OrderStatus } from '@idoberktickets/common';
import { natsWrapper } from '../../../natsWrapper';
import { OrderCreatedListener } from '../orderCreatedListener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/Order';

const setup = async () => {
	const listener = new OrderCreatedListener(natsWrapper.client);
	const data: OrderCreatedEvent['data'] = {
		id: new mongoose.Types.ObjectId().toHexString(),
		version: 0,
		status: OrderStatus.Created,
		userId: '12345',
		expiresAt: '12345',
		ticket: {
			id: '345345',
			price: 10,
		},
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, data, msg };
};

it('replicates the order info', async () => {
	const { listener, data, msg } = await setup();

	await listener.onMessage(data, msg);

	const order = await Order.findById(data.id);

	expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
	const { listener, data, msg } = await setup();

	await listener.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});
