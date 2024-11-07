import jwt from "jsonwebtoken";
import {SECRET_JWT_KEY} from "../config.js";

function getToken(user) {
    const token = jwt.sign(
        {
            email: user.email,
            username: user.username,
            id: user.id,
            role: user.role
        },
        SECRET_JWT_KEY,
        {expiresIn: "1h"}
    );
    return token;
}

export default getToken