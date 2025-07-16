const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const authMiddleWare = (req, res, next) => {
    const authHeader = req.headers.token;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Token is missing or malformed',
            status: 'ERROR'
        });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(403).json({
                message: 'Invalid token',
                status: 'ERROR'
            });
        }
        if (user?.isAdmin) {
            next();
        } else {
            return res.status(403).json({
                message: 'Access denied',
                status: 'ERROR'
            });
        }
    });
};


// const authMiddleWare = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//         return res.status(401).json({
//             message: 'No token provided',
//             status: 'ERROR'
//         });
//     }

//     const token = authHeader.split(' ')[1];

//     jwt.verify(token, process.env.ACCESS_TOKEN, function(err, user) {
//         if (err) {
//             return res.status(403).json({
//                 message: 'Invalid token',
//                 status: 'ERROR'
//             });
//         }

//         const { payload } = user;

//         if (payload?.isAdmin) {
//             next();
//         } else {
//             return res.status(403).json({
//                 message: 'You are not authorized',
//                 status: 'ERROR'
//             });
//         }
//     });
// };

const authUserMiddleWare = (req, res, next) => {
    const authHeader = req.headers.token;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Token is missing or malformed',
            status: 'ERROR'
        });
    }

    const token = authHeader.split(' ')[1];
    const userId = req.params.id;

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(403).json({
                message: 'Invalid token',
                status: 'ERROR'
            });
        }
        if (user?.isAdmin || user?.id === userId) {
            next();
        } else {
            return res.status(403).json({
                message: 'Access denied',
                status: 'ERROR'
            });
        }
    });
};


module.exports = {
    authMiddleWare,
    authUserMiddleWare
}