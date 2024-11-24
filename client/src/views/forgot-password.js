import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await fetch('http://localhost:5000/check-session', {
                    method: 'GET',
                    credentials: 'include',
                });

                const data = await response.json();
                if (data.status === 'logged') {
                    navigate('/protected');
                }
            } catch (error) {
                console.error('Error checking login status:', error);
                setErrorMessage(error.message);
            }
        };

        checkLoginStatus();
    }, [navigate]);

    const handleForgotPassword = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (data.status === 'success' || data.status === 'failure') {
                setMessage('If the email exists, a password reset link will be sent to your email.');
                setTimeout(() => navigate('/'), 5000); // Redirect to home after 5 seconds
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            setMessage('Network error. Please try again.');
        }
    };

    return (
        <div className="mainContainer">
            <div className="titleContainer">
                <div>Forgot Password</div>
            </div>
            <form onSubmit={handleForgotPassword} className="inputContainer">
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="inputBox"
                    required
                />
                <input
                    className="button inputButton"
                    type="submit"
                    value="Send Reset Link"
                />
            </form>
            {message && <div className="messageLabel">{message}</div>}
            <button
                className="button returnButton"
                onClick={() => navigate('/')}
            >
                Return to Login
            </button>
        </div>
    );
};

export default ForgotPassword;
