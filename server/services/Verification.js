const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const secret = 'Hello I am a secret';

// Function to generate a random string of specified length
function rmdStr(length) {
    return crypto.randomBytes(Math.ceil(length * 0.75)) // Adjusted for base64 encoding
        .toString('base64')
        .slice(0, length)
        .replace(/[^a-zA-Z0-9]/g, ''); // Remove non-alphanumeric characters
}

class ShortURL {
    constructor() {
        this.storage = new Map();
    }

    set(shortStr, token) {
        this.storage.set(shortStr, token);
    }

    get(shortStr) {
        return this.storage.get(shortStr);
    }

    has(shortStr) {
        return this.storage.has(shortStr);
    }
}

const shortURL = new ShortURL();

// Function to generate a short token identifier
const generateAccessToken = (payload) => {
    if (!payload) {
        throw new Error('Payload is required for generating access token');
    }

    const token = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '2m' }); // Set to 10 minutes
    const id = rmdStr(12);
    shortURL.set(id, token);
    return id;
};

// Function to verify a token by its short identifier
const verifyToken = (id) => {
    try {
        // Retrieve token from storage
        const token = shortURL.get(id);
        if (!token) {
            return {
                status: false,
                message: 'Token not found or expired',
            };
        }

        // Verify token
        const decoded = jwt.verify(token, secret);
        console.log("Decoded token:", decoded);

        return {
            status: true,
            payload: decoded,
            message: 'Token verified successfully',
        };
    } catch (error) {
        console.log('Token verification error:', error);
        return {
            status: false,
            message: error.message,
        };
    }
};

module.exports = {
    generateAccessToken,
    verifyToken,
};
