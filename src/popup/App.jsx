import React, { useState, useContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../main.css';
import './fonts.css';

import { createGlobalStyle } from 'styled-components';
import MainPopup from '../components/windows/MainPopup';
import AddPeopleManualy from '../components/windows/AddPeopleManualy';
import AddPeopleCalendar from '../components/windows/AddPeopleCalendar';
import EditPersonForm from '../components/windows/EditPerson';
import Settings from '../components/windows/Settings';
import Profile from '../components/windows/Profile';
import { SettingsProvider } from '../components/SettingsContext';
import AuthProvider from '../components/technical/AuthContext';
import { useAuth } from '../components/technical/useAuth';
import WelcomeWindow from '../components/windows/WelcomeWindow';
import DeleteAccountWindow from '../components/windows/DeleteAccountWindow';

const GlobalStyle = createGlobalStyle`
	:root {
		--neutral-80: #1A1A1A;
		--neutral-70: #474747;
		--neutral-60: #737373;
		--neutral-50: #919191;
		--neutral-40: #CACACC;
		--neutral-30: #E3E3E5;
		--neutral-20: #F0F0F2;
		--neutral-10: #FBFBFD;
		--neutral-0: #FFFFFF;
		--yellow-20: #FEEEC8;
		--yellow-30: #FADD8D;
		--yellow-40: #FFD86E;
		--yellow-50: #FFCF40;
		--yellow-55: #F3C332;
		--yellow-60: #DBA91F;
		--yellow-65: #C59511;
		--green-20: #B0FAC9;
		--red-20: #FFCFD9;
		--blue-20: #D7E6FE;
	}
	
	.Heading0 {
		font-family: 'SFProDisplay-bold', sans-serif;
		font-size: 32px;
		font-weight: bold;
	}

	.Heading1 {
		font-family: 'SFProDisplay-bold', sans-serif;
		font-size: 24px;
		font-weight: bold;
	}

	.Heading2 {
		font-family: 'SFProDisplay-bold', sans-serif;
		font-size: 20px;
		font-weight: bold;
	}

	.Heading3 {
		font-family: 'SFProDisplay-bold', sans-serif;
		font-size: 16px;
		font-weight: bold;
	}

	.Subheader1 {
		font-family: 'SFProDisplay-medium', sans-serif;
		font-size: 14px;
		font-weight: medium;
	}

	.Subheader2 {
		font-family: 'SFProDisplay-medium', sans-serif;
		font-size: 12px;
		font-weight: medium;
	}

	.Body1 {
		font-family: 'SFProDisplay-medium', sans-serif;
		font-size: 16px;
		font-weight: normal;
	}

	.Body1.medium {
		font-weight: medium;
	}

	.Body1.bold {
		font-weight: bold;
	}

	.Body2 {
		font-family: 'SFProDisplay-normal', sans-serif;
		font-size: 14px;
		font-weight: normal;
	}

	.Body2.medium {
		font-family: 'SFProDisplay-medium', sans-serif;
		font-weight: medium;
	}

	.Body2.bold {
		font-family: 'SFProDisplay-bold', sans-serif;
		font-weight: bold;
	}

	.Helper {
		font-family: 'SFProDisplay-medium', sans-serif;
		font-size: 12px;
	}

	.Helper.medium {
		font-family: 'SFProDisplay-medium', sans-serif;
		font-size: 12px;
		font-weight: medium;
	}
`;

function App() {
	const [view, setView] = useState('main');
	const [person, setPerson] = useState('');

	const { user } = useAuth();

	return (
		<SettingsProvider>
			<>
				<GlobalStyle />
				{!user ? (
					<>{<WelcomeWindow setView={setView} />}</>
				) : (
					<>
						{view === 'main' && (
							<MainPopup
								setView={setView}
								setPerson={setPerson}
								personToEdit={person}
							/>
						)}
						{view === 'addPeopleManualy' && (
							<AddPeopleManualy setView={setView} />
						)}
						{view === 'addPeopleCalendar' && (
							<AddPeopleCalendar setView={setView} />
						)}
						{view === 'EditPersonForm' && (
							<EditPersonForm setView={setView} personToEdit={person} />
						)}
						{view === 'Settings' && <Settings setView={setView} />}
						{view === 'Profile' && <Profile setView={setView} />}
						{view === 'DeleteAccountWindow' && (
							<DeleteAccountWindow setView={setView} />
						)}
					</>
				)}
			</>
		</SettingsProvider>
	);
}

ReactDOM.render(
	<React.StrictMode>
		<AuthProvider>
			<App />
		</AuthProvider>
	</React.StrictMode>,

	document.getElementById('root')
);

export default App;
