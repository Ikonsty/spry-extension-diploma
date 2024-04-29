import { useState, useEffect } from 'react';
import React from 'react';

// import DomainPopup from './DomainPopup';
// import RemoveRow from '../RemoveRow';
import { IoClose } from 'react-icons/io5';
import { BsPlus } from 'react-icons/bs';
import Logo from '../../images/newLogo.svg';
import YellowButton from '../YellowButton';
import Search from '../Search';
import GreyButton from '../GreyButton';
import PeopleList from '../PeopleList';
import AddPeoplePopup from './AddPeoplePopup';
import styled from 'styled-components';
import SettingsIcon from '../../images_components/SettingsIcon';
import ThreeDotsIcon from '../../images_components/ThreeDotsIcon';
import ThreeDotsImage from '../../images/three_dots';
import SettingsProfileChoicePopup from './SettingsProfileChoicePopup';

const CLIENT_ID = encodeURIComponent(process.env.CLIENT_ID);
const REDIRECT_URI = encodeURIComponent(process.env.REDIRECT_URI);
const STATE = encodeURIComponent(process.env.STATE);

function create_oauth2_url() {
	let url = `https://accounts.google.com/o/oauth2/v2/auth
	?client_id=${CLIENT_ID}
	&redirect_uri=${REDIRECT_URI}
	&response_type=token
	&scope=https://www.googleapis.com/auth/calendar+https://www.googleapis.com/auth/calendar.events+openid+https://www.googleapis.com/auth/userinfo.email
	&include_granted_scopes=true
	&state=${STATE}
	&prompt=consent
	`;

	return url;
}

function MainPopup({ setView, setPerson }) {
	const [fields, setFields] = useState({});
	const [isLogged, setIsLogged] = useState(false);
	const [accessToken, setAccessToken] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [showAddPeoplePopup, setShowAddPeoplePopup] = useState(false);
	const [editPersonId, setEditPersonId] = useState(null);
	const [showPopup, setShowPopup] = useState(false);

	useEffect(() => {
		document.body.style.width = '472px';
		document.body.style.height = '464px';

		chrome.storage.local.get('fields', (result) => {
			if (chrome.runtime.lastError) {
				console.error(chrome.runtime.lastError.message);
				return;
			}

			if (result.fields) {
				setFields(result.fields);
			}
		});
	}, []);

	useEffect(() => {
		chrome.storage.local.get('token', (result) => {
			if (chrome.runtime.lastError) {
				console.error(chrome.runtime.lastError.message);
				return;
			}

			if (result.token) {
				setAccessToken(result.token);
				setIsLogged(true);
			}
		});
	}, []);

	const handleSearchChange = (query) => {
		setSearchQuery(query);
	};

	const startEditing = (person) => {
		setEditPersonId(person);
	};

	const handleSettingsClick = () => {
		setView('Settings');
	};

	const handleThreeDotsClick = () => {};

	return (
		<Dialog>
			<FlexContainer>
				<button>
					<img
						src={Logo}
						alt='Upload CSV'
						style={{ width: '28px', height: '28px' }}
					/>
				</button>
				<div
					style={{ display: 'flex', flexDirection: 'row-reverse', gap: '8px' }}
				>
					<IoClose
						style={{ width: '24px', height: '24px', cursor: 'pointer' }}
						onClick={() => window.close()}
					/>
					<img
						src={ThreeDotsImage}
						style={{
							width: '20px',
							height: '20px',
							marginTop: '2px',
							cursor: 'pointer',
						}}
						onClick={() => setShowPopup(!showPopup)}
					/>
					{showPopup && <SettingsProfileChoicePopup setView={setView} />}
				</div>
			</FlexContainer>

			<FlexMainContainer>
				<Search onSearchChange={handleSearchChange} />
				<div style={{ display: 'flex', flexDirection: 'row' }}>
					<YellowButton
						Icon={BsPlus}
						size={18}
						onClick={() => setShowAddPeoplePopup(!showAddPeoplePopup)}
					>
						Add people
					</YellowButton>
					{showAddPeoplePopup && <AddPeoplePopup setView={setView} />}
				</div>
			</FlexMainContainer>

			<div style={{ overflow: 'auto', width: '100%', height: '100%' }}>
				<PeopleList
					fields={fields}
					searchQuery={searchQuery}
					onEdit={startEditing}
					setView={setView}
					setPerson={setPerson}
				/>
			</div>
		</Dialog>
	);
}

export default MainPopup;

const Dialog = styled.div`
	background-color: var(--neutral-0);
	padding: 16px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const FlexContainer = styled.div`
	display: flex;
	justify-content: space-between;
	width: 100%;
	margin-bottom: 12px;
`;

const FlexMainContainer = styled.div`
	display: flex;
	width: 100%;
	justify-content: space-between;
	margin-bottom: 12px;
`;
