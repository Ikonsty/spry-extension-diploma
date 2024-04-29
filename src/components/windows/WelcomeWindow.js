import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Logo from '../../images/newLogo';
import { IoClose } from 'react-icons/io5';
import YellowButton from '../YellowButton';

const WelcomeWindow = ({ setView }) => {
	useEffect(() => {
		document.body.style.width = '472px';
		document.body.style.height = '230px';
	}, []);

	const handleClick = () => {
		chrome.tabs.create({ url: 'https://spryplan.com/login' });
	};

	return (
		<>
			<>
				<Header>
					<img src={Logo} alt='Logo' />
					<IoClose
						style={{ width: '24px', height: '24px', cursor: 'pointer' }}
						onClick={() => window.close()}
					/>
				</Header>
				<MainContainer>
					<Heading>Welcome to Spry Plan!</Heading>
					<SmallText>
						Eliminate unnecessary meetings and improve profitability
					</SmallText>
					<YellowButton onClick={handleClick}>Sign up</YellowButton>
					<LearnMore>
						<Another
							onClick={() => {
								chrome.tabs.create({ url: 'https://spryplan.com' });
							}}
						>
							Learn more
						</Another>{' '}
						about Spry Board
					</LearnMore>
				</MainContainer>
			</>
			{/* )} */}
		</>
	);
};

export default WelcomeWindow;

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
	font-size: 32px;
	line-height: 24px;
	color: #1a1a1a;
	margin-bottom: 12px;
`;

const SmallText = styled.div`
	color: #474747;
	font-family: 'Roboto';
	font-weight: 400;
	font-size: 14px;
	line-height: 20px;
	margin-bottom: 16px;
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
