let user_signed_in = false;

chrome.runtime.onMessageExternal.addListener(
	(request, sender, sendResponse) => {
		if (request.action === 'login' && request.user) {
			console.log('dist_background: ', request.user);
			chrome.storage.local.set({ user: request.user }, () => {
				// Notify the React app about the update
				chrome.runtime.sendMessage({ action: 'userUpdated' });
			});
			return true; // Keep the message channel open for the asynchronous response
		}
	}
);
