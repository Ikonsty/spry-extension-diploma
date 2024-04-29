import { v4 as uuidv4 } from 'uuid';

/**
 * Adds a person to Chrome's local storage.
 * @param {Object} person - The person object to add. Should contain email, period, and wage properties.
 */
export const addPersonToStore = (person) => {
	if (!person.email || !person.period || !person.wage) {
		alert('Please fill all the fields before adding a new one.');
		return;
	}

	let hourlyRate = parseFloat(person.wage);

	if (isNaN(hourlyRate)) {
		console.error('Invalid wage value:', person.wage);
		return;
	}

	switch (person.period) {
		case 'hourly':
			break;
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
			console.error('Invalid period value:', person.period);
			return;
	}

	hourlyRate =
		hourlyRate % 1 === 0 ? hourlyRate.toFixed(0) : hourlyRate.toFixed(2);

	const id = uuidv4(); // Ensure you have a way to generate unique IDs, such as importing the uuid package
	let updatedPerson = {
		[id]: { email: person.email, period: person.period, wage: hourlyRate },
	};

	chrome.storage.local.get('people', (result) => {
		if (chrome.runtime.lastError) {
			console.error('Error fetching people:', chrome.runtime.lastError.message);
			return;
		}

		let existingPeople = result.people || {};
		const allPeople = { ...existingPeople, ...updatedPerson };

		chrome.storage.local.set({ people: allPeople }, () => {
			if (chrome.runtime.lastError) {
				console.error('Error saving people:', chrome.runtime.lastError.message);
			} else {
				console.log('People saved successfully:', allPeople);
			}
		});
	});

	return { updatedPerson, id };
};
