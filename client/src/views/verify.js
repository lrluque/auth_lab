import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Verify = () => {
    const { id } = useParams(); // Extract `id` from the URL
    const navigate = useNavigate();
    const [message, setMessage] = useState('Verifying...');

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const response = await fetch(`http://localhost:5000/verify/${id}`, {
                    method: 'GET',
                    credentials: 'include', // Include credentials if needed
                });

                const data = await response.json();

                if (response.ok) {
                    // If verification is successful, redirect to the home page or display a success message
                    setMessage('Verification successful! Redirecting...');
                    setTimeout(() => navigate('/'), 3000); // Redirect after 3 seconds
                } else {
                    // If verification fails, display an error message
                    setMessage(data.message || 'Verification failed.');
                }
            } catch (error) {
                console.error('Error verifying user:', error);
                setMessage('An error occurred during verification.');
            }
        };

        verifyUser();
    }, [id, navigate]);

    return (
        <div>
            <h2>Account Verification</h2>
            <p>{message}</p>
        </div>
    );
};

export default Verify;
