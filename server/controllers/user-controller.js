import {UserModel} from "../models/user-model.js";


export class UserController {
    static async getUsers(req, res) {
        try {
            const users = await UserModel.getUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users', error: error.message });
        }
    }

    static async createUser(req, res) {
        try {
            const { username, password, email } = req.body;
            const user = await UserModel.createUser(username, email, password);
            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error creating user', error: error.message });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            return await UserModel.login(email, password);
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
