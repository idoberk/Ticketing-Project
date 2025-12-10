import {
	Publisher,
	Subjects,
	TicketCreatedEvent,
} from '@idoberktickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	readonly subject = Subjects.TicketCreated;
}
