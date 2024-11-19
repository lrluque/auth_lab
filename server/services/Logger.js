import {DB_HOSTNAME, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER} from "../config.js";
import mysql from "mysql2/promise";

const config = {
    host: DB_HOSTNAME,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
};

const events = {
    login: '(1) Login',
    register: '(2) Register',
    logout: '(3) Logout',
    success: 'Success',
    failure: 'Failure'
}


const connection = await mysql.createConnection(config);

export class Logger {


    static async logSuccessfulLogin(email, ip) {
        try {
            const status = events.success;
            const actionType = events.login;
            await connection.execute(
                'INSERT INTO auditlogs (email, action_type, timestamp, status, ip_address) VALUES (?, ?, NOW(), ?, ?)',
                [email, actionType, status, ip]
            );
        } catch (error) {
            console.error('Logging failed for', error);
        }
    }

    static async logFailureLogin(email, ip) {
        try {
            const status = events.failure;
            const actionType = events.login;
            await connection.execute(
                'INSERT INTO auditlogs (email, action_type, timestamp, status, ip_address) VALUES (?, ?, NOW(), ?, ?)',
                [email, actionType, status, ip]
            );
        } catch (error) {
            console.error('Logging failed for', error);
        }
    }

    static async logLogout(email, ip) {
        const status = events.success;
        const actionType = events.logout;
        await connection.execute(
            'INSERT INTO auditlogs (email, action_type, timestamp, status, ip_address) VALUES (?, ?, NOW(), ?, ?)',
            [email , actionType, status, ip]
        );
    } catch (error) {
        console.error('Logging failed for', error);
    }

}