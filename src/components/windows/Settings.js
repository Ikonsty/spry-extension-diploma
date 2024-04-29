import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import CrossSign from '../../../dist/images/close.svg';
import GreyButton from '../GreyButton';
import DownloadIcon from '../../images_components/DownloadIconImage';
import YellowButton from '../YellowButton';
import { SettingsContext } from '../SettingsContext';
import { useAuth } from '../technical/useAuth';

const Settings = ({ setView }) => {
	const { settings, setSettings } = useContext(SettingsContext);
	const [costView, setCostView] = useState(settings.costView);
	const [currencyView, setCurrencyView] = useState(settings.currencyView);

	const { logout } = useAuth();

	useEffect(() => {
		document.body.style.width = '380px';
		document.body.style.height = '246px';
	}, []);

	const handleCostViewChange = (event) => {
		setCostView(event.target.value);
	};

	const handleCurrencyViewChange = (event) => {
		setCurrencyView(event.target.value);
	};

	const handleClose = () => {
		setView('main');
	};

	const handleSave = () => {
		setSettings({ costView, currencyView });
		setView('main');
	};

	const Logout = () => {
		logout();
		setView('main');
	};

	return (
		<Dialog>
			<Header>
				<SettingsText>Settings</SettingsText>
				<CrossIcon src={CrossSign} onClick={handleClose} />
			</Header>
			<MainContainer>
				<SelectContainer>
					<Label>Cost view in table</Label>
					<Select value={costView} onChange={handleCostViewChange}>
						<option value='Cost per hour'>Cost per hour</option>
						<option value='Cost per month'>Cost per month</option>
						<option value='Cost per year'>Cost per year</option>
					</Select>
				</SelectContainer>
				<SelectContainer>
					<Label>Currency</Label>
					<Select value={currencyView} onChange={handleCurrencyViewChange}>
						<option value='U.S. dollar'>U.S. dollar</option>
						<option value='Euro'>Euro</option>
					</Select>
				</SelectContainer>
			</MainContainer>
			<Footer>
				<TextFooter>
					<Another
						onClick={() => {
							chrome.tabs.create({ url: 'https://spryplan.com' });
						}}
					>
						Learn more
					</Another>{' '}
					about Spry Board
				</TextFooter>
				<GreyButton
					style={{
						width: '62px',
						height: '32px',
						marginRight: '8px',
						marginLeft: '50px',
						marginBottom: '16px',
					}}
					onClick={handleClose}
				>
					Cancel
				</GreyButton>
				<YellowButton
					style={{
						width: '65px !important',
						height: '32px',
						marginBottom: '16px',
					}}
					onClick={handleSave}
				>
					Save
				</YellowButton>
			</Footer>
		</Dialog>
	);
};

const Dialog = styled.div`
	display: flex;
	flex-direction: column;
`;

const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16px;
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

const MainContainer = styled.div`
	display: flex;
	width: 348px;
	justify-content: space-between;
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

const SettingsText = styled.h3`
	font-size: 16px;
	font-weight: 600;
`;

const CrossIcon = styled.img`
	cursor: pointer;
	width: 20px;
	height: 20px;
`;

const Label = styled.label`
	font-family: 'SFProDisplay-medium', sans-serif;
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
	margin-top: 94px;
	display: flex;
`;

const TextFooter = styled.span`
	font-weight: 500;
	font-size: 12px;
	font-family: 'SFProDisplay-medium', sans-serif;
	margin-left: 16px;
	color: #474747;
	width: 163px;
	margin-top: 16px;
`;

export default Settings;
