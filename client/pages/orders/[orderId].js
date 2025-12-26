import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/useRequest';
import Router from 'next/router';

const OrderShow = ({ order, currentUser }) => {
	const [timeLeft, setTimeLeft] = useState(0);
	const { doRequest, errors } = useRequest({
		url: '/api/payments',
		method: 'post',
		body: {
			orderId: order.id,
		},
		onSuccess: () => Router.push('/orders'),
	});

	useEffect(() => {
		const findTimeLeft = () => {
			const msLeft = new Date(order.expiresAt) - new Date();

			setTimeLeft(Math.round(msLeft / 1000));
		};

		findTimeLeft();
		const timerId = setInterval(findTimeLeft, 1000);

		return () => {
			clearInterval(timerId);
		};
	}, []);

	if (timeLeft < 0) {
		return <div>Order Expired</div>;
	}

	return (
		<div>
			OrderShow
			<h1>Order will expire in: {timeLeft} seconds</h1>
			<StripeCheckout
				key={order.id}
				token={({ id }) => doRequest({ token: id })}
				stripeKey='pk_test_51ShrEvEKVENAfKzqpu5VBWTo9CMapxMonKYbE2HC2kfxdL9SRJNPRwUBoThwetDcffyUWOSH2Rsf8y8deGPjrJtU00FvxEeOcH'
				amount={order.ticket.price * 100}
				email={currentUser.email}
			/>
			{errors && (
				<div className='alert alert-danger'>
					<h4>Ooops....</h4>
					<ul className='my-0'>
						{errors.map((err) => (
							<li key={err.message}>{err.message}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

OrderShow.getInitialProps = async (context, client) => {
	const { orderId } = context.query;
	const { data } = await client.get(`/api/orders/${orderId}`);

	return { order: data };
};

export default OrderShow;
