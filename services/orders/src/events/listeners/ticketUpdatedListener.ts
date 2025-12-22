import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@idoberktickets/common';
import { Ticket } from '../../models/Ticket';
import { QUEUE_GROUP_NAME } from './queueGroupName';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
	readonly subject = Subjects.TicketUpdated;
	queueGroupName = QUEUE_GROUP_NAME;

	async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
		const ticket = await Ticket.findByIdAndPreVersion(data);

		if (!ticket) {
			throw new Error('Ticket not found');
		}

		const { title, price } = data;

		ticket.set({ title, price });

		await ticket.save();

		msg.ack();
	}
}
