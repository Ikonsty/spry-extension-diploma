import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { IoClose } from 'react-icons/io5';
import YellowButton from '../YellowButton';
import GreyButton from '../GreyButton';
import { CgTrash } from 'react-icons/cg';
import { v4 as uuidv4 } from 'uuid';

function AddWageToAll({ emptyEmails }) {
	const [fields, setFields] = useState({});
	const [showForm, setShowForm] = useState(false);

	const openFormButton = useRef(null);

	useEffect(() => {
		console.log('add all', emptyEmails);
		const initialFields = {};
		emptyEmails.forEach((email) => {
			const id = uuidv4();
			initialFields[id] = { email: email, period: '', wage: '' };
		});
		setFields(initialFields);
	}, [emptyEmails]);

	const updateRow = (id, field, value) => {
		setFields((prevFields) => ({
			...prevFields,
			[id]: {
				...prevFields[id],
				[field]: value,
			},
		}));
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

	const closeForm = () => {
		setShowForm(false);
		// setFields({});
	};

	const handleSaveNewFields = () => {
		for (let id in fields) {
			if (
				fields[id].email === '' ||
				fields[id].period === '' ||
				fields[id].wage === ''
			) {
				alert('Please fill all the fields before adding a new one.');
				return;
			}
		}

		let updatedFields = Object.keys(fields).reduce((acc, id) => {
			const field = fields[id];
			let hourlyRate = parseFloat(field.wage);

			if (isNaN(hourlyRate)) {
				console.error('Invalid wage value:', field.wage);
				return acc;
			}

			hourlyRate =
				hourlyRate % 1 === 0 ? hourlyRate.toFixed(0) : hourlyRate.toFixed(2);
			acc[id] = { ...field, wage: hourlyRate };
			return acc;
		}, {});

		chrome.storage.local.get('fields', (result) => {
			if (chrome.runtime.lastError) {
				console.error(
					'Error fetching fields:',
					chrome.runtime.lastError.message
				);
				return;
			}

			let existingFields = result.fields || {};
			const allFields = { ...existingFields, ...updatedFields };

			chrome.storage.local.set({ fields: allFields }, () => {
				if (chrome.runtime.lastError) {
					console.error(
						'Error saving fields:',
						chrome.runtime.lastError.message
					);
				} else {
					console.log('Fields saved successfully:', allFields);
				}
			});
			closeForm();
		});
	};

	return (
		<div className='wage-input-form'>
			{emptyEmails.length > 0 ? (
				<FrontButton onClick={() => setShowForm(true)}>
					Add to Spry plan
				</FrontButton>
			) : (
				<div style={{ marginLeft: '7px' }}></div>
			)}
			{showForm ? (
				<Dialog>
					<TopRow>
						<div className='Heading3'>Add people</div>
						<button
							onClick={closeForm}
							style={{
								background: 'none',
								border: 'none',
								padding: 0,
								outline: 'none',
							}}
						>
							<IoClose className='w-6 h-6' size={18} />
						</button>
					</TopRow>
					<MidRow>
						<div>
							<Grid rowsLength={Object.keys(fields).length}>
								<Label className='Subheader2'>Email</Label>
								<Label className='Subheader2'>Period</Label>
								<Label className='Subheader2'>Wage</Label>
							</Grid>
							{Object.keys(fields).map((id) => {
								const field = fields[id];
								return (
									<Grid
										rowsLength={Object.keys(fields).length}
										key={id}
										style={{ marginBottom: '16px' }}
									>
										<InputField
											className='Body2 medium;'
											value={field.email}
											readOnly={true}
											placeholder='Enter email'
										/>
										<SelectField
											value={field.period}
											onChange={(e) => updateRow(id, 'period', e.target.value)}
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
												type='number'
												value={field.wage}
												onChange={(e) => updateRow(id, 'wage', e.target.value)}
												placeholder='Enter wage'
											/>
										</InputWageContainer>
										{Object.keys(fields).length > 1 ? (
											<CgTrash
												size={20}
												style={{ color: 'var(--neutral-70' }}
												onClick={() => removeRow(id)}
											/>
										) : (
											<></>
										)}
									</Grid>
								);
							})}
						</div>
					</MidRow>
					<BotRow>
						<GreyButton
							onClick={closeForm}
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
							onClick={handleSaveNewFields}
							style={{ width: '123px', height: '32px', borderRadius: '6px' }}
						>
							Add to Spry plan ({Object.keys(fields).length})
						</YellowButton>
					</BotRow>
				</Dialog>
			) : (
				<> </>
			)}
		</div>
	);
}

export default AddWageToAll;

const FrontButton = styled.div`
	font-size: 14px;
	margin-right: 5px;
	color: #1c73e8;
	background-color: transparent;
	border: none;
	padding: 0;
	cursor: pointer;
	outline: none;
`;

const Grid = styled.div`
	display: grid;
	grid-template-columns: ${(props) =>
		props.rowsLength > 1 ? '260px 112px 112px 20px' : '292px 112px 112px'};
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
	height: 340px;
	max-width: 90%;
	box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
	border-radius: 12px;
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
