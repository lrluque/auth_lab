import bcrypt from 'bcrypt';
import mysql from "mysql2/promise";

const config = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'authdb',
}

const connection = await mysql.createConnection(config)
export class Security {

    static async hash_password(password) {
        if (!password) {
            throw new Error('Password is required');
        }
        return await bcrypt.hash(password, 10);
    }

    static async comparePassword(password, password_hash) {
        return await bcrypt.compare(password, password_hash);
    }
}