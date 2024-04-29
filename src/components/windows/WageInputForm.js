import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { IoClose } from 'react-icons/io5';
import YellowButton from '../YellowButton';
import GreyButton from '../GreyButton';
import { v4 as uuidv4 } from 'uuid';

function WageInputForm({ lastEmail, increaseCost, spentTime, setEmptyEmails }) {
	const [showForm, setShowForm] = useState(false);
	const [field, setField] = useState({
		email: lastEmail,
		period: '',
		wage: '',
	});
	const [added, setAdded] = useState(false);
	const [price, setPrice] = useState(0);

	const openFormButton = useRef(null);

	const updateRow = (field, value) => {
		setField((prevField) => ({
			...prevField,
			[field]: value,
		}));
	};

	const openForm = () => {
		setShowForm(true);
	};

	const handleOutsideClick = (e) => {
		const formContainer = document.querySelector('.centered-form');
		if (formContainer === e.target && e.target !== openFormButton) {
			setShowForm(false);
		}
	};

	useEffect(() => {
		if (showForm) {
			document.addEventListener('click', handleOutsideClick);
		} else {
			document.removeEventListener('click', handleOutsideClick);
		}

		// Cleanup the event listener when the component unmounts.
		return () => {
			document.removeEventListener('click', handleOutsideClick);
		};
	}, [showForm]);

	const handleSaveNewField = () => {
		if (field.email === '' || field.period === '' || field.wage === '') {
			alert('Please fill all the fields before adding a new one.');
			return;
		}

		let rate = parseFloat(field.wage);

		if (isNaN(rate)) {
			console.error('Invalid wage value:', field.wage);
			return;
		}

		let hourlyRate;
		switch (field.period) {
			case 'hourly':
				hourlyRate = rate;
				break;
			case 'weekly':
				hourlyRate = rate / 40;
				break;
			case 'monthly':
				hourlyRate = rate / 160;
				break;
			case 'yearly':
				hourlyRate = rate / 1920;
				break;
		}

		// hourlyRate =
		// 	hourlyRate % 1 === 0 ? hourlyRate.toFixed(0) : hourlyRate.toFixed(2);

		increaseCost(hourlyRate);
		console.log(spentTime);
		console.log(hourlyRate);
		setPrice((hourlyRate * spentTime) / 60);

		// const id = uuidv4();
		let updatedField = {
			[uuidv4()]: { email: field.email, period: field.period, wage: rate },
		};

		chrome.storage.local.get('fields', (result) => {
			if (chrome.runtime.lastError) {
				console.error(
					'Error fetching fields:',
					chrome.runtime.lastError.message
				);
				return;
			}

			let existingFields = result.fields || {};
			const allFields = { ...existingFields, ...updatedField };

			chrome.storage.local.set({ fields: allFields }, () => {
				if (chrome.runtime.lastError) {
					console.error(
						'Error saving fields:',
						chrome.runtime.lastError.message
					);
				} else {
					console.log('Fields saved successfully:', allFields);
					setEmptyEmails((prevEmails) =>
						prevEmails.filter((email) => email !== field.email)
					);
				}
			});
			setShowForm(false);
		});

		setField({});
		setAdded(true);
	};

	return (
		<div className='wage-input-form'>
			{added ? (
				<div style={{ marginLeft: '7px' }}>${price.toFixed(2)}</div>
			) : (
				<button
					onClick={openForm}
					ref={openFormButton}
					style={{ background: 'none', border: 'none', padding: 0 }}
				>
					<svg
						width='23'
						height='22'
						viewBox='0 0 23 22'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<rect x='0.5' width='22' height='22' rx='4' fill='#F0F0F2' />
						<path
							d='M10.9175 11.6663H7.58415C7.39526 11.6663 7.23692 11.6025 7.10915 11.4747C6.98137 11.3469 6.91748 11.1886 6.91748 10.9997C6.91748 10.8108 6.98137 10.6525 7.10915 10.5247C7.23692 10.3969 7.39526 10.333 7.58415 10.333H10.9175V6.99967C10.9175 6.81079 10.9814 6.65245 11.1091 6.52467C11.2369 6.3969 11.3953 6.33301 11.5841 6.33301C11.773 6.33301 11.9314 6.3969 12.0591 6.52467C12.1869 6.65245 12.2508 6.81079 12.2508 6.99967V10.333H15.5841C15.773 10.333 15.9314 10.3969 16.0591 10.5247C16.1869 10.6525 16.2508 10.8108 16.2508 10.9997C16.2508 11.1886 16.1869 11.3469 16.0591 11.4747C15.9314 11.6025 15.773 11.6663 15.5841 11.6663H12.2508V14.9997C12.2508 15.1886 12.1869 15.3469 12.0591 15.4747C11.9314 15.6025 11.773 15.6663 11.5841 15.6663C11.3953 15.6663 11.2369 15.6025 11.1091 15.4747C10.9814 15.3469 10.9175 15.1886 10.9175 14.9997V11.6663Z'
							fill='#1A1A1A'
						/>
					</svg>
				</button>
			)}
			{showForm ? (
				<>
					<Overlay />
					<Dialog className='centered-form'>
						<TopRow>
							<div className='Heading3'>Add people</div>
							<button
								onClick={() => setShowForm(false)}
								style={{ background: 'none', border: 'none' }}
							>
								<IoClose
									style={{
										width: '24px',
										height: '24px',
									}}
								/>
							</button>
						</TopRow>
						<MidRow>
							<div>
								<Grid>
									<Label className='Subheader2'>Email</Label>
									<Label className='Subheader2'>Period</Label>
									<Label className='Subheader2'>Wage</Label>
								</Grid>
								<Grid>
									<InputField
										className='Body2 medium;'
										value={field.email}
										readOnly={true}
										placeholder='Enter email'
									/>
									<SelectField
										value={field.period}
										onChange={(e) => updateRow('period', e.target.value)}
										className='Body2 medium'
									>
										<option value=''>Choose</option>
										<option value='hourly'>Hourly</option>
										<option value='weekly'>Weekly</option>
										<option value='monthly'>Monthly</option>
										<option value='yearly'>Yearly</option>
									</SelectField>
									<InputWageContainer>
										<DollarSign>$</DollarSign>
										<InputWageField
											period='number'
											value={field.wage}
											onChange={(e) => updateRow('wage', e.target.value)}
											placeholder='Enter wage'
										/>
									</InputWageContainer>
								</Grid>
							</div>
						</MidRow>
						<BotRow>
							<GreyButton
								onClick={() => setShowForm(false)}
								style={{
									width: '65px',
									height: '32px',
									borderRadius: '6px',
									marginRight: '8px',
								}}
							>
								Cancel
							</GreyButton>
							<YellowButton
								onClick={handleSaveNewField}
								style={{ width: '123px', height: '32px', borderRadius: '6px' }}
							>
								Add to Spry plan
							</YellowButton>
						</BotRow>
					</Dialog>
				</>
			) : (
				<></>
			)}
		</div>
	);
}

