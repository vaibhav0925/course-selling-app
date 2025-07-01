const jwt = require('jsonwebtoken')
const { JWT_USER_Secret} = require("../config")

function userMiddleware (req, res, next) {
    const token = req.headers.token;
    const decode = jwt.verify(token, JWT_USER_Secret)

    if(decode){
        req.userId = decode.id;
        next()
    }else{
        res.status(403).send({
            message: "You are not signed in"
        })
    }
    next();
}

module.exports= {
    userMiddleware: userMiddleware
}