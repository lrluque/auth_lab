import {UserModel} from "../models/UserModel.js";
import {verifyToken} from "../services/Verification.js";
import {Auth} from "../services/Auth.js";


export class UserController {

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
            await UserModel.createUser(username, email, password);
            res.status(201).json({ message: 'UserModel created successfully', email: email });
        } catch (error) {
            console.error("Error creating user:", error);
            res.status(500).json({ message: 'Error creating user', error: error.message });
        }
    }

    static async verifyUser(req) {
        try {
            const { id } = req.params;
            let isVerified = verifyToken(id)
            if (isVerified?.status) {
                const user = UserModel.VerifyUser(isVerified?.payload?.email);
                const token = Auth.getToken(user.email, user.username, user.id, user.role)
                return {status: 'Success', token: token}
            } else {
                return { status:  'Failure', message: 'Invalid verification token', error: 'Unauthorized' };
            }
        } catch (error) {
            return { status:  'Failure', message: 'Error verifying user', error: error.message };
        }
    }


}
