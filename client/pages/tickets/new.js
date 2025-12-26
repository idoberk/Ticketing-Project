import TicketForm from '../../components/TicketForm';

// const NewTicket = () => {
// 	const [title, setTitle] = useState('');
// 	const [price, setPrice] = useState('');
// 	const { doRequest, errors } = useRequest({
// 		url: '/api/tickets',
// 		method: 'post',
// 		body: {
// 			title,
// 			price,
// 		},
// 		onSuccess: (ticket) => console.log(ticket),
// 	});

// 	const onSubmit = (event) => {
// 		event.preventDefault();

// 		doRequest();
// 	};

// 	const onBlur = () => {
// 		const value = parseFloat(price);

// 		if (isNaN(value)) {
// 			return;
// 		}

// 		setPrice(value.toFixed(2));
// 	};

// 	return (
// 		<div>
// 			<h1>Create a Ticket</h1>
// 			<form onSubmit={onSubmit}>
// 				<div className='form-group'>
// 					<label>Title</label>
// 					<input
// 						value={title}
// 						onChange={(e) => setTitle(e.target.value)}
// 						className='form-control'
// 					/>
// 				</div>
// 				<div className='form-group'>
// 					<label>Price</label>
// 					<input
// 						value={price}
// 						type='number'
// 						onBlur={onBlur}
// 						onChange={(e) => setPrice(e.target.value)}
// 						className='form-control'
// 					/>
// 				</div>
// 				{errors && (
// 					<div className='alert alert-danger'>
// 						<h4>Ooops....</h4>
// 						<ul className='my-0'>
// 							{errors.map((err) => (
// 								<li key={err.message}>{err.message}</li>
// 							))}
// 						</ul>
// 					</div>
// 				)}
// 				<button className='btn btn-primary'>Submit</button>
// 			</form>
// 		</div>
// 	);
// };

const NewTicket = () => {
	return (
		<TicketForm
			title='New Ticket'
			url='/api/tickets'
			buttonText='Submit'
		/>
	);
};

export default NewTicket;
