import { UserController } from "./controllers/user-controller.js";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import {SECRET_JWT_KEY, APPLICATION_PORT} from "./config.js";
import cookieParser from 'cookie-parser'
import getToken from './security/auth.js'

const app = express();
app.use(express.json());
app.use(cors({
    origin: `http://localhost:3000`,
    credentials: true
}));
app.use(cookieParser());

// Route definitions
app.get('/', (req, res) => {
    const token = req.cookies.access_token;
    if (!token) {
        res.json({status : 'not_logged'});
    }
    try {
        const data = jwt.verify(token, SECRET_JWT_KEY);
        res.json({status: 'logged'});
    } catch (error) {
        res.json({status: 'not_logged'});
    }
});



app.post('/login', async (req, res) => {
    try {
        const user = await UserController.login(req, res);

        const token = getToken(user)
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
        })
            .status(201)
            .json({ status: 'success' });

    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({ message: 'Error login', error: error.message });
        }
    }
});

app.post('/register', async (req, res) => {
    try {
        await UserController.createUser(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});

app.post('/logout', (req, res) => {
    res.clearCookie('access_token');
    res.json({ status: 'success', message: 'Logged out successfully' });
});


app.get('/protected', (req, res) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(403).json({ status: 'error', message: 'Access denied' });
    }

    try {
        const data = jwt.verify(token, SECRET_JWT_KEY);
        res.json({ status: 'success', message: 'Access granted', data });
    } catch (error) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
});


app.get('/users', async (req, res) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(403).json({ status: 'error', message: 'Access denied' });
    }
    try {
        const data = jwt.verify(token, SECRET_JWT_KEY);
        if (data.role !== 'admin') {
            return res.status(403).json({ status: 'error', message: 'Access denied: Admins only' });
        }
        await UserController.getUsers(req, res);
    } catch (error) {
        res.status(401).json({ status: 'error', message: 'Internal error' });
    }
});


// Start server
app.listen(APPLICATION_PORT, () => {
    console.log(`Server started on port 5000`);
});
