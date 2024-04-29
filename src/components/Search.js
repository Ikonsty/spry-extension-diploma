import React, { useState } from 'react';
import styled from 'styled-components';
import SearchI from '../../dist/images/search.svg';

function Search({ onSearchChange }) {
	const handleSearchChange = (event) => {
		const query = event.target.value;
		onSearchChange(query); // Pass the search query to the parent component
	};

	return (
		<SearchContainerStyled>
			<SearchIcon
				src={SearchI}
				alt='Search Icon'
				style={{ width: '18px', color: 'var(--neutral-50)' }}
			/>
			<SearchInputStyled
				class='Body2 medium'
				type='text'
				placeholder='Search by name or email'
				onChange={handleSearchChange}
			/>
		</SearchContainerStyled>
	);
}

export default Search;

const SearchContainerStyled = styled.div`
	position: relative;
	display: flex;
	align-items: center;
`;

const SearchInputStyled = styled.input`
	width: 240px;
	height: 32px;
	padding-left: 40px;
	border-radius: 6px;
	border: 1px solid var(--neutral-40);
	color: #919191;
	outline: none;

	&:active {
		border: 1px solid var(--neutral-60);
	}

	&:focus {
		border: 1px solid var(--neutral-60);
	}
`;

const SearchIcon = styled.img`
	position: absolute;
	left: 10px;
	top: 50%;
	transform: translateY(-50%);
	color: #919191;
`;
