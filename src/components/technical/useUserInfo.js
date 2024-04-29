import { useState, useEffect, useContext } from 'react';
import { auth } from '../..';

export const useUser = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(setUser);
        return () => unsubscribe(); // Clean up subscription
    }, []);

    return { user };
};
