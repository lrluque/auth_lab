import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [errorMessage, setErrorMessage] = useState('');
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

    const handleLogin = async (event) => {
        event.preventDefault();

        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.status === 'success') {
                navigate('/protected');
            } else {
                setErrorMessage(data.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="mainContainer">
            <div className="titleContainer">
                <div>Login</div>
            </div>
            <form onSubmit={handleLogin} className="inputContainer">
                <label>Email</label>
                <input
                    name="email"
                    placeholder="Enter your email"
                    className="inputBox"
                />
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    className="inputBox"
                />

                {errorMessage && <div className="errorLabel">{errorMessage}</div>}

                <input
                    className="button inputButton"
                    type="submit"
                    value="Log in"
                />
            </form>
            <button
                className="button returnButton"
                onClick={() => navigate('/signup')}
            >
                Sign Up
            </button>
            <button
                className="button forgotButton"
                onClick={() => navigate('/forgot-password')}
            >
                Forgot Password?
            </button>
        </div>
    );
};

export default Home;
