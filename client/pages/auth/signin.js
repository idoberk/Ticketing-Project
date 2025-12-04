import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';
import ErrorsDisplay from '../../components/ErrorsDisplay';
import AuthForm from '../../components/AuthForm';

// const Signin = () => {
// 	const [email, setEmail] = useState('');
// 	const [password, setPassword] = useState('');
// 	const { doRequest, errors } = useRequest({
// 		url: '/api/users/signin',
// 		method: 'post',
// 		body: {
// 			email,
// 			password,
// 		},
// 		onSuccess: () => Router.push('/'),
// 	});

// 	const onSubmit = async (event) => {
// 		event.preventDefault();

// 		await doRequest();
// 	};

// 	return (
// 		<form onSubmit={onSubmit}>
// 			<h1>Sign In</h1>
// 			<div className='form-group'>
// 				<label>Email Address</label>
// 				<input
// 					value={email}
// 					onChange={(e) => setEmail(e.target.value)}
// 					className='form-control'
// 				/>
// 				<ErrorsDisplay errors={errors} field='email' />
// 			</div>
// 			<div className='form-group'>
// 				<label>Password</label>
// 				<input
// 					type='password'
// 					value={password}
// 					onChange={(e) => setPassword(e.target.value)}
// 					className='form-control'
// 				/>
// 				<ErrorsDisplay errors={errors} field='password' />
// 			</div>
// 			<button className='btn btn-primary'>Sign In</button>
// 		</form>
// 	);
// };

const Signin = () => {
	return (
		<AuthForm
			title='Sign In'
			url='/api/users/signin'
			buttonText='Sign In'
		/>
	);
};

export default Signin;
