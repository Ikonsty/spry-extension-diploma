import React from 'react';
import styled from 'styled-components';

function AddPeoplePopup({ setView }) {
	return (
		<AddDialog>
			<AddOptionButton
				className='top'
				onClick={() => setView('addPeopleManualy')}
			>
				Add manually
			</AddOptionButton>
			<AddOptionButton
				className='bottom'
				onClick={() => setView('addPeopleCalendar')}
			>
				Add from calendar
			</AddOptionButton>
		</AddDialog>
	);
}

export default AddPeoplePopup;

const AddDialog = styled.div`
	position: absolute;
	top: 20%;
	left: 60%;
	z-index: 10;
	flex: 1;
	flex-direction: column;
	border-radius: 10px;
	display: flex;
	width: 162px;
	height: 72px;
	background-color: var(--neutral-0);
	box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

const AddOptionButton = styled.button`
	height: 36px;
	padding-left: 12px;
	display: flex;
	align-items: center;
	Body2 medium;

	&.top:hover ~ ${AddDialog} {
		background: linear-gradient(to bottom, grey 50%, white 50%);
	}

	&.bottom:hover ~ ${AddDialog} {
		background: linear-gradient(to bottom, white 50%, grey 50%);
	}
`;
