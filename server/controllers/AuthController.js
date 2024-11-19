import {Auth} from "../services/Auth.js";

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




}