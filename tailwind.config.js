/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,jsx}'],
	theme: {
		extend: {
			fontFamily: {
				google: ['Google Sans', 'Roboto', 'Arial', 'sans-serif'],
			},
			colors: {
				'green-20': '#B0FAC9',
				'red-20': '#FFCFD9',
				'blue-20': '#D7E6FE',
			},
		},
	},
	plugins: [],
};
