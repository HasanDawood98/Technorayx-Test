const jwt = require('jsonwebtoken');
const User = require('../Models/User.js');

module.exports = async (req, res, next) => {
    // Get token from header
    let token = req.header('authorization'); // "authorization": "Bearer duwqhdusand9ahd2eh298e2e2q12e521e6531e65321e2365e13265r13265r51326e"
    // check if not token
    if (!token) {
        return res.status(401).send({ error: 'No token, authorization denied' });
    }
    // Verify token
    schemePlusToken = token.split(' ');

    try {
        if (schemePlusToken[0] === 'Bearer') {
            token = schemePlusToken[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.user._id).select('-password');

            if (!user) {
                return res.status(401).send({ error: 'Token is not valid' });
            }

            req.user = user;
            next();
        } else {
            res.status(401).send({ error: 'Token is not valid' });
        }
    } catch (err) {
        console.error(err);
        res.status(401).send({ error: 'Token is not valid' });
    }
};
