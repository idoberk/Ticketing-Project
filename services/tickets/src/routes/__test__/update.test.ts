import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../natsWrapper';
import { Ticket } from '../../models/Ticket';

it('returns a 404 if the provided id does not exist', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	const title = 'concert';
	const price = 20;

	await request(app)
		.put(`/api/tickets/${id}`)
		.set('Cookie', signin())
		.send({
			title,
			price,
		})
		.expect(404);
});

it('return a 401 if the user is not authenticated', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	const title = 'concert';
	const price = 20;

	await request(app)
		.put(`/api/tickets/${id}`)
		.send({
			title,
			price,
		})
		.expect(401);
});

it('returns a 401 if the user is not the ticket owner', async () => {
	const title = 'concert';
	const price = 20;
	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', signin())
		.send({
			title,
			price,
		});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', signin())
		.send({
			title: 'askfskaf',
			price: 1000,
		})
		.expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
	const title = 'concert';
	const price = 20;
	const cookie = signin();
	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			title,
			price,
		});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: '',
			price,
		})
		.expect(400);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title,
			price: -25,
		})
		.expect(400);
});

it('updates the ticket provided valid inputs', async () => {
	const title = 'concert';
	const price = 20;
	const cookie = signin();
	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			title,
			price,
		});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: 'Hello world!',
			price: 25,
		})
		.expect(200);

	const ticketResponse = await request(app)
		.get(`/api/tickets/${response.body.id}`)
		.send();

	expect(ticketResponse.body.title).toEqual('Hello world!');
	expect(ticketResponse.body.price).toEqual(25);
});

it('publishes an event', async () => {
	const title = 'concert';
	const price = 20;
	const cookie = signin();
	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			title,
			price,
		});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: 'Hello world!',
			price: 25,
		})
		.expect(200);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updated if the ticket is reserved', async () => {
	const title = 'concert';
	const price = 20;
	const cookie = signin();
	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({
			title,
			price,
		});

	const ticket = await Ticket.findById(response.body.id);

	ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });

	await ticket!.save();

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: 'Hello world!',
			price: 25,
		})
		.expect(400);
});
