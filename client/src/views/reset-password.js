import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const { id } = useParams(); // Extract `id` from the URL (token)
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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

    // Validate the token when the component mounts
    useEffect(() => {
        const validateToken = async () => {
            try {
                const response = await fetch(`http://localhost:5000/verify-reset-token/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token: id })
                });
                const data = await response.json();

                if (!response.ok) {
                    navigate('/forgot-password');
                }
            } catch (error) {
                console.error('Error validating token:', error);
                navigate('/forgot-password');
            }
        };

        validateToken();
    }, [id, navigate]);

    const handleResetPassword = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/reset-password/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Password reset successful! Redirecting to login...');
                setTimeout(() => navigate('/'), 3000); // Redirect to login after 3 seconds
            } else {
                setMessage(data.message || 'Failed to reset password. Please try again.');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            setMessage('Network error. Please try again.');
        }
    };

    return (
        <div className="mainContainer">
            <div className="titleContainer">
                <div>Reset Password</div>
            </div>
            <form onSubmit={handleResetPassword} className="inputContainer">
                <label>New Password</label>
                <input
                    type="password"
                    value={password}
                    placeholder="Enter new password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="inputBox"
                    required
                />
                <label>Confirm Password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    placeholder="Confirm new password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="inputBox"
                    required
                />
                <input
                    className="button inputButton"
                    type="submit"
                    value="Reset Password"
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

export default ResetPassword;
