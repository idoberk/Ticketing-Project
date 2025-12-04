import ErrorsDisplay from './ErrorsDisplay';

const FormInput = ({
	label,
	type = 'text',
	value,
	onChange,
	errors,
	field,
}) => {
	return (
		<div className='form-group'>
			<label>{label}</label>
			<input
				type={type}
				value={value}
				onChange={onChange}
				className='form-control'
			/>
			<ErrorsDisplay errors={errors} field={field} />
		</div>
	);
};

export default FormInput;
