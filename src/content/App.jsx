import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './content.css';
import GoogleCalendarExtension from '../components/extensions/GoogleCalendarExtension';
import GoogleGmailExtension from '../components/extensions/GoogleGmailExtension';
import { createGlobalStyle } from 'styled-components';
import { useAuth } from '../components/technical/useAuth';

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
	const { user } = useAuth();
	const isCalendarPage = window.location.href.includes(
		'https://calendar.google.com/calendar/'
	);
	const isGmailPage = window.location.href.includes(
		'https://mail.google.com/mail/'
	);

	return (
		<>
			<GlobalStyle />
			<div>
				{user && (
					<>
						{isCalendarPage && (
							<>
								<GoogleCalendarExtension />
							</>
						)}

						{isGmailPage && (
							<>
								<GoogleGmailExtension />
							</>
						)}
					</>
				)}
			</div>
		</>
	);
}

export default App;
