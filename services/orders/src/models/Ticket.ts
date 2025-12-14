import mongoose from 'mongoose';
import { Order, OrderStatus } from './Order';

interface TicketAttrs {
	title: string;
	price: number;
}

export interface TicketDoc extends mongoose.Document {
	title: string;
	price: number;
	id: string;
	isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
	build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},

		price: {
			type: Number,
			require: true,
			min: 0,
		},
	},
	{
		toJSON: {
			transform(doc: TicketDoc, ret: any) {
				ret.id = ret._id;
				delete ret._id;
			},
			versionKey: false,
		},
	},
);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
	return new Ticket(attrs);
};

ticketSchema.methods.isReserved = async function () {
	// A query to look at all the orders, and find an order where the ticket is matching the ticket we just found AND the order status is NOT cancelled
	// If we find an order from that query, it means that the ticket is reserved
	const existingOrder = await Order.findOne({
		ticket: this,
		status: {
			$in: [
				OrderStatus.Created,
				OrderStatus.AwaitingPayment,
				OrderStatus.Complete,
			],
		},
	});

	// !! means that if existingOrder is null (we didn't find an existing order), then !existingOrder == True, and then !!existingOrder == False
	// If existingOrder is defined (we found an existing order), then !existingOrder == False and then !!existingOrder == True
	return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
