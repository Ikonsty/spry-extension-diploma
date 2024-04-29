import React from 'react';
import styled from 'styled-components';
import DeleteIcon from "../../images_components/DeleteIcon";
import LogoutImage from "../../images_components/Logout";
import {useUser} from "../technical/useUser";
import { useAuth } from '../technical/useAuth';

function SignOutDeleteAccountPopup({ setView }) {
    const { logout } = useAuth();
    const { user } = useUser();


    const handleDeleteClick = () => {
        setView("DeleteAccountWindow");
    }

    const handleSignOutClick = () => {
        logout();
        setView("main");
    }

    return (
        <ChoiceDialog>
            <OptionButton
                onClick={handleSignOutClick}
                className='top'
            >
                <LogoutImage/>
                Sign out
            </OptionButton>
            <OptionButton
                onClick={handleDeleteClick}
                className='bottom'
            >
                <DeleteIcon/>
                Delete Account
            </OptionButton>
        </ChoiceDialog>
    );
}

export default SignOutDeleteAccountPopup;

const ChoiceDialog = styled.div`
	position: absolute;
	top: 25%;
	left: 50%;
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