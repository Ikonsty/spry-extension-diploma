import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Logo from '../../images/newLogo';
import { IoClose } from 'react-icons/io5';
import YellowButton from '../YellowButton';
import GreyButton from '../GreyButton';

const AddPeopleStart = ({ setView }) => {
	useEffect(() => {
		document.body.style.width = '472px';
		document.body.style.height = '230px';
	}, []);

	return (
		<>
			<Header>
				<img src={Logo} alt='Logo' />
				<IoClose
					style={{ width: '24px', height: '24px', cursor: 'pointer' }}
					onClick={() => window.close()}
				/>
			</Header>
			<MainContainer>
				<Heading>Add people to Spry Plan</Heading>
				<SmallText>
					We found 12 new persons in your calendar this week. Please check who
					should be added and set wages for everyone of them.
				</SmallText>
				<ButtonContainer>
					<YellowButton>Add from calendar</YellowButton>
					<GreyButton
						style={{
							width: '109px',
							height: '32px',
							fontSize: '12px',
						}}
					>
						Add manually
					</GreyButton>
				</ButtonContainer>
				<LearnMore>
					<Another
						onClick={() => {
							chrome.tabs.create({ url: 'https://spryplan.com' });
						}}
					>
						Learn more
					</Another>
					about Spry Board
				</LearnMore>
			</MainContainer>
		</>
	);
};

export default AddPeopleStart;

const Header = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin: 16px;
`;

const MainContainer = styled.div`
	margin-top: 24px;
	justify-content: center;
	align-items: center;
	display: flex;
	flex-direction: column;
`;

const Heading = styled.div`
	font-family: 'Roboto';
	font-weight: 500;
	font-size: 20px;
	line-height: 24px;
	color: #1a1a1a;
`;

const SmallText = styled.div`
	color: #474747;
	font-family: 'Roboto';
	font-weight: 400;
	font-size: 14px;
	line-height: 20px;
	margin: 16px;
	text-align: center;
`;

const LearnMore = styled.div`
	margin-top: 32px;
	color: #474747;
	font-family: 'Roboto';
	font-weight: 400;
	font-size: 12px;
	line-height: 18px;
`;

const Another = styled.span`
	text-decoration: underline;
	color: black;
	font-family: 'Roboto';
	font-weight: 500;
	font-size: 12px;
	line-height: 18px;
	cursor: pointer;
`;

const ButtonContainer = styled.div`
	display: flex;
	flex-direction: row;
	gap: 12px;
`;
