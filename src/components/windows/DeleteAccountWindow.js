import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CrossSign from '../../../dist/images/close.svg';
import { useUser } from "../technical/useUser";
import { useAuth } from '../technical/useAuth';
import auth from '../technical/firebase';
import {jwtDecode} from "jwt-decode";
import GreyButton from "../GreyButton";
import { deleteUser } from "firebase/auth";



const DeleteWindow = ({ setView }) => {
    const { u, login, logout } = useAuth();
    const { user } = useUser();

    let userEmail;
    try {
        console.log(u)
        userEmail = user && user.idToken ? jwtDecode(user.idToken).email : "No email available";
    } catch (error) {
        userEmail = "Invalid token";
    }

    useEffect(() => {
        document.body.style.width = '416px';
        document.body.style.height = '164px';
    }, []);


    const handleDeleteClick = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                await deleteUser(user);
                alert('Account deleted successfully.');
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Failed to delete account. Please try again.');
            }
        }
    };

    const handleClose = () => {
        setView('main');
    };

    return (
        <Dialog>
            <Header>
                <ProfileText>Delete account?</ProfileText>
                <CrossIcon src={CrossSign} onClick={handleClose} />
            </Header>
            <MainContainer>
                <Text>
                    Are you sure you want to delete your account <span style={{color: "#1A1A1A"}}>
                    {userEmail}?</span> This cannot be undone.
                </Text>
            </MainContainer>
            <Footer>
                <GreyButton onClick={handleClose} style={{
                    height: "32px",
                    width: "62px",
                    fontSize: "12px",
                    lineHeight: "14px",
                    fontWeight: "500",
                }}>
                    Cancel
                </GreyButton>
                <BlackButton onClick={handleDeleteClick}>
                    Delete
                </BlackButton>
            </Footer>
        </Dialog>
    );
};

export default DeleteWindow;


const Dialog = styled.div`
    display: flex;
    flex-direction: column;
`;

const CrossIcon = styled.img`
	cursor: pointer;
	width: 20px;
	height: 20px;
`;


const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16px;
    cursor: pointer;
`;

const ProfileText = styled.h3`
	font-size: 16px;
	font-weight: 500;
    font-family: "Roboto";
`;

const MainContainer = styled.div`
	display: flex;
    justify-content: space-between;
    flex-direction: column;
	padding: 16px;
	padding-top: 0;
`;

const Text = styled.div`
    font-family: 'Roboto',serif;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: #737373;
`;

const BlackButton = styled.button`
	padding: 7px 15px;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	height: 32px;
    width: 62px;
    margin-left: 16px;
    margin-right: 12px;
    font-size: 12px;
    line-height: 14px;
    font-weight: 500;
    color: white;
	background-color: black;
`;

const Footer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
`;