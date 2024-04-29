import React, { useState } from 'react';

export const useLocalStorage = () => {
	const [value, setValue] = useState(null);

	const setItem = (key, value) => {
		chrome.storage.local.set({ [key]: value });

		setValue(value);
	};

	const getItem = (key) => {
		return new Promise((resolve, reject) => {
			chrome.storage.local.get([key], (result) => {
				if (chrome.runtime.lastError) {
					reject(chrome.runtime.lastError);
				} else {
					resolve(result[key]);
				}
			});
		});
	};

	const removeItem = (key) => {
		chrome.storage.local.remove(key);
		setValue(null);
	};

	return { value, setItem, getItem, removeItem };
};
