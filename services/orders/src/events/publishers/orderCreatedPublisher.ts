import { OrderCreatedEvent, Publisher, Subjects } from '@idoberktickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated;
}
