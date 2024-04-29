function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

window.addEventListener('load', function () {
	// Check if it's a Google Calendar meeting page
	if (window.location.href.includes('https://calendar.google.com/calendar/')) {
		// Set up a mutation observer to watch for changes in the document
		const observer = new MutationObserver((mutationsList, observer) => {
			// Look through all mutations that just occured
			for (let mutation of mutationsList) {
				// If the addedNodes property has one or more nodes
				if (mutation.addedNodes.length) {
					let targetContainer = document.querySelector('.UfeRlc');
					if (
						targetContainer &&
						!targetContainer.classList.contains('hello-added')
					) {
						let helloDiv = document.createElement('div');
						console.log(Math.floor(Math.random() * 99) + 1);
						console.log(getRandomInt());
						helloDiv.textContent = getRandomInt(0, 100) + ' USD';
						helloDiv.style.fontSize = '16px'; // Set size or other properties as you wish

						// Append the div to the target container
						targetContainer.appendChild(helloDiv);
						// Mark this container so we don't add "Hello" again
						targetContainer.classList.add('hello-added');
					}
				}
			}
		});

		// Start observing the document with the configured parameters
		observer.observe(document, { childList: true, subtree: true });
	}
});
