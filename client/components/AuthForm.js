import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../hooks/useRequest';
import FormInput from './FormInput';

const AuthForm = ({ title, url, buttonText }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { doRequest, errors } = useRequest({
		url,
		method: 'post',
		body: {
			email,
			password,
		},
		onSuccess: () => Router.push('/'),
	});

	const onSubmit = async (event) => {
		event.preventDefault();
		await doRequest();
	};
	return (
		<form onSubmit={onSubmit}>
			<h1>{title}</h1>
			<FormInput
				label='Email Address'
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				errors={errors}
				field='email'
			/>
			<FormInput
				label='Password'
				type='password'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				errors={errors}
				field='password'
			/>
			<button className='btn btn-primary'>{buttonText}</button>
		</form>
	);
};

export default AuthForm;
