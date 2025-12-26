import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../hooks/useRequest';
import FormInput from './FormInput';

const TicketForm = ({ title, url, buttonText }) => {
	const [ticketTitle, setTicketTitle] = useState('');
	const [price, setPrice] = useState('');
	const { doRequest, errors } = useRequest({
		url,
		method: 'post',
		body: {
			title: ticketTitle,
			price,
		},
		onSuccess: () => Router.push('/'),
	});

	const onSubmit = (event) => {
		event.preventDefault();

		doRequest();
	};

	return (
		<form onSubmit={onSubmit}>
			<h1>{title}</h1>
			<FormInput
				label='Ticket Title'
				value={ticketTitle}
				onChange={(e) => setTicketTitle(e.target.value)}
				errors={errors}
				field='ticketTitle'
			/>
			<FormInput
				label='Price'
				type='number'
				value={price}
				onChange={(e) => setPrice(e.target.value)}
				errors={errors}
				field='price'
			/>
			<button className='btn btn-primary'>{buttonText}</button>
		</form>
	);
};

export default TicketForm;
