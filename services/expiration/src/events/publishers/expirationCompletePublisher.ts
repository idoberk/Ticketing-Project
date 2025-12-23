import {
	ExpirationCompleteEvent,
	Publisher,
	Subjects,
} from '@idoberktickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
	readonly subject = Subjects.ExpirationComplete;
}
