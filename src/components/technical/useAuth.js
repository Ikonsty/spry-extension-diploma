import React, { useEffect } from 'react';
import { useUser } from './useUser';
import { useLocalStorage } from './useLocalStorage';


export const useAuth = () => {
	const { user, addUser, removeUser } = useUser();
	const { getItem } = useLocalStorage();

	useEffect(() => {
		getItem('user').then((user) => {
			if (user) {
				// Check if 'user' is a string that needs parsing
				if (typeof user === 'string') {
					try {
						const parsedUser = JSON.parse(user);
						addUser(parsedUser);
					} catch (error) {
						console.error('Error parsing user data:', error);
					}
				} else {
					addUser(user);
				}
			}
		});

		const messageListener = (message) => {
			if (message.action === 'userUpdated') {
				getItem('user').then((user) => {
					if (user) {
						// Repeat the same check and parsing logic here
						if (typeof user === 'string') {
							try {
								const parsedUser = JSON.parse(user);
								addUser(parsedUser);
							} catch (error) {
								console.error('Error parsing user data:', error);
							}
						} else {
							addUser(user);
						}
					}
				});
			}
		};

		chrome.runtime.onMessage.addListener(messageListener);

		return () => {
			chrome.runtime.onMessage.removeListener(messageListener);
		};
	}, []);

	const login = (user) => {
		addUser(user);
	};

	const logout = () => {
		removeUser();
	};

	return { user, login, logout };
};
