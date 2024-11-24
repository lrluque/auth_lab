import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const { id } = useParams(); // Extract `id` from the URL (token)
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isTokenValid, setIsTokenValid] = useState(true);
    const [email, setEmail] = useState(''); // New state to store email
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

    // Validate the token and extract email when the component mounts
    useEffect(() => {
        const validateToken = async () => {
            try {
                const response = await fetch(`http://localhost:5000/reset-password/${id}/`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();

                if (response.ok) {
                    setEmail(data.email); // Extract email from response if valid
                } else {
                    setMessage(data.message || 'Invalid or expired token.');
                    setIsTokenValid(false);
                    setTimeout(() => navigate('/forgot-password'), 5000); // Redirect after 5 seconds
                }
            } catch (error) {
                setMessage('Error validating token');
                setIsTokenValid(false);
                setTimeout(() => navigate('/forgot-password'), 5000); // Redirect after 5 seconds
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
            const response = await fetch(`http://localhost:5000/change-password/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, id}), // Include email in the request body
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

    if (!isTokenValid) {
        return (
            <div>
                <p>{message}</p>
            </div>
        );
    }

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
