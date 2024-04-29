import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import YellowButton from '../YellowButton';
import GreyButton from '../GreyButton';
import { IoClose } from 'react-icons/io5';

const EditPersonForm = ({ setView, personToEdit }) => {
	const [editedEmail, setEditedEmail] = useState(
		personToEdit ? personToEdit.email : ''
	);
	const [editedWage, setEditedWage] = useState(
		personToEdit ? personToEdit.wage : ''
	);
	const [editedType, setEditedType] = useState(
		personToEdit ? personToEdit.period : ''
	);

	useEffect(() => {
		document.body.style.width = '520px';
		document.body.style.height = '168px';
	}, []);

	useEffect(() => {
		setEditedEmail(personToEdit ? personToEdit.email : '');
		setEditedWage(personToEdit ? personToEdit.wage : '');
		setEditedType(personToEdit ? personToEdit.period : '');
	}, [personToEdit]);

	const handleSave = () => {
		const updatedPersonInfo = {
			email: editedEmail ? editedEmail : personToEdit.email,
			wage: editedWage ? editedWage : personToEdit.wage,
			period: editedType ? editedType : personToEdit.period,
		};
		console.log('PtE', personToEdit);
		const personEmail = personToEdit.email;

		chrome.storage.local.get('fields', (result) => {
			if (chrome.runtime.lastError) {
				console.error(
					'Error fetching fields:',
					chrome.runtime.lastError.message
				);
				return;
			}

			let existingFields = result.fields || {};
			console.log(existingFields);

			let personKeyToUpdate = null;
			for (const key in existingFields) {
				if (existingFields[key].email === personEmail) {
					personKeyToUpdate = key;
					break;
				}
			}

			if (personKeyToUpdate !== null) {
				existingFields[personKeyToUpdate] = updatedPersonInfo;

				chrome.storage.local.set({ fields: existingFields }, () => {
					if (chrome.runtime.lastError) {
						console.error(
							'Error updating person:',
							chrome.runtime.lastError.message
						);
						return;
					}
					console.log(`Person with email ${personEmail} updated.`);
				});
			} else {
				console.log(`No person found with email ${personEmail} to update.`);
			}
		});

		setView('main');
	};

	const onCancel = () => {
		// Reset form fields
		setEditedEmail('');
		setEditedWage('');
		setEditedType('');

		setView('main');
	};

	return (
		<EditPersonFormContainer>
			<HeaderContainer>
				<FormHeader>Edit Person</FormHeader>
				<button>
					<IoClose
						style={{ width: '24px', height: '24px' }}
						onClick={onCancel}
					/>
				</button>
			</HeaderContainer>

			<Row>
				<InputContainer style={{ marginRight: '20px' }}>
					<InputLabel class='Helper medium'>Email:</InputLabel>
					<InputField
						period='text'
						value={editedEmail}
						onChange={(e) => setEditedEmail(e.target.value)}
					/>
				</InputContainer>
				<InputContainer style={{ marginRight: '8px' }}>
					<InputLabel class='Helper medium'>Period:</InputLabel>
					<SelectField
						value={editedType}
						onChange={(e) => setEditedType(e.target.value)}
					>
						<option value='per hour'>Per Hour</option>
						<option value='per day'>Per Day</option>
						<option value='per month'>Per Month</option>
						<option value='per year'>Per Year</option>
					</SelectField>
				</InputContainer>
				<InputContainer>
					<InputLabel class='Helper medium'>Wage:</InputLabel>
					<InputFieldTwo
						period='number'
						value={editedWage}
						onChange={(e) => setEditedWage(e.target.value)}
					/>
				</InputContainer>
			</Row>

			<ButtonRow>
				<GreyButton
					style={{
						width: '65px',
						height: '32px',
					}}
					size={18}
					onClick={onCancel}
				>
					Cancel
				</GreyButton>
				<YellowButton
					style={{
						width: '73px',
					}}
					size={18}
					onClick={handleSave}
				>
					Confirm
				</YellowButton>
			</ButtonRow>
		</EditPersonFormContainer>
	);
};

export default EditPersonForm;

const EditPersonFormContainer = styled.div`
	padding: 16px;
	background-color: #fff;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const HeaderContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16px;
`;

const FormHeader = styled.h2`
	font-size: 16px;
`;

const ButtonRow = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-end;
	gap: 8px;
`;

const Row = styled.div`
	display: flex;
	justify-content: space-between;
	width: 100%;
	margin-bottom: 15px;
`;

const InputContainer = styled.div`
	flex: 1;
`;

const InputLabel = styled.label`
	display: block;
	color: var(--neutral-70);
	margin-bottom: 2px;
`;

const InputField = styled.input`
	width: 236px;
	height: 32px;
	padding: 8px;
	border: 1px solid #ccc;
	border-radius: 6px;
`;

const InputFieldTwo = styled.input`
	width: 112px;
	height: 32px;
	padding: 8px;
	border: 1px solid #ccc;
	border-radius: 6px;
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
