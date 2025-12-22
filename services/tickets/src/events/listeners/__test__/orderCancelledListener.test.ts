import { OrderCancelledEvent } from '@idoberktickets/common';
import { Ticket } from '../../../models/Ticket';
import { natsWrapper } from '../../../natsWrapper';
import { OrderCancelledListener } from '../orderCancelledListener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
	const listener = new OrderCancelledListener(natsWrapper.client);
	const orderId = new mongoose.Types.ObjectId().toHexString();
	const ticket = Ticket.build({
		title: 'concert',
		price: 19,
		userId: new mongoose.Types.ObjectId().toHexString(),
	});

	ticket.set({ orderId });

	await ticket.save();

	const data: OrderCancelledEvent['data'] = {
		id: orderId,
		version: 0,
		ticket: {
			id: ticket.id,
		},
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, ticket, orderId, data, msg };
};

it('updates the ticket', async () => {
	const { listener, ticket, data, msg } = await setup();

	await listener.onMessage(data, msg);

	const updatedTicket = await Ticket.findById(ticket.id);

	expect(updatedTicket!.orderId).not.toBeDefined();
});

it('acks the message', async () => {
	const { listener, data, msg } = await setup();

	await listener.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});

it('publishes a order cancelled event', async () => {
	const { listener, data, msg } = await setup();

	await listener.onMessage(data, msg);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
