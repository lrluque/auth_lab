import { UserController } from "./controllers/UserController.js";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import {SECRET_JWT_KEY, APPLICATION_PORT} from "./config.js";
import cookieParser from 'cookie-parser'
import {Logger} from "./services/Logger.js";
import {verifyToken} from "./services/Verification.js";
import {AuthController} from "./controllers/AuthController.js";
import {Auth} from "./services/Auth.js";

const app = express();
app.use(express.json());
app.use(cors({
    origin: `http://localhost:3000`,
    credentials: true
}));
app.use(cookieParser());

app.get('/check-session', (req, res) => {
    Auth.verifyToken(req.cookies.access_token)
        .then((token) => {
            res.json(token);
        })
        .catch((error) => {
            console.error('Error verifying token:', error);
            res.status(401).json({ error: 'Invalid token' });
        });
});

app.get('/verify/:id', async (req, res, next) => {
    const { id } = req.params;
    console.log(id)
    const isVerified = verifyToken(id);
    if (isVerified?.status) {
        try {
            const verify = await UserController.verifyUser(req);
            if (verify.status === 'Success') {
                res.cookie('access_token', verify.token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'strict',
                })
                    .status(201)
                    .json({status: 'success'});
            } else {
                res.status(404).json({ message: verify.message });
            }
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: 'Error verifying user', error: err.message });
        }
    } else {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
});



app.post('/login', async (req, res) => {
    try {
        const result = await AuthController.login(req);
        if (result.status === 'Failure') {
            await Logger.logFailureLogin(result.email, req.ip.toString());
            res.status(400).json({ message: result.message });
        } else {
            await Logger.logSuccessfulLogin(result.email, req.ip.toString());
            res.cookie('access_token', result.token, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
            })
                .status(201)
                .json({status: 'success', data: result});
        }
    } catch (error) {
        throw new Error('Something went wrong. Please try again.');
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
    Logger.logLogout(decoded.email, req.ip)
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


// Start server
app.listen(APPLICATION_PORT, () => {
    console.log(`Server started on port 5000`);
});
