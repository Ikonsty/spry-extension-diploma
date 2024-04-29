import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { IoClose } from 'react-icons/io5';
import YellowButton from '../YellowButton';
import GreyButton from '../GreyButton';
import ChooseBox from '../ChooseBox';
import SearchIcon from '../../../dist/images/search';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '../technical/useUser';
import axios from 'axios';
import CalendarPeopleList from '../CalendarPeopleList';

function AddPeopleCalendar({ setView }) {
	const [people, setPeople] = useState([]);
	// people = {info: {info}, checked: false}
	const [searchQuery, setSearchQuery] = useState('');

	const { user } = useUser();
	console.log(user);

	useEffect(() => {
		// Fetch initial data when component mounts
		fetchPeople();
	}, []);

	const handleSearchInputChange = (event) => {
		setSearchQuery(event.target.value);
	};

	const filteredPeople = Array.from(
		new Set(
			people
				.filter((person) => {
					if (searchQuery === '') {
						return true; // Return all people if searchQuery is an empty string
					} else {
						const lowerCaseQuery = searchQuery.toLowerCase();
						const emailIncludesQuery = person.info.email
							.toLowerCase()
							.includes(lowerCaseQuery);
						return emailIncludesQuery;
					}
				})
				.map((person) => person.info.email)
		)
	).map((email) => people.find((person) => person.info.email === email));

	const fetchPeople = async () => {
		const calendarId = 'primary';
		const timeMin = new Date(
			new Date().getTime() - 30 * 24 * 60 * 60 * 1000
		).toISOString(); // Last 30 days

		try {
			// Check if the access token has expired
			const currentTime = Date.now();
			if (user.accessTokenExpires && currentTime >= user.accessTokenExpires) {
				// Access token has expired, use the refresh token to obtain a new one
				const refreshToken = user.refreshToken;
				const response = await axios.post(
					'https://oauth2.googleapis.com/token',
					{
						grant_type: 'refresh_token',
						client_id: process.env.CLIENT_ID,
						client_secret: process.env.CLIENT_SECRET,
						refresh_token: refreshToken,
					}
				);

				const newAccessToken = response.data.access_token;
				const expiresIn = response.data.expires_in;

				// Update the user object with the new access token and expiration time
				user.accessToken = newAccessToken;
				user.accessTokenExpires = currentTime + expiresIn * 1000;

				// Save the updated user object to Chrome storage or your preferred storage mechanism
				chrome.storage.local.set({ user });
			}

			const apiUrl =
				`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events` +
				`?timeMin=${timeMin}&access_token=${user.accessToken}`;

			const response = await axios.get(apiUrl);
			const events = response.data.items;
			const uniqueEmails = new Set();

			// Retrieve existing fields data from Chrome storage
			const existingFields = await new Promise((resolve) => {
				chrome.storage.local.get('fields', (result) => {
					resolve(result.fields || {});
				});
			});

			const filteredEmails = events.flatMap((event) =>
				event.attendees
					? event.attendees
							.filter((attendee) => {
								if (
									!uniqueEmails.has(attendee.email) &&
									!Object.values(existingFields).some(
										(field) => field.email === attendee.email
									)
								) {
									uniqueEmails.add(attendee.email);
									return true;
								}
								return false;
							})
							.map((attendee) => ({
								info: {
									email: attendee.email,
									wage: '',
									period: '',
									id: uuidv4(),
								},
								checked: false,
							}))
					: []
			);
			setPeople(filteredEmails);
		} catch (error) {
			console.error('Error fetching events:', error);
		}
	};

	useEffect(() => {
		document.body.style.width = '600px';
	}, []);

	const handleInputChange = (personId, inputName, inputValue) => {
		setPeople((prevPeople) =>
			prevPeople.map((person) => {
				if (person.info.id === personId) {
					return {
						...person,
						info: {
							...person.info,
							[inputName]: inputValue,
						},
					};
				}
				return person;
			})
		);
	};

	const handleAddNewPeople = () => {
		const addedPersonData = people
			.filter((person) => person.checked)
			.map((person) => {
				if (person.info.wage && person.info.period) {
					let hourlyRate = parseFloat(person.info.wage);
					switch (person.info.period) {
						case 'weekly':
							hourlyRate /= 40;
							break;
						case 'monthly':
							hourlyRate /= 160;
							break;
						case 'yearly':
							hourlyRate /= 1920;
							break;
						default:
							break;
					}

					hourlyRate =
						hourlyRate % 1 === 0
							? hourlyRate.toFixed(0)
							: hourlyRate.toFixed(2);

					return {
						email: person.info.email,
						id: person.info.id,
						period: 'hourly',
						wage: hourlyRate,
					};
				}
				return null;
			})
			.filter((person) => person !== null);

		chrome.storage.local.get('fields', (result) => {
			let currentFields = result.fields || {};

			if (Array.isArray(currentFields)) {
				currentFields = currentFields.reduce((acc, field) => {
					acc[field.id] = field;
					return acc;
				}, {});
			}
			addedPersonData.forEach((person) => {
				currentFields[person.id] = person;
			});

			console.log(currentFields);

			chrome.storage.local.set({ fields: currentFields }, () => {
				if (chrome.runtime.lastError) {
					console.error(chrome.runtime.lastError.message);
				}
			});
		});

		setView('main');
	};

	const handleMainCheckboxChange = () => {
		const newPeople = people.map((person) => ({
			...person,
			checked: !allChecked,
		}));
		setPeople(newPeople);
	};

	const handlePersonCheck = (personId, checked) => {
		const newPeople = people.map((person) => {
			if (person.info.id === personId) {
				return {
					...person,
					checked: checked,
				};
			}
			return person;
		});
		setPeople(newPeople);
	};

	const { allChecked, someChecked } = useMemo(() => {
		const allChecked = people.every((person) => person.checked);
		const someChecked = people.some((person) => person.checked) && !allChecked;
		return { allChecked, someChecked };
	}, [people]);

	return (
		<Dialog>
			<TopRow>
				<TopHeader>
					<div className='Heading3'>Add people from calendar</div>
					<button onClick={() => setView('main')}>
						<IoClose className='w-6 h-6' size={18} />
					</button>
				</TopHeader>
				<div className='Body2' style={{ color: 'var(--neutral-70)' }}>
					We found {people.length} new people in your calendar this week. Please
					check who should be added set wages for everyone of them.
				</div>
			</TopRow>
			<SearchRow>
				<SearchInputStyled
					className='Body2 medium'
					type='text'
					placeholder='Search by name or email'
					value={searchQuery}
					onChange={handleSearchInputChange}
				/>
			</SearchRow>
			<MidRow>
				<PeopleListContainer>
					<PeopleListHeaderContainer>
						<ChooseBox
							checked={allChecked}
							onCheckChange={handleMainCheckboxChange}
							status={
								allChecked
									? 'chosen'
									: someChecked
									? 'partlyChosen'
									: 'notChosen'
							}
						/>
						<PeopleListHeaderText>
							People ({people.length})
						</PeopleListHeaderText>
						<PeopleListHeaderText>Period</PeopleListHeaderText>
						<PeopleListHeaderText>Wage</PeopleListHeaderText>
					</PeopleListHeaderContainer>
					<hr className='h-0 w-full' />
					<PeopleListStyled>
						<CalendarPeopleList
							people={filteredPeople}
							onPersonCheck={handlePersonCheck}
							onInputChange={handleInputChange}
						/>

						{/* {filteredPeople.map((person) => {
							return (
								<>
									<div key={person.id}>
										<CalendarPerson
											person={person}
											check={checkedPersons[person.id]}
											onCheckChange={(isChecked) =>
												handleCheckChange(person.id, isChecked)
											}
											onInputChange={handleInputChange}
										/>
									</div>
									<hr className='h-0 w-full mx-0' />
								</>
							);
						})} */}
					</PeopleListStyled>
				</PeopleListContainer>
			</MidRow>
			<BotRow>
				<GreyButton
					onClick={() => setView('main')}
					style={{
						width: '65px',
						height: '32px',
						borderRadius: '6px',
						marginRight: '8px',
					}}
				>
					Cancel
				</GreyButton>
				<YellowButton
					onClick={handleAddNewPeople}
					style={{ width: '123px', height: '32px', borderRadius: '6px' }}
				>
					Add to Spry plan ({people.filter((person) => person.checked).length})
				</YellowButton>
			</BotRow>
		</Dialog>
	);
}

