import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const GreyButtonStyled = styled.button`
	padding: 7px 15px;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	font-size: medium;
	height: 42px;
	color: var(--neutral-80);
	background-color: var(--neutral-20);

	&:hover {
		background-color: var(--neutral-30);
	}
`;
function GreyButton({ onClick, children, Icon, size, style }) {
	return (
		<GreyButtonStyled onClick={onClick} style={style} className='Subheader2'>
			{Icon && <Icon size={size} />}
			{children}
		</GreyButtonStyled>
	);
}

GreyButton.propTypes = {
	onClick: PropTypes.func,
	children: PropTypes.node,
	icon: PropTypes.elementType,
	size: PropTypes.number,
	style: PropTypes.object,
};

GreyButton.defaultProps = {
	onClick: () => {}, // Default function that does nothing
	Icon: null,
	children: null,
	size: 20,
	style: {},
};

export default GreyButton;
