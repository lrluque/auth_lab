import React, { useState } from 'react';
import {json, useNavigate} from 'react-router-dom';

const Signup = () => {
    const [errorMessage, setErrorMessage] = useState(''); // State for holding API error message
    const navigate = useNavigate();

    const handleSignup = async (event) => {
        event.preventDefault();


        const form = event.target;
        const username = form.username.value;
        const email = form.email.value;
        const password = form.password.value;
        try {
            // Step 1: Attempt to register the user
            const signupResponse = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const signupData = await signupResponse.json();

            if (signupResponse.ok) {
                navigate('/');
            } else {
                // Handle signup error
                setErrorMessage(signupData.message || 'Signup failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during signup or login:', error);
            setErrorMessage('Network error. Please try again.');
        }
    };

    return (
        <div className="mainContainer">
            <div className="titleContainer">
                <div>Sign Up</div>
            </div>
            <form onSubmit={handleSignup} className="inputContainer">
                <label>Username</label>
                <input
                    name="username"
                    placeholder="Enter your username"
                    className="inputBox"
                />
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
                    value="Sign Up"
                />
            </form>
            <button
                className="button returnButton"
                onClick={() => navigate('/')}
            >
                Return to Login
            </button>
        </div>
    );
};

export default Signup;
