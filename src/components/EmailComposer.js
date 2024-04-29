import React from 'react';
import styled from 'styled-components';

function EmailComposer({ emails }) {
	const getActiveU = () => {
		const currentUrl = window.location.pathname;
		const pattern = /u\/\d+/;
		const match = currentUrl.match(pattern);

		if (match) {
			const user = match[0];
			return user;
		}
		return null;
	};

	const handleComposeEmail = () => {
		const activeUser = getActiveU();
		const url = `https://mail.google.com/mail/${activeUser}/?view=cm&fs=1&to=${emails}`;

		window.open(url, '_blank');
	};

	return (
		<div>
			<GoogleButton onClick={handleComposeEmail}>
				Send an email instead
			</GoogleButton>
		</div>
	);
}

export default EmailComposer;

const GoogleButton = styled.button`
	background-color: #1a73e8;
	color: white;
	border: none;
	padding: 10px 20px;
	font-size: 14px;
	border-radius: 4px;
	cursor: pointer;
	transition: opacity 0.1s ease-in-out;
	transition-delay: 0s;
	opacity: 100%;
	font-family: 'Google Sans', Roboto, Arial, sans-serif;
	font-weight: 500;

	&:hover {
		opacity: 85%;
	}
`;
