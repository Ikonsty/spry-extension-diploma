import React from 'react';
import styled from 'styled-components';
import SettingsIcon from '../../images_components/SettingsIcon';
import ProfileIcon from "../../images_components/ProfileIcon";
function SettingsProfileChoicePopup({ setView }) {
    return (
        <ChoiceDialog>
            <OptionButton
                className='top'
                onClick={() => setView('Settings')}
            >
                <SettingsIcon/>
                Settings
            </OptionButton>
            <OptionButton
                className='bottom'
                onClick={() => setView('Profile')}
            >
                <ProfileIcon/>
                Profile
            </OptionButton>
        </ChoiceDialog>
    );
}

export default SettingsProfileChoicePopup;

const ChoiceDialog = styled.div`
	position: absolute;
	top: 7%;
	left: 60%;
	z-index: 10;
	flex: 1;
	flex-direction: column;
	border-radius: 10px;
	display: flex;
	width: 162px;
	height: 72px;
	background-color: var(--neutral-0);
	box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

const OptionButton = styled.button`
    gap: 6px;
	height: 36px;
	padding-left: 12px;
	display: flex;
	align-items: center;
	Body2 medium;

	&.top:hover ~ ${ChoiceDialog} {
		background: linear-gradient(to bottom, grey 50%, white 50%);
	}

	&.bottom:hover ~ ${ChoiceDialog} {
		background: linear-gradient(to bottom, white 50%, grey 50%);
	}
`;