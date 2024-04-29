import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import ChooseBox from './ChooseBox';
import { SettingsContext } from './SettingsContext';

function CalendarPeopleList({ people, onPersonCheck, onInputChange }) {
	const { settings } = useContext(SettingsContext);

	return (
		<ul>
			{people.map((person) => (
				<CalendarPersonRow key={person.info.id}>
					<label>
						<ChooseBox
							checked={person.checked}
							onCheckChange={(checked) =>
								onPersonCheck(person.info.id, checked)
							}
						/>
					</label>
					<PersonInfo>
						<AvatarPlaceholder>
							<img
								src={
									person.info.avatar
										? person.info.avatar_url
										: './images/default_avatar_2.png'
								}
								alt='Avatar'
								style={{ width: '100%', height: '100%', objectFit: 'cover' }}
							/>
						</AvatarPlaceholder>
						<div>
							<PersonName className='Body2 bold'>{person.info.name}</PersonName>
							<PersonEmail className='Helper'>{person.info.email}</PersonEmail>
						</div>
					</PersonInfo>

					{person.checked && (
						<>
							<SelectField
								value={person.info.period}
								onChange={(e) =>
									onInputChange(person.info.id, 'period', e.target.value)
								}
								className='Body2 medium'
							>
								<option value=''>Choose</option>
								<option value='hourly'>Hourly</option>
								<option value='weekly'>Weekly</option>
								<option value='monthly'>Monthly</option>
								<option value='yearly'>Yearly</option>
							</SelectField>
							<InputWageContainer>
								<DollarSign
									currencySymbol={settings.currencyView === 'Euro' ? '€' : '$'}
								/>
								<InputWageField
									type='number'
									value={person.info.wage}
									onChange={(e) =>
										onInputChange(person.info.id, 'wage', e.target.value)
									}
									placeholder='Enter wage'
								/>
							</InputWageContainer>
						</>
					)}
				</CalendarPersonRow>
			))}
		</ul>
	);
}

export default CalendarPeopleList;

const AvatarPlaceholder = styled.div`
	border-radius: 9999px;
	height: 34px;
	width: 34px;
	overflow: hidden;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #edf2f7;
	margin-right: 0.75rem;
`;

const PersonInfo = styled.div`
	display: flex;
	align-items: center;
`;

const PersonName = styled.p``;

const PersonEmail = styled.p`
	font-family: 'SF Pro Display', sans-serif;
	font-size: 12px;
	color: var(--neutral-60);
`;

const CalendarPersonRow = styled.li`
	display: grid;
	grid-template-columns: 30px 274px 124px 140px;
	align-items: center;
	margin: 12px;
`;

const SelectField = styled.select`
	width: 116px;
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
	width: 112px;
`;

const DollarSign = styled.span`
	position: absolute;
	left: 8px;
	top: 50%;
	transform: translateY(-50%);
	&:before {
		content: '${(props) => props.currencySymbol}';
	}
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
