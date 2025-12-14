import {
	OrderCancelledEvent,
	Publisher,
	Subjects,
} from '@idoberktickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	readonly subject = Subjects.OrderCancelled;
}
