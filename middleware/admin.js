const jwt = require("jsonwebtoken")
const {JWT_ADMIN_Secret} = require("../config")

function adminMiddleWare(req, res, next) {
    const token = req.headers.token;

    try {
        const decode = jwt.verify(token, JWT_ADMIN_Secret);
        req.adminId = decode.adminId;
        next();
    } catch (err) {
        return res.status(401).send({
            message: "You are not signed in",
            error: err.message
        });
    }
}


module.exports = {
    adminMiddleWare: adminMiddleWare
}