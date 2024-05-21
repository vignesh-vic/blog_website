const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1]; 
    jwt.verify(token, `${process.env.JWT_SECRET}` || "blogwebsite", (err, user) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.user = user;
        next();
    });
}

module.exports = { verifyToken }