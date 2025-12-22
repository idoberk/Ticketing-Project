import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@idoberktickets/common';
import { Ticket } from '../../models/Ticket';
import { QUEUE_GROUP_NAME } from './queueGroupName';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
	readonly subject = Subjects.TicketCreated;
	queueGroupName = QUEUE_GROUP_NAME;

	async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
		const { id, title, price } = data;
		const ticket = Ticket.build({
			id,
			title,
			price,
		});

		await ticket.save();

		msg.ack();
	}
}
