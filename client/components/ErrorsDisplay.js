const ErrorsDisplay = ({ errors, field }) => {
	const fieldErrors = (errors || []).filter((err) => err.field === field);

	if (fieldErrors.length === 0) {
		return null;
	}

	return (
		<>
			{fieldErrors.map((err) => (
				<div key={err.message} className='alert alert-danger'>
					{err.message}
				</div>
			))}
		</>
	);
};

export default ErrorsDisplay;
