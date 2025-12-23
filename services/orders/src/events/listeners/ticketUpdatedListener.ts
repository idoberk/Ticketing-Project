import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@idoberktickets/common';
import { Ticket } from '../../models/Ticket';
import { QUEUE_GROUP_NAME } from './queueGroupName';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
	readonly subject = Subjects.TicketUpdated;
	queueGroupName = QUEUE_GROUP_NAME;

	async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
		const { title, price, id, version } = data;

		// Use findOneAndUpdate to update and increment version atomically
		const ticket = await Ticket.findOneAndUpdate(
			{
				_id: id,
				version: version - 1,
			},
			{
				$set: { title, price },
				$inc: { version: 1 },
			},
		);

		if (!ticket) {
			throw new Error('Ticket not found');
		}

		msg.ack();
	}
}
