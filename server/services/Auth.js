import jwt from "jsonwebtoken";
import {SECRET_JWT_KEY} from "../config.js";
import {Security} from "./Security.js";
import {UserModel} from "../models/UserModel.js";


export class Auth {


    static async getToken(email, username, id, role) {
        return jwt.sign(
            {
                email,
                username,
                id,
                role
            },
            SECRET_JWT_KEY,
            {expiresIn: "1h"}
        );
    }

    static async login(email, password) {
        const user = await UserModel.getUserByEmail(email);
        if (!user) {
            return {status: 'Failure', type: 'EMAIL_DONT_EXIST', message: 'Invalid email or password', email: email};
        }
        const isPasswordValid = await Security.comparePassword(password, user.password_hash)
        if (!isPasswordValid) {
            return {status: 'Failure', type : 'INVALID_PASSWORD', message: 'Invalid email or password', email : user.email};
        }
        if (!user.is_verified) {
            return {status: 'Failure', type: 'NOT_VERIFIED', message: 'User not verified', email : user.email};
        }
        const token = await this.getToken(user.email, user.username, user.id, user.role);
        return {status: 'Success', token, email: user.email, username: user.username, id: user.id, role: user.role};
    }

}

