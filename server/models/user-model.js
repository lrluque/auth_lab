import mysql from 'mysql2/promise';
import * as crypto from 'node:crypto';
import {Security} from "../security/security.js";
import {validateUsername, validateEmail, validatePassword} from "../security/validator.js";
// Connection configuration
const config = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'authdb',
};

const connection = await mysql.createConnection(config);


export class UserModel {
    static async createUser(username, email, password) {
        /*if (!username || !email || !password) {
            throw new Error('Username, email and password are required');
        }
        const usernameExists = await this.checkUsernameExists(username);
        if (usernameExists) {
            throw new Error('Username already exists');
        }
        const emailExists = await this.checkEmailExists(email);
        if (emailExists) {
            throw new Error('Email already exists');
        }*/
        if (!validateUsername(username)) {
            throw new Error('Username must be a string between 3 and 20 characters.');
        }
        if (!validateEmail(email)) {
            throw new Error('Email not valid.');
        }
        if (!validatePassword(password)) {
            throw new Error('Password must have at least 8 characters, at least one uppercase letter, at least one lowercase letter, at least one number and at least one special character.');
        }
        const password_hash = await Security.hash_password(password);
        const id = crypto.randomInt(999999);
        try {
            await connection.execute(
                'INSERT INTO Users (id, username, email, password_hash, created_at, updated_at, is_verified, role) VALUES (?, ?, ?, ?, NOW(), NOW(), ?, ?)',
                [id, username, email, password_hash, true, 'user']
            );
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Username or email already exists');
            }
            throw error;
        }
        return this.getUser(username);
    }

    static async getUsers() {
        const [rows] = await connection.execute('SELECT * FROM users');
        return rows;
    }

    static async getUser(username) {
        const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
        return rows;
    }

    static async getUserByEmail(email) {
        const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows;
    }

    static async checkUsernameExists(username) {
        const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
        return rows.length > 0;
    }

    static async checkEmailExists(email) {
        const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows.length > 0;
    }


    static async login(email, password) {
        // 1. Check if email exists
        const rows = await this.getUserByEmail(email)
        if (rows.length === 0 || !rows) {
            throw new Error('Email or password is not valid');
        }
        const user = rows[0];
        // 2. Check if password is correct
        const isPasswordValid = await Security.comparePassword(password, user.password_hash)
        if (!isPasswordValid) {
            throw new Error('Username or password is not valid');
        }
        return user;
    }

}
