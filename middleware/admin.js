const jwt = require("jsonwebtoken")
const {JWT_ADMIN_Secret} = require("../config")

function adminMiddleWare(req, res, next) {
    const token = req.headers.token;
    const decode = jwt.verify(token, JWT_ADMIN_Secret);

    if(decode){
        req.adminId = decode.adminId;
        next()
    }else{
        res.status(401).send({
            message: "You are not signId in"
        })
    }
}


module.exports = {
    adminMiddleWare: adminMiddleWare
}