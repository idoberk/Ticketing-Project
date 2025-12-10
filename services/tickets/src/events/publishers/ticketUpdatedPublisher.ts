import {
	Publisher,
	Subjects,
	TicketUpdatedEvent,
} from '@idoberktickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	readonly subject = Subjects.TicketUpdated;
}
