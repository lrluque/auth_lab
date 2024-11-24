import {Auth} from "../services/Auth.js";
import {generateAccessToken, verifyToken} from "../services/Verification.js";
import {Mail} from "../services/Mail.js";
import {UserModel} from "../models/UserModel.js";

export class AuthController {

    static async login(req) {
        try {
            const { email, password } = req.body;
            const result = await Auth.login(email, password);
            return result;
        } catch (error) {
            throw new Error('Something went wrong. Please try again later');
        }
    }

    static async forgotPassword(req) {
        try {
            const { email } = req.body;
            const user = UserModel.getUserByEmail(email)
            if (user) {
                let id = generateAccessToken({email: email, timestamp: Date.now()});
                let mail = new Mail()
                mail.setReceiver(email);
                mail.setSubject("Reset Password");
                mail.setHTML(`<a href="http://localhost:3000/reset-password/${id}">Click here to reset your password.</a>`);
                mail.send()
                    .catch((error) => {
                        console.log(error);
                    })
                return {status: "success"}
            } else {
                return {status : "user does not exist"}
            }
        } catch (error) {
            throw new Error('Something went wrong. Please try again.');
        }
    }

    static async changePassword(req) {
        try {
            const {email, password, token} = req.body;
            const tokenVerified = verifyToken(token)
            if (tokenVerified) {
                return await UserModel.updatePassword(email, password);
            } else {
                return {status: "failure", message: "Invalid token"}
            }

        } catch (error) {
            throw new Error('Something went wrong. Please try again later');
        }
    }




}