import { OrderStatus } from '@idoberktickets/common';
import mongoose from 'mongoose';
import { TicketDoc } from './Ticket';

interface OrderAttrs {
	userId: string;
	status: OrderStatus;
	expiresAt: Date;
	ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
	userId: string;
	status: OrderStatus;
	expiresAt: Date;
	ticket: TicketDoc;
	version: number;
	id: string;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
	build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			required: true,
			enum: Object.values(OrderStatus),
			default: OrderStatus.Created,
		},
		expiresAt: {
			type: mongoose.Schema.Types.Date,
		},
		ticket: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Ticket',
		},
	},
	{
		optimisticConcurrency: true,
		versionKey: 'version',
		toJSON: {
			transform(doc: OrderDoc, ret: any) {
				ret.id = ret._id;
				delete ret._id;
			},
		},
	},
);

orderSchema.statics.build = (attrs: OrderAttrs) => {
	return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('order', orderSchema);

export { Order, OrderStatus };
