import React, { useEffect } from 'react';

function GoogleGmailExtension() {
	useEffect(() => {
		const loadHandler = () => {
			const observer = new MutationObserver((mutationsList) => {
				for (let mutation of mutationsList) {
					if (mutation.addedNodes.length) {
						let headerContainer = document.querySelector('.aRb'); // container to check if it is a notification from calendar
						let targetContainer = document.querySelector('.aU4'); // container where price should be put

						if (
							headerContainer &&
							targetContainer &&
							!targetContainer.classList.contains('price-added')
						) {
							let emails = extractEmails();

							// add total price to event div
							createCostContainer(targetContainer);
							setCallPrice(targetContainer, emails);
							targetContainer.classList.add('price-added');
						}
					}
				}
			});
			// bkK - container where the email content is displayed
			observer.observe(document.querySelector('.bkK'), {
				childList: true,
				subtree: true,
			});

			// Cleanup for component unmount
			return () => observer.disconnect();
		};

		// Helper function to compute call price

		window.addEventListener('load', loadHandler);

		// Cleanup for component unmount
		return () => window.removeEventListener('load', loadHandler);
	}, []);

	const extractEmails = () => {
		const emails = [];
		const spans = document.querySelectorAll('.notranslate');
		spans.forEach((span) => {
			const email = span.querySelector('a').textContent;
			if (email !== null) {
				emails.push(email);
			}
		});
		return emails;
	};
	return null;
}

const createCostContainer = (targetContainer) => {
	const costContainerHTML = `
		<div id="cost-container" style="display:flex; padding-y: 3px">
			<div class="zZj8Pb EaVNbc"><p style="color: #999">Ціна</p></div>
			<div id="cost" style="display: flex; align-items: center; margin-right: 10px"></div>
		</div>
	`;

	targetContainer.insertAdjacentHTML('beforeend', costContainerHTML);
};

const setCallPrice = (targetContainer, emails) => {
	chrome.storage.local.get('fields', (result) => {
		if (chrome.runtime.lastError) {
			console.error(chrome.runtime.lastError.message);
			return;
		}

		if (result.fields) {
			const pricePerHour = result.fields.reduce((total, field) => {
				// only add the price to the total if the email is in the list
				if (emails.includes(field.email)) {
					let wage = Number(field.wage);
					let type = field.type; // Assuming 'type' contains values like 'per day', 'per hour', 'per month'

					// Convert wage to an hourly rate based on the type
					if (type === 'per hour') {
						wage /= 1;
					} else if (type === 'per day') {
						wage /= 8; // Assuming 8 working hours per day
					} else if (type === 'per month') {
						wage /= 20 * 8; // Assuming 30 days and 8 working hours per day
					} else if (type === 'per year') {
						wage /= 20 * 8 * 12;
					}

					return total + wage;
				}
				return total;
			}, 0);

			const spentTime = extractTimeDuration(targetContainer);

			const totalPrice = (pricePerHour * spentTime) / 60;

			let priceContainer = document.createElement('div');
			priceContainer.id = 'total-price';
			priceContainer.textContent = `$${totalPrice.toFixed(2)} cost of meeting`; // Fixing the decimal places to 2
			priceContainer.style.fontSize = '.875rem';
			priceContainer.style.color = 'red';
			priceContainer.style.marginLeft = '30px';
			targetContainer.querySelector('#cost').appendChild(priceContainer);
		}
	});

	return null;
};

const getYear = (list) => {
	const yearPattern = /\b\d{4}\b/;

	for (const item of list) {
		if (yearPattern.test(item)) {
			return item;
		}
	}
	return null;
};

const extractTimeDuration = (targetContainer) => {
	const durationText = targetContainer.querySelectorAll('.aU6')[0].textContent;
	const dateStrings = durationText.split(' – ');

	const startDateList = dateStrings[0].trim().split(' ');
	const endDateList = dateStrings[1].trim().split(' ');

	const startDate = parseDate(
		startDateList,
		getYear(startDateList),
		endDateList
	);
	const endDate = parseDate(endDateList, getYear(startDateList), startDateList);

	const timeDifference = Math.floor(Math.abs(endDate - startDate) / 60000);
	return timeDifference;
};

const parseDate = (dateString, givenYear = null, prevDateParts = null) => {
	const monthAbbreviations = {
		'січ.': 0,
		'лют.': 1,
		'бер.': 2,
		'кві.': 3,
		'тра.': 4,
		'чер.': 5,
		'лип.': 6,
		'сер.': 7,
		'вер.': 8,
		'жов.': 9,
		'лис.': 10,
		'гру.': 11,
	};

	// Split the input date string into parts
	let parts = dateString;

	if (parts.length <= 3) {
		let p = prevDateParts;
		p.pop();
		p.push(parts[0]);
		parts = p;
	}

	// Initialize variables for date components
	let day, month, year, time;

	// Check if the first part is a day of the week (e.g., "пн", "вт", etc.)
	const daysOfWeek = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'нд'];
	if (daysOfWeek.includes(parts[0])) {
		// Parse the day and month
		day = parseInt(parts[1], 10);
		month = monthAbbreviations[parts[2]];

		// Check if there's a year in the string
		if (parts.length > 3 && parts[3].match(/^\d{4}$/)) {
			year = parseInt(parts[3], 10);
			time = parts[4];
		} else {
			// Use the year from the previous date
			if (prevDateParts && !givenYear) {
				year = prevDateParts[3];
				time = parts[3];
			} else {
				year = givenYear;
				time = parts[3];
			}
		}
	} else {
		// Handle the case where the string doesn't start with a day of the week
		return null;
	}

	// Parse the time component if it exists
	const timeParts = time.split(':');
	let hours = parseInt(timeParts[0], 10);
	let minutes = parseInt(timeParts[1], 10);

	if (minutes) {
		if (timeParts[1].includes('пп')) {
			hours += 12;
		}
	} else {
		minutes = 0;
		if (timeParts[0].includes('пп')) {
			hours += 12;
		}
	}

	// Create a new Date object with the parsed components
	const parsedDate = new Date(year, month, day, hours, minutes);

	return parsedDate;
};

export default GoogleGmailExtension;
