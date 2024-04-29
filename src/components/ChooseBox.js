import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import checkedSVG from '../images/checkbox.svg';
import partlySVG from '../images/minus.svg';
import emptySVG from '../images/empty.svg';

const Box = styled.div`
	width: 13.5px;
	height: 13.5px;
	cursor: pointer;

	${(props) =>
		props.status === 'notChosen' &&
		css`
			background-image: url(${emptySVG});
			background-repeat: no-repeat;
			background-position: center;
		`}
	${(props) =>
		props.status === 'chosen' &&
		css`
			background-image: url(${checkedSVG});
			background-repeat: no-repeat;
			background-position: center;
		`}
		${(props) =>
		props.status === 'partlyChosen' &&
		css`
			background-image: url(${partlySVG});
			background-repeat: no-repeat;
			background-position: center;
		`};
`;

const ChooseBox = ({ checked, onCheckChange, status }) => {
	const handleClick = () => {
		onCheckChange(!checked);
	};

	return (
		<Box
			status={status ?? (checked ? 'chosen' : 'notChosen')}
			onClick={handleClick}
		></Box>
	);
	// const [status, setStatus] = useState(stat);

	// const handleClick = () => {
	// 	const newStatus = status === 'chosen' ? 'notChosen' : 'chosen';
	// 	setStatus(newStatus);
	// 	onCheckChange(newStatus === 'chosen');
	// };

	// return <Box status={status} onClick={handleClick}></Box>;
};

export default ChooseBox;
