// Email validation using a regular expression for basic email structure
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Username validation for minimum length (e.g., at least 3 characters)
const validateUsername = (username) => {
    const minLength = 3;
    const maxLength = 20;
    return typeof username === 'string' && username.length >= minLength && username.length <= maxLength;
};

// Password validation for services:
// - Minimum 8 characters
// - At least one uppercase letter
// - At least one lowercase letter
// - At least one number
// - At least one special character
const validatePassword = (password) => {
    const minLength = 8;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\+\[\]{}|\\:;"'<>,.?/~`-])[A-Za-z\d!@#$%^&*()_\+\[\]{}|\\:;"'<>,.?/~`-]{8,}$/;
    return password.length >= minLength && passwordRegex.test(password);
};

// Exporting the validation functions
module.exports = {
    validateEmail,
    validateUsername,
    validatePassword,
};
