import mysql from 'mysql2/promise';
import * as crypto from 'node:crypto';
import {Security} from "../services/Security.js";
import {validateUsername, validateEmail, validatePassword} from "../services/Validator.js";
import {
    DB_HOSTNAME,
    DB_NAME,
    DB_PASSWORD,
    DB_PORT,
    DB_USER,
} from "../config.js";
import {generateAccessToken} from "../services/Verification.js";
import {Mail} from "../services/Mail.js";
import nodemailer from "nodemailer";

// Connection configuration
const config = {
    host: DB_HOSTNAME,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
};

const connection = await mysql.createConnection(config);


export class UserModel {
    static async createUser(username, email, password) {
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
        const randomID = crypto.randomInt(999999);
        try {
            await connection.execute(
                'INSERT INTO Users (id, username, email, password_hash, created_at, updated_at, is_verified, role) VALUES (?, ?, ?, ?, NOW(), NOW(), ?, ?)',
                [randomID, username, email, password_hash, false, 'user']
            );
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Username or email already exists');
            }
            throw error;
        }
        let id = generateAccessToken(({username, email}))
        let mail = new Mail()
        mail.setReceiver(email);
        mail.setSubject("Email Verification");
        mail.setHTML(`<a href="http://localhost:3000/verify/${id}">Click here to verify your email</a>`);
        mail.send()
            .catch((error) => {
                console.log(error);
            })
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
        return rows[0];
    }

    static async checkUsernameExists(username) {
        const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
        return rows.length > 0;
    }

    static async checkEmailExists(email) {
        const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows.length > 0;
    }

    static async VerifyUser(email) {
        try {
            await connection.execute('UPDATE Users SET is_verified = true WHERE email = ?', [email]);
            return this.getUserByEmail(email)
        } catch (error) {
            console.error(error);
        }
    }

}