export default AddPeopleCalendar;

const Dialog = styled.div`
	background-color: var(--neutral-0);
	padding: 16px;
`;

const TopRow = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: 100%;
	margin-bottom: 16px;
`;

const TopHeader = styled.div`
	display: flex;
	justify-content: space-between;
	width: 100%;
	margin-bottom: 16px;
`;

const SearchRow = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: start;
	width: 100%;
`;

const MidRow = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: 100%;
	margin-bottom: 16px;
	margin-top: 16px;
	height: 332px;
`;

const BotRow = styled.div`
	display: flex;
	margin-top: 16px;
	justify-content: flex-end;
	width: 100%;
`;

const PeopleListContainer = styled.div`
	flex: 1;
	flex-direction: column;
	border-radius: 10px;
	border: 1px solid #cacacc;
	display: flex;
	height: 356px;
`;

const PeopleListHeaderContainer = styled.div`
	height: 32px;
	padding-left: 12px;
	Subheader2;
	display: grid;
	grid-template-columns: 30px 274px 124px 140px;
	align-items: center;

`;

const PeopleListStyled = styled.div`
	overflow-y: auto;
	height: 290px;

	&::-webkit-scrollbar {
		width: 6px;
	}

	&::-webkit-scrollbar-track {
		background: transparent;
	}

	&::-webkit-scrollbar-thumb {
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 3px;
	}
`;

const PeopleListHeaderText = styled.h2`
	color: var(--neutral-60);
	Subheader2
	align-items: center;
`;

const Image = styled.img``;

const SearchInputStyled = styled.input`
	width: 240px;
	height: 32px;
	padding-left: 40px;
	border-radius: 6px;
	border: 1px solid var(--neutral-40);
	color: #919191;
	outline: none;
	background-image: url(${SearchIcon});
	background-position: 10px center;
	background-repeat: no-repeat;

	&:active {
		border: 1px solid var(--neutral-60);
	}

	&:focus {
		border: 1px solid var(--neutral-60);
	}
`;
