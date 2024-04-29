import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import '../../popup/fonts.css';
import CrossSign from '../../../dist/images/close.svg';
import GreyButton from '../GreyButton';
import { useAuth } from '../technical/useAuth';
import { useUser } from '../technical/useUser';
import { jwtDecode } from 'jwt-decode';
import ThreeDotsImage from '../../images/three_dots';
import YellowButton from '../YellowButton';
import BlackStars from '../../images/black_stars';
import SignOutDeleteAccountPopup from './SignOutDeleteAccountPopup';

const Profile = ({ setView }) => {
	const { user } = useUser();
	const [showPopup, setShowPopup] = useState(false);

	const { logout } = useAuth();

	useEffect(() => {
		document.body.style.width = '380px';
		document.body.style.height = '246px';
	}, []);

	const handleClose = () => {
		setView('main');
	};

	let userEmail;
	try {
		userEmail =
			user && user.idToken
				? jwtDecode(user.idToken).email
				: 'No email available';
	} catch (error) {
		userEmail = 'Invalid token';
	}

	return (
		<Dialog>
			<Header>
				<ProfileText>Profile</ProfileText>
				<CrossIcon src={CrossSign} onClick={handleClose} />
			</Header>
			<MainContainer>
				<FirstContainer>
					<TextContainer>
						<ThinText>Your email</ThinText>
						<Text>{userEmail}</Text>
					</TextContainer>
					<img
						alt='three dots'
						src={ThreeDotsImage}
						style={{
							marginTop: '2px',
							cursor: 'pointer',
						}}
						onClick={() => setShowPopup(!showPopup)}
					/>
					{showPopup && <SignOutDeleteAccountPopup setView={setView} />}
				</FirstContainer>
				<PlanContainer>
					<TextContainer>
						<ThinText>Current plan</ThinText>
						<Text>Starter</Text>
					</TextContainer>
					<YellowButton>
						<img
							style={{ marginRight: '11px' }}
							src={BlackStars}
							alt='black stars'
						/>
						Upgrade
					</YellowButton>
				</PlanContainer>
			</MainContainer>
			<Footer>
				<TextFooter>
					<span
						onClick={() => {
							chrome.tabs.create({ url: 'https://spryplan.com' });
						}}
						style={{
							font: "'SFProDisplay-medium' 500 12px 18px",
							color: 'black',
							cursor: 'pointer',
						}}
					>
						Learn more
					</span>{' '}
					about Spry Board
				</TextFooter>
				<GreyButton
					style={{
						width: '62px',
						height: '32px',
					}}
					onClick={handleClose}
				>
					Done
				</GreyButton>
			</Footer>
		</Dialog>
	);
};

const Dialog = styled.div`
	display: flex;
	flex-direction: column;
`;

const FirstContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	width: 348px;
	padding-bottom: 16px;
	border-bottom: 1px solid #f0f0f2;
`;

const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16px;
	cursor: pointer;
`;

const SpecialText = styled.div`
	font-family: 'Roboto', serif;
	font-weight: 500;
	font-size: 12px;
	line-height: 18px;
`;

const PlanContainer = styled.div`
	width: 348px;
	padding-bottom: 16px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin-top: 16px;
	border-bottom: 1px solid #f0f0f2;
`;

const MainContainer = styled.div`
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	padding: 16px;
	padding-top: 0;
`;

const SelectContainer = styled.div`
	display: flex;
	flex-direction: column;
	margin-right: 16px;
	&:last-child {
		margin-right: 0;
	}
`;

const TextContainer = styled.div`
	display: flex;
	flex-direction: column;
`;

const ProfileText = styled.h3`
	font-size: 16px;
	font-weight: 600;
	font-family: 'Roboto';
`;

const CrossIcon = styled.img`
	cursor: pointer;
	width: 20px;
	height: 20px;
`;

const Label = styled.label`
	font-family: 'Roboto', serif;
	font-size: 12px;
	margin-bottom: 2px;
	width: 104px;
	height: 18px;
	font-weight: 500;
`;

const Select = styled.select`
	font-size: 14px;
	padding-top: 5px;
	padding-bottom: 6px;
	padding-left: 8px;
	padding-right: 32px;
	border-radius: 6px;
	border: 1px solid #cacacc;
	width: 170px;
	height: 32px;
`;

const TextAddPeople = styled.span`
	width: 119px;
	height: 18px;
	font-weight: 500;
	font-size: 12px;
	font-family: 'SFProDisplay-medium', sans-serif;
	margin-top: 16px;
	margin-left: 16px;
`;

const Footer = styled.div`
	display: flex;
	padding: 16px;
	margin-top: 24px;
	justify-content: space-between;
`;

const TextFooter = styled.span`
	font-weight: 500;
	margin-top: 20px;
	font-size: 12px;
	font-family: 'Roboto', sans-serif;
	color: #474747;
`;

const ThinText = styled.div`
	font-family: 'Roboto', serif;
	font-weight: 500;
	font-size: 12px;
	line-height: 18px;
	color: #737373;
`;

const Text = styled.div`
	font-family: 'Roboto', serif;
	font-weight: 500;
	font-size: 14px;
	line-height: 20px;
	color: #1a1a1a;
`;

export default Profile;
