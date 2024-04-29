import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

function DomainPopup({ onClose, onAddFields, accessToken }) {
	const popupRef = useRef(null);
	const [domain, setDomain] = useState('');

	const getEmails = () => {
		const calendarId = 'primary';
		const timeMin = new Date(
			new Date().getTime() - 30 * 24 * 60 * 60 * 1000
		).toISOString(); // Last 30 days

		const apiUrl =
			`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events` +
			`?timeMin=${timeMin}&access_token=${accessToken}`;
		console.log(accessToken);
		axios
			.get(apiUrl)
			.then((response) => {
				const events = response.data.items;
				const filteredEmails = [];

				events.forEach((event) => {
					const attendees = event.attendees;
					if (attendees) {
						attendees.forEach((attendee) => {
							const email = attendee.email;
							if (email.endsWith(`${domain}`)) {
								filteredEmails.push({ email: email, wage: '', type: '' });
							}
						});
					}
				});

				onAddFields(filteredEmails);

				onClose();
			})
			.catch((error) => {
				console.error('Error fetching events:', error);
			});
	};

	const handleOutsideClick = (event) => {
		if (popupRef.current && !popupRef.current.contains(event.target)) {
			onClose();
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleOutsideClick);

		// Remove event listener when the component unmounts
		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, []);

	return (
		<div
			className='flex flex-col bg-white py-1 px-2 rounded-lg max-w-md w-[280px] h-[100px] text-center
            border-gray-600 border shadow-lg	'
			ref={popupRef}
		>
			<div className='flex justify-start mb-2'>
				<InfoText>Detect by @name</InfoText>
			</div>
			<div className='flex justify-start flex-grow'>
				<input
					type='email'
					name='email'
					value={domain}
					onChange={(event) => setDomain(event.target.value)}
					className='rounded-xl text-gray-500 text-base bg-[#E3D6E7] focus:ring
											w-[220px] h-6 outline-0 px-2 transition ease-out duration-300'
				/>
			</div>
			<div className='flex justify-end'>
				<NavButton onClick={getEmails}>Detect</NavButton>
			</div>
		</div>
	);
}

export default DomainPopup;

const NavButton = styled.button`
	color: #d13ecb;
	font-weight: 700;
	font-size: 1rem;
	line-height: 1.5rem;
	border-radius: 1rem;
	padding-left: 0.5rem;
	padding-right: 0.5rem;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	border: none;
	background-color: transparent;
	transition: ease-out 300ms;
	cursor: pointer;

	&:hover {
		background-color: #e3d6e7;
	}
`;

const InfoText = styled.h3`
	border-bottom-width: 1px;
	text-align: left;
	color: #727272;
	font-weight: 700;
	font-size: 1rem;
	line-height: 1.5rem;
`;
