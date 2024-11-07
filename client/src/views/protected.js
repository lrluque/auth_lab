import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Protected = () => {
    const [message, setMessage] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                const response = await fetch('http://localhost:5000/protected', {
                    method: 'GET',
                    credentials: 'include'
                });

                const data = await response.json();

                if (response.ok && data.status === 'success') {
                    setMessage(data.message);
                    setIsAuthorized(true);
                } else {
                    setMessage(data.message);
                    setIsAuthorized(false);
                    if (data.status === 'error') {
                        setTimeout(() => navigate('/'), 6000);
                    }
                }
            } catch (error) {
                console.error('Error checking authorization:', error);
                setMessage('Network error. Please try again.');
                setIsAuthorized(false);
            }
        };

        checkAuthorization();
    }, [navigate]);

    const handleSignOut = async () => {
        try {
            const response = await fetch('http://localhost:5000/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                navigate('/');
            } else {
                setMessage('Failed to log out. Please try again.');
            }
        } catch (error) {
            console.error('Error logging out:', error);
            setMessage('Network error. Please try again.');
        }
    };

    return (
        <div className="mainContainer">
            <div className="titleContainer">
                <div>Protected Page</div>
            </div>
            <p>{message}</p>
            {isAuthorized && (
                <button className="button inputButton" onClick={handleSignOut}>
                    Sign Out
                </button>
            )}
        </div>
    );
};

export default Protected;
