import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const YellowButtonStyled = styled.button`
	padding: 7px 15px;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	height: 32px;
	color: var(--neutral-80);
	background-color: var(--yellow-50);

	&:hover {
		background-color: var(--yellow-55);
	}
`;
function YellowButton({ onClick, children, Icon, size }) {
	return (
		<YellowButtonStyled className='Subheader2' onClick={onClick}>
			{Icon && <Icon size={size} style={{ marginRight: '5px' }} />}
			{children}
		</YellowButtonStyled>
	);
}

YellowButton.propTypes = {
	onClick: PropTypes.func,
	children: PropTypes.node.isRequired,
	icon: PropTypes.elementType,
	size: PropTypes.number,
};

YellowButton.defaultProps = {
	onClick: () => {}, // Default function that does nothing
	Icon: null,
	size: 20,
};

export default YellowButton;
