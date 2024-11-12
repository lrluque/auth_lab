import {UserModel} from "../models/UserModel.js";
import {verifyToken} from "../security/Verification.js";


export class UserController {
    static async getUsers(req, res) {
        try {
            const users = await UserController.getUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users', error: error.message });
        }
    }

    static async getUser(req, res) {
        try {
            const user = await UserModel.getUserByEmail(req.body.email);
            if (!user) {
                return null;
            }

            return user;
        } catch (error) {
            console.error("Error fetching user:", error);
            if (!res.headersSent) {
                return res.status(500).json({
                    message: 'Internal server error',
                });
            }
        }
    }



    static async createUser(req, res) {
        try {
            const { username, password, email } = req.body;
            const user = await UserModel.createUser(username, email, password);
            res.status(201).json({ message: 'UserModel created successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error creating user', error: error.message });
        }
    }

    static async verifyUser(req, res) {
        try {
            const { id } = req.params;
            let isVerified = verifyToken(id)
            if (isVerified?.status) {
                return await UserModel.VerifyUser(isVerified?.payload?.email);
            } else {
                res.status(401).json({ message: 'Unauthorized', error: 'Unauthorized' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error verifying user', error: error.message });
        }
    }

    static async login(req) {
        try {
            const { email, password } = req.body;
            return await UserModel.login(email, password);
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
