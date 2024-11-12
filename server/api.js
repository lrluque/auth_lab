import { UserController } from "./controllers/UserController.js";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import {SECRET_JWT_KEY, APPLICATION_PORT} from "./config.js";
import cookieParser from 'cookie-parser'
import getToken from './security/Auth.js'
import {Logger} from "./security/Logger.js";
import {verifyToken} from "./security/Verification.js";

const app = express();
app.use(express.json());
app.use(cors({
    origin: `http://localhost:3000`,
    credentials: true
}));
app.use(cookieParser());


app.get('/', (req, res) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.json({status : 'not_logged'});
    }
    try {
        jwt.verify(token, SECRET_JWT_KEY);
        return res.json({status: 'logged'});
    } catch (error) {
        return res.json({status: 'not_logged'});
    }
});

app.get('/verify/:id', async (req, res, next) => {
    const { id } = req.params;
    console.log(id)
    const isVerified = verifyToken(id);
    if (isVerified?.status) {
        try {
            const user = await UserController.verifyUser(req, res);
            if (user) {
                SetSessionUser(user, res);
            } else {
                return res.status(404).json({ message: 'User not found' });
            }
        } catch (err) {
            return res.status(500).json({ message: 'Error verifying user', error: err.message });
        }
    } else {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
});

function SetSessionUser(user, res) {
    const token = getToken(user);

    res.cookie('access_token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
    })
        .status(201)
        .json({status: 'success'});
}

app.post('/login', async (req, res) => {
    try {
        const user = await UserController.login(req);
        SetSessionUser(user, res)
        Logger.logSuccessfulLogin(user.id, req.ip.toString())

    } catch (error) {
            try {
                const user = await UserController.getUser(req, res);
                let id = null;
                if (user !== null) {
                    id = user.id
                }
                Logger.logFailureLogin(id, req.ip.toString());
                res.status(500).json({ message: error.message });
            } catch (innerError) {
                console.error('Error during login attempt:', innerError);
                res.status(500).json({ message: 'Internal server error' });
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
    const token = req.cookies.access_token;
    const decoded = jwt.verify(token, SECRET_JWT_KEY);
    Logger.logLogout(decoded.id, req.ip)
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
