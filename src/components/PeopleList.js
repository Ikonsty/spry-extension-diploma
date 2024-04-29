import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import Sort from '../../dist/images/sort.svg';
import SortAscIcon from '../../dist/images/sorted_asc';
import SortDescIcon from '../../dist/images/sorted_des';
import ThreeDots from '../../dist/images/more_vert.svg';
import { SettingsContext } from './SettingsContext';

const PeopleList = ({ fields, searchQuery, onEdit, setView, setPerson }) => {
	const [people, setPeople] = useState(fields);
	const [isMenuVisible, setMenuVisible] = useState(false);
	const [selectedPerson, setSelectedPerson] = useState(null);
	const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
	const [sortOrder, setSortOrder] = useState('asc');
	const [sortIcon, setSortIcon] = useState(Sort);
	const { settings } = useContext(SettingsContext);

	const editPopupRef = useRef();

	const handleClickOutside = (event) => {
		if (editPopupRef.current && !editPopupRef.current.contains(event.target)) {
			setMenuVisible(false);
		}
	};

	const calculateWage = (wage, period) => {
		let calculatedWage;
		switch (period) {
			case 'hourly':
				calculatedWage = wage;
				break;
			case 'weekly':
				calculatedWage = wage / 40;
				break;
			case 'monthly':
				calculatedWage = wage / 160;
				break;
			case 'yearly':
				calculatedWage = wage / 1920;
				break;
		}

		switch (settings.costView) {
			case 'Cost per month':
				calculatedWage = wage * 160;
				break;
			case 'Cost per year':
				calculatedWage = wage * 1920;
				break;
			default:
				calculatedWage = calculatedWage;
		}
		return calculatedWage;
	};

	const getCurrencySymbol = (currencyView) => {
		switch (currencyView) {
			case 'Euro':
				return '€';
			case 'U.S. dollar':
			default:
				return '$';
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	useEffect(() => {
		setPeople(fields);
	}, [fields]);

	const ThreeDotsIcon = ({ id }) => (
		<img
			src={ThreeDots}
			alt='Settings'
			style={{
				width: '20px',
				height: '20px',
			}}
			onClick={(e) => {
				setMenuPosition({ top: e.clientY - 50, left: e.clientX - 110 });
				setMenuVisible(!isMenuVisible);
				setSelectedPerson(id);
			}}
		/>
	);

	const sortPeople = (order) => {
		const peopleArray = Object.entries(people).map(([id, details]) => ({
			id,
			...details,
		}));

		peopleArray.sort((a, b) => {
			if (order === 'asc') {
				return a.wage - b.wage;
			} else {
				return b.wage - a.wage;
			}
		});

		const sortedPeople = {};
		peopleArray.forEach((person) => {
			sortedPeople[person.id] = person;
		});

		return sortedPeople;
	};

	const toggleSortOrder = () => {
		const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		setSortOrder(newSortOrder);
		setSortIcon(newSortOrder === 'asc' ? SortAscIcon : SortDescIcon);
		setPeople(sortPeople(newSortOrder));
	};

	const sortAscending = () => {
		setSortOrder('asc');
		setSortIcon(SortAscIcon);
		setPeople(sortPeople('asc'));
	};

	const colorClasses = {
		high: 'bg-red-20',
		medium: 'bg-blue-20',
		low: 'bg-green-20',
	};

	function get_color(wage, period) {
		const hourlyWage = calculateWage(wage, period);

		if (hourlyWage > 50) {
			return colorClasses.high;
		} else if (hourlyWage > 15 && hourlyWage <= 50) {
			return colorClasses.medium;
		} else {
			return colorClasses.low;
		}
	}

	const removePerson = () => {
		chrome.storage.local.get('fields', (result) => {
			if (chrome.runtime.lastError) {
				console.error(chrome.runtime.lastError.message);
				return;
			}

			let existingFields = result.fields || {};
			delete existingFields[selectedPerson];

			chrome.storage.local.set({ fields: existingFields }, () => {
				if (chrome.runtime.lastError) {
					console.error(chrome.runtime.lastError.message);
				}
				setPeople((prevPeople) => {
					let newPeople = { ...prevPeople };
					delete newPeople[selectedPerson];
					return newPeople;
				});
				setMenuVisible(false);
			});
		});
	};

	const filteredPeople = Object.keys(people).filter((id) => {
		const person = people[id];
		const lowerCaseQuery = searchQuery.toLowerCase();
		const nameIncludesQuery =
			person.name && person.name.toLowerCase().includes(lowerCaseQuery);
		const emailIncludesQuery =
			person.email && person.email.toLowerCase().includes(lowerCaseQuery);

		return nameIncludesQuery || emailIncludesQuery;
	});

	const handleEditPerson = (personId) => {
		const editablePerson = people[personId];
		console.log(editablePerson);
		onEdit(editablePerson);
		setPerson(editablePerson);
		setView('EditPersonForm', { editablePerson });
	};

	return (
		<PeopleListConteiner>
			<PeopleListHeaderContainer>
				<PeopleListHeaderText>
					People ({filteredPeople.length})
				</PeopleListHeaderText>
				<div className='flex mr-10 items-center'>
					<ClickableText onClick={sortAscending}>
						<PeopleListHeaderText
							style={{ marginRight: '16px' }}
							className='Subheader2'
						>
							{settings.costView}
						</PeopleListHeaderText>
					</ClickableText>
					<div onClick={toggleSortOrder} style={{ cursor: 'pointer' }}>
						<img
							src={sortIcon}
							alt='Sort Icon'
							style={{ width: '20px', height: '20px' }}
						/>
					</div>
				</div>
			</PeopleListHeaderContainer>
			<hr className='h-0 w-full' />
			<PeopleListStyled>
				{filteredPeople.length === 0 ? (
					<div className='flex items-center m-3'>
						<p>No people</p>
					</div>
				) : (
					filteredPeople.map((id) => {
						const person = people[id];
						if (person) {
							const colorClass = get_color(person.wage, person.period);
							const displayWage = calculateWage(person.wage, person.period);
							const currencySymbol = getCurrencySymbol(settings.currencyView);
							const avatarUrl = person.avatar
								? person.avatar_url
								: './images/default_avatar_2.png';
							return (
								<div key={id}>
									<div className='flex items-center m-3'>
										<AvatarPlaceholder>
											<img
												src={avatarUrl}
												alt='Avatar'
												style={{
													width: '100%',
													height: '100%',
													objectFit: 'cover',
												}}
											/>
										</AvatarPlaceholder>
										<div>
											<PersonName className='Body2 bold'>
												{person.name}
											</PersonName>
											<PersonEmail className='Helper'>
												{person.email}
											</PersonEmail>
										</div>
										<PersonWage className={`${colorClass} Helper medium`}>
											{currencySymbol}
											{displayWage}
										</PersonWage>
										<ThreeDotsIcon id={id} />
										{isMenuVisible && selectedPerson === id && (
											<ActionDialog
												ref={editPopupRef}
												style={{
													top: menuPosition.top,
													left: menuPosition.left,
												}}
											>
												<ActionButton
													className='bottom'
													onClick={() => handleEditPerson(id)}
												>
													<div className='mr-4'>Edit</div>
												</ActionButton>
												<ActionButton className='top' onClick={removePerson}>
													<div className='mr-4'>Delete</div>
												</ActionButton>
											</ActionDialog>
										)}
									</div>
									<hr />
								</div>
							);
						}
						return null;
					})
				)}
			</PeopleListStyled>
		</PeopleListConteiner>
	);
};
export default PeopleList;

const ActionDialog = styled.div`
	position: absolute;
	top: 50%;
	left: 60%;
	z-index: 10;
	flex: 1;
	flex-direction: column;
	border-radius: 10px;
	display: flex;
	width: 110px;
	height: 72px;
	background-color: var(--neutral-0);
	box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

const ActionButton = styled.button`
	height: 36px;
	padding-left: 12px;
	display: flex;
	align-items: center;
	Body2 medium;
`;

const PeopleListConteiner = styled.div`
	flex: 1;
	flex-direction: column;
	border-radius: 10px;
	border: 1px solid #cacacc;
	display: flex;
	height: 356px;
`;

const PeopleListHeaderContainer = styled.div`
	height: 32px;
	display: flex;
	flex-direction: row;
	padding-right: 16px;
	padding-left: 16px;
	padding-top: 9px;
	padding-bottom: 9px;
	justify-content: space-between;
	Subheader2;
`;

const PeopleListStyled = styled.div`
	overflow-y: auto;
`;

const AvatarPlaceholder = styled.div`
	border-radius: 9999px;
	height: 34px;
	width: 34px;
	overflow: hidden;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #edf2f7;
	margin-right: 0.75rem;
`;

const PersonName = styled.p``;

const PersonEmail = styled.p`
	font-family: 'SF Pro Display', sans-serif;
	font-size: 12px;
	color: var(--neutral-60);
`;

const PeopleListHeaderText = styled.h2`
	color: var(--neutral-60);
	Subheader2
	align-items: center;
`;

const PersonWage = styled.div`
	margin-left: auto;
	border-radius: 4px;
	width: 40px;
	height: 20px;
	color: var(--neutral-80);
	display: flex;
	justify-content: center;
	align-items: center;
	margin-right: 5rem;
`;

const PeopleListHeader = styled.div`
	height: 32px;
	display: flex;
	flex-direction: row;
	padding: 20px 40px;
	justify-content: space-between;
`;

const ClickableText = styled.div`
	cursor: pointer;
	&:hover {
		text-decoration: underline;
	}
`;
