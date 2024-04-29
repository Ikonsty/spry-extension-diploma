import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import WageInputForm from '../windows/WageInputForm';
import AddWageToAll from '../windows/AddWageToAll';

function GoogleCalendarExtension() {
	const [emptyEmails, setEmptyEmails] = useState([]); // emails that wasn`t added

	useEffect(() => {
		const loadHandler = () => {
			const observer = new MutationObserver((mutationsList) => {
				for (let mutation of mutationsList) {
					if (mutation.addedNodes.length || mutation.removedNodes.length) {
						let headerContainer = document.querySelector('.UfeRlc');
						let targetContainer = document.querySelector('.pdqVLc');
						let parentEmailDiv;
						if (targetContainer) {
							parentEmailDiv = targetContainer.querySelector('.Rzij1d');
						}
						let emails;

						if (headerContainer && targetContainer && parentEmailDiv) {
							if (
								!(
									targetContainer.querySelector('#cost-container') &&
									targetContainer.querySelector('.wageContainer')
								)
							) {
								if (parentEmailDiv) {
									emails = extractEmails(targetContainer);
								} else {
									emails = [getOwnerEmail()];
								}

								// add total price to event div
								if (!document.querySelector('#cost-container')) {
									createCostContainer(targetContainer);
									targetContainer.classList.add('price-added');
								}
								setCallPrice(targetContainer, emails);
								setEachPrice(parentEmailDiv);
								targetContainer.classList.add('price-added');
							}
						}
					}
				}
			});

			observer.observe(document.querySelector('.yDmH0d'), {
				childList: true,
				subtree: true,
			});
		};

		window.addEventListener('load', loadHandler);

		// Cleanup for component unmount
		return () => window.removeEventListener('load', loadHandler);
	}, []);

	useEffect(() => {
		console.log(emptyEmails);
		updateGuestSpanText();
		addAllWage();
	}, [emptyEmails]);

	const createCostContainer = (targetContainer) => {
		const costContainerHTML = `
			<div id="cost-container" style="display: flex; padding-y: 6px; align-items: center;">
			<div class="zZj8Pb EaVNbc" style="width: 40px; height: 50px;">
				<svg width="22" height="22" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M0 64C0 50.5941 0 43.8911 1.88552 38.5026C5.26272 28.8511 12.8511 21.2627 22.5026 17.8855C27.8911 16 34.5941 16 48 16H80C93.4059 16 100.109 16 105.497 17.8855C115.149 21.2627 122.737 28.8511 126.114 38.5026C128 43.8911 128 50.5941 128 64C128 77.4059 128 84.1089 126.114 89.4974C122.737 99.1489 115.149 106.737 105.497 110.114C100.109 112 93.4059 112 80 112H48C34.5941 112 27.8911 112 22.5026 110.114C12.8511 106.737 5.26272 99.1489 1.88552 89.4974C0 84.1089 0 77.4059 0 64Z" fill="#FFCF40"/>
				<path d="M85.6593 99.0798C79.8747 99.0798 74.8958 98.2534 70.7226 96.6006C66.5907 94.9479 63.3265 92.6547 60.9301 89.7211C58.5336 86.7461 57.1287 83.3373 56.7156 79.4947L56.6536 79.2468H72.1481L72.2101 79.4947C72.9951 81.8912 74.5032 83.8332 76.7345 85.3206C79.007 86.8081 82.0439 87.5518 85.8452 87.5518C88.407 87.5518 90.6382 87.2006 92.5388 86.4982C94.4395 85.7958 95.927 84.8248 97.0012 83.5853C98.0755 82.3457 98.6127 80.8789 98.6127 79.1848V79.1228C98.6127 77.1395 97.8276 75.4868 96.2575 74.1646C94.7287 72.8424 92.1256 71.7681 88.4483 70.9418L77.4782 68.5246C73.181 67.5743 69.6276 66.2521 66.818 64.558C64.0083 62.864 61.9011 60.7774 60.4962 58.2982C59.1327 55.8191 58.451 52.9268 58.451 49.6213V49.5593C58.451 45.4688 59.5872 41.8741 61.8597 38.7752C64.1323 35.6763 67.3138 33.2591 71.4043 31.5237C75.4949 29.7884 80.2052 28.9207 85.5353 28.9207C91.072 28.9207 95.8237 29.7677 99.7903 31.4618C103.757 33.1558 106.856 35.4697 109.087 38.4033C111.318 41.3369 112.578 44.6424 112.868 48.3198V48.5677H98.1788L98.1168 48.3198C97.621 46.1299 96.2988 44.2706 94.1503 42.7418C92.0017 41.1717 89.13 40.3866 85.5353 40.3866C83.2628 40.3866 81.2382 40.7378 79.4615 41.4402C77.7261 42.1426 76.3626 43.1136 75.3709 44.3532C74.3793 45.5514 73.8835 46.9769 73.8835 48.6297V48.7536C73.8835 50.0345 74.214 51.1708 74.8751 52.1624C75.5362 53.1541 76.5898 54.0218 78.036 54.7655C79.5235 55.4679 81.4654 56.1083 83.8619 56.6868L94.894 59.104C101.546 60.5914 106.443 62.802 109.583 65.7356C112.764 68.6692 114.355 72.5945 114.355 77.5114V77.6354C114.355 81.8912 113.116 85.6512 110.636 88.9154C108.157 92.1382 104.748 94.638 100.41 96.4147C96.1129 98.1914 91.196 99.0798 85.6593 99.0798Z" fill="#1A1A1A"/>
				</svg>
			</div>
			<div style="display: flex; align-items: center; justify-content: center; margin-right: 10px; background-color: #ffcf4080; width: 165px; height: 36px; border-radius: 4px;">
				<span style="font-family: 'SF Pro', sans-serif; font-weight: 400; font-size: 14px; margin-right: 5px;">Meeting cost:</span>
				<span style="font-family: 'SF Pro', sans-serif; font-weight: 600; font-size: 14px; display: flex; align-items: center;" id="cost"></span>
			</div>
			<div>
				<div class="zZj8Pb EaVNbc" style="width: 148px; height: 34px; display:flex; padding-y: 6px; align-items: start; flex-direction: column" id="add-people-wage">
				<span style="font-family: 'SF Pro', sans-serif; font-weight: 400; font-size: 14px; margin-right: 5px; color: #737373" id="guest-number"></span>
				</div>
			</div>
			</div>
		`;

		const costContainer = document
			.createRange()
			.createContextualFragment(costContainerHTML);

		// const costContainer = document.createElement('span');
		// costContainer.appendChild(document.createTextNode('hello world'));

		if (!targetContainer) {
			console.error('targetContainer not found');
			return;
		}

		const mz3isdElement = targetContainer.querySelector('.Mz3isd');
		if (!mz3isdElement) {
			console.error('.Mz3isd element not found within targetContainer');
			return;
		}

		if (mz3isdElement.children.length < 3) {
			console.error('.Mz3isd element does not have enough children');
			return;
		}

		const referenceElement = mz3isdElement.children[2];

		// Attempt to insert the costContainer before the referenceElement
		try {
			mz3isdElement.insertBefore(costContainer, referenceElement);
		} catch (error) {
			console.error('Failed to insert container:', error);
		}
		updateGuestSpanText();
	};

	const updateGuestSpanText = () => {
		const guestSpan = document.querySelector('#guest-number');
		if (guestSpan) {
			guestSpan.textContent = `${emptyEmails.length} guests without wage`;
		}
	};

	const addAllWage = () => {
		const addPeopleWageContainer = document.querySelector('#add-people-wage');
		if (!addPeopleWageContainer) {
			// console.error('#add-people-wage container not found');
			return;
		}

		try {
			if (!addPeopleWageContainer.classList.contains('added')) {
				let wageContainer = document.createElement('div');

				ReactDOM.render(
					<AddWageToAll
						key={JSON.stringify(emptyEmails)}
						emptyEmails={emptyEmails}
					/>,
					wageContainer
				);
				addPeopleWageContainer.appendChild(wageContainer);

				addPeopleWageContainer.classList.add('added');
			}
		} catch (error) {
			console.error('Failed to render AddWageToAll component:', error);
		}
	};

	const extractEmails = (targetContainer) => {
		const emails = [];
		const divs = targetContainer.querySelectorAll('.toUqff');
		divs.forEach((div) => {
			const email = div.getAttribute('data-hovercard-id');
			if (email !== null) {
				emails.push(email);
			}
		});
		return emails;
	};

	const getOwnerEmail = () => {
		const myEmail = document.querySelector('#xUserEmail').textContent;
		return myEmail;
	};

	const defineDate = (dateString) => {
		// Define date from '8 вересня 2023, 8:10пп'

		const monthMap = {
			січня: 0, // January
			лютого: 1, // February
			березня: 2, // March
			квітня: 3, // April
			травня: 4, // May
			червня: 5, // June
			липня: 6, // July
			серпня: 7, // August
			вересня: 8, // September
			жовтня: 9, // October
			листопада: 10, // November
			грудня: 11, // December
		};

		const dateComponents = dateString.match(
			/(\d+) ([^\s]+) (\d+), (\d+):(\d+)([^\d\s]+)$/
		);

		if (dateComponents) {
			const day = parseInt(dateComponents[1], 10);
			const month = monthMap[dateComponents[2]];
			const year = parseInt(dateComponents[3], 10);
			let hours = parseInt(dateComponents[4], 10);
			const minutes = parseInt(dateComponents[5], 10);
			const ampm = dateComponents[6].toLowerCase();

			// Adjust hours for PM (ппп) if needed
			if (ampm === 'пп' && hours < 12) {
				hours += 12;
			}

			const jsDate = new Date(year, month, day, hours, minutes);
			return jsDate;
		} else {
			console.log('Invalid date format');
			return null;
		}
	};

	const extractTimeDuration = (targetContainer) => {
		const div = targetContainer.querySelector('.AzuXid');
		const span = div.querySelectorAll('span')[1];

		if (!span) {
			// If call lasts more that one day
			const text = div.textContent;

			const dateStrings = text.split(' – ');
			const startDate = defineDate(dateStrings[0].trim());
			const endDate = defineDate(dateStrings[1].trim());

			const timeDifference = Math.floor(Math.abs(endDate - startDate) / 60000);
			// console.log('timeDiff', timeDifference);
			return timeDifference;
		} else {
			// If call lasts only one day or less
			const dateComponents = span.textContent.match(
				/(\d+):(\d+)([^\d]*) – (\d+):(\d+)([^\d]*)/
			);

			if (dateComponents) {
				let startHour = parseInt(dateComponents[1], 10);
				const startMinute = parseInt(dateComponents[2], 10);
				const startAm = dateComponents[3];

				let endHour = parseInt(dateComponents[4], 10);
				const endMinute = parseInt(dateComponents[5], 10);
				const endAm = dateComponents[6];

				// Handle 24-hour format (no AM/PM indicator)
				if (!startAm || !endAm) {
					// console.log(dateComponents);
					// Check if the start hour is greater than the end hour, which implies PM to AM.
					if (
						startHour > endHour ||
						(startHour === endHour && startMinute > endMinute)
					) {
						endHour += 12; // Add 24 hours to the end time to account for the next day.
					}
				} else {
					if (startAm === 'пп' && startHour < 12) {
						startHour += 12;
					}
					if (endAm === 'пп' && endHour < 12) {
						endHour += 12;
					}
				}

				const startTotalMinutes = startHour * 60 + startMinute;
				const endTotalMinutes = endHour * 60 + endMinute;

				return endTotalMinutes - startTotalMinutes;
			}

			return null;
		}
	};

	const increaseCost = (newWage) => {
		const priceContainer = document.querySelector('#total-price');
		const totalPriceMatch = priceContainer.textContent.match(/\$([\d.]+)/);
		let targetContainer = document.querySelector('.pdqVLc');

		if (totalPriceMatch) {
			let totalPrice = parseFloat(totalPriceMatch[1]);
			const spentTime = extractTimeDuration(targetContainer);

			totalPrice += (newWage * spentTime) / 60;

			priceContainer.textContent = `$${totalPrice.toFixed(2)}`;

			// updateGuestSpanText();
		}
	};

	const setEachPrice = (parentEmailDiv) => {
		const emailDivs = parentEmailDiv.children;

		chrome.storage.local.get('fields', (result) => {
			if (chrome.runtime.lastError) {
				console.error(chrome.runtime.lastError.message);
				return;
			}
			if (result.fields) {
				let newEmails = [];
				const userInfoArray = Object.values(result.fields);

				const spentTime = extractTimeDuration(
					document.querySelector('.pdqVLc')
				);
				for (const emailDiv of emailDivs) {
					const email = emailDiv
						.querySelector('.DbpAnb')
						.getAttribute('data-hovercard-id');

					const userInfo = userInfoArray.find((info) => info.email === email);

					if (userInfo) {
						const wage = userInfo.wage;
						const period = userInfo.period;

						if (wage && period) {
							let pricePerHour = wage;

							// Convert wage to an hourly rate based on the type
							if (period === 'hourly') {
								pricePerHour /= 1;
							} else if (period === 'weekly') {
								pricePerHour /= 5 * 8; // Assuming 8 working hours per day
							} else if (period === 'monthly') {
								pricePerHour /= 20 * 8; // Assuming 20 days and 8 working hours per day
							} else if (period === 'yearly') {
								pricePerHour /= 20 * 8 * 12;
							}

							const innerDiv = emailDiv.querySelector('.DbpAnb');
							let priceContainer = innerDiv.querySelector('.wageContainer');

							const totalPrice = (pricePerHour * spentTime) / 60;

							if (!priceContainer) {
								priceContainer = document.createElement('div');
								priceContainer.classList.add('wageContainer');
								priceContainer.textContent = `$${totalPrice.toFixed(2)}`;
								priceContainer.style.marginLeft = '7px';
								innerDiv.style.display = 'flex';
								innerDiv.style.justifyContent = 'space-between';
								innerDiv.appendChild(priceContainer);
							}
						} else {
							console.log(
								`Wage or type information missing for email: ${email}`
							);
						}
					} else {
						if (!newEmails.includes(email)) {
							newEmails.push(email);
						}

						const innerDiv = emailDiv.querySelector('.DbpAnb');
						let wageContainer = innerDiv.querySelector('.wageContainer');

						if (!wageContainer) {
							wageContainer = document.createElement('div');
							wageContainer.classList.add('wageContainer');
							innerDiv.appendChild(wageContainer);
							innerDiv.style.display = 'flex';
							innerDiv.style.justifyContent = 'space-between';
							ReactDOM.render(
								<WageInputForm
									setEmptyEmails={setEmptyEmails}
									lastEmail={email}
									increaseCost={increaseCost}
									spentTime={spentTime}
								/>,
								wageContainer
							);
						}
					}
				}
				setEmptyEmails((prevEmails) => {
					// Create a combined array of previous and new emails, filtering out duplicates
					const allEmails = [...prevEmails, ...newEmails];
					return allEmails.filter(
						(email, index, self) => self.indexOf(email) === index
					);
				});
			}
		});

		return null; // This component doesn't render anything visible
	};

	const setCallPrice = (targetContainer, emails) => {
		chrome.storage.local.get('fields', (result) => {
			if (chrome.runtime.lastError) {
				console.error(chrome.runtime.lastError.message);
				return;
			}

			if (result.fields) {
				const userInfoArray = Object.values(result.fields);

				const pricePerHour = userInfoArray.reduce((total, userInfo) => {
					// only add the price to the total if the email is in the list
					if (emails.includes(userInfo.email)) {
						let wage = Number(userInfo.wage);
						let type = userInfo.period; // Assuming 'type' contains values like 'per day', 'per hour', 'per month'

						// Convert wage to an hourly rate based on the type
						if (type === 'hourly') {
							wage /= 1;
						} else if (type === 'weekly') {
							wage /= 40; // Assuming 8 working hours per day
						} else if (type === 'monthly') {
							wage /= 160; // Assuming 20 days and 8 working hours per day
						} else if (type === 'yearly') {
							wage /= 1920;
						}

						return total + wage;
					}
					return total;
				}, 0);

				const spentTime = extractTimeDuration(targetContainer);

				const totalPrice = (pricePerHour * spentTime) / 60;

				let priceContainer = document.createElement('div');
				priceContainer.id = 'total-price';
				priceContainer.textContent = `$${totalPrice}`; // Fixing the decimal places to 2
				if (!targetContainer.querySelector('#cost').textContent.trim()) {
					targetContainer.querySelector('#cost').appendChild(priceContainer);
				}
			}
		});

		return null; // This component doesn't render anything visible
	};
}

export default GoogleCalendarExtension;
