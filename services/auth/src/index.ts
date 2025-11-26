import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/currentUser';
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';
import { errorHandler } from './middlewares/errorHandler';
import { NotFoundError } from './errors/notFoundError';

const app = express();
app.set('trust proxy', true);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
	cookieSession({
		signed: false,
		secure: true,
	}),
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.all('*', async (req, res) => {
	throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
	if (!process.env.JWT_KEY) {
		throw new Error('JWT_KEY must be defined');
	}

	try {
		await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
		console.log('Connected to mongoDB');
	} catch (err) {
		console.error(err);
	}

	app.listen(3000, () => {
		console.log('Listening on port 3000!!!');
	});
};

start();