export default WageInputForm;

const Grid = styled.div`
	display: grid;
	grid-template-columns: 292px 112px 112px;
	gap: 12px;
	align-items: center;
`;

const InputField = styled.input`
	height: 32px;
	flex: 1;
	border: 1px solid var(--neutral-40);
	border-radius: 6px;
	padding: 0px 8px;
	color: var(--neutral-80);
	outline: none;
`;

const SelectField = styled.select`
	width: 100%;
	height: 32px;
	flex: 1;
	border: 1px solid var(--neutral-40);
	border-radius: 6px;
	padding: 0px 8px;
	color: var(--neutral-80);
	outline: none;
	align-items: center;
	background-color: var(--neutral-20);
`;

const InputWageContainer = styled.div`
	position: relative;
	width: 100%;
`;

const DollarSign = styled.span`
	position: absolute;
	left: 8px; /* Adjust the position of the dollar sign as needed */
	top: 50%;
	transform: translateY(-50%);
`;

const InputWageField = styled.input`
	width: 100%;
	height: 32px;
	padding-left: 18px;
	padding-right: 8px;
	border: 1px solid var(--neutral-40);
	border-radius: 6px;
	outline: none;
`;

const Dialog = styled.div`
	background-color: var(--neutral-0);
	padding: 16px;
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 21;
	width: 572px;
	height: 170px;
	max-width: 90%;
	box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
	border-radius: 12px;
`;

const Overlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 20;
`;

const TopRow = styled.div`
	display: flex;
	justify-content: space-between;
	width: 100%;
	margin-bottom: 16px;
`;

const MidRow = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: 100%;
	margin-bottom: 16px;
`;

const BotRow = styled.div`
	display: flex;
	justify-content: flex-end;
	width: 100%;
	padding-bottom: 16px;
`;

const Label = styled.label`
	display: block;
	margin-bottom: 5px;
	color: var(--neutral-60);
`;
