const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { sign } = require('jsonwebtoken');

const authorization = require('../middleware/authentication');
let User = require('../Models/User');
const Admin = require('../Models/Admin');

//Login user
router.post('/login', async function (req, res) {
    const { email, password } = req.body;

    let user = await User.findOne({
        email,
    });

    if (!user) {
        res.status(404).send({ error: 'Invalid Creditials' });
        return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(404).send({ error: 'Invalid Creditials' });
    }

    user = user.toObject();
    delete user.password;

    //generate json web token

    const payload = {
        user: {
            _id: user._id,
        },
    };

    sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn: 43200,
        },
        (err, token) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    error: err.toString(),
                });
            }

            res.status(200).json({
                token,
                user,
            });
        },
    );
});

//Register Process for admin Account
router.post('/register', async function (req, res) {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    try {
        let user = await User.findOne({
            email,
        });

        if (user) {
            res.status(403).send({ error: 'Account with email already exists' });
            return;
        }

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        const encryptedpassword = await bcrypt.hash(password, salt);

        user = new Admin({
            email,
            password: encryptedpassword,
        });

        await user.save();
        user = user.toObject();
        delete user.password;

        res.status(200).send(user);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: err.message });
    }
});
router.use(authorization);

router.get('/users', async (req, res) => {
    try {
        let users = await User.find().select('-password');

        res.status(200).json({ users });
    } catch (err) {
        console.error(err);
        next({ status: 500, error: err.toString() });
    }
});

//Edit/Update user
router.put('/user/:_id', async (req, res) => {
    try {
        const { _id } = req.params;
        const { fullname, email, password } = req.body;

        let user = await User.findById(_id);

        if (!user) {
            return next({ status: 404, error: 'User does not exist' });
        }

        const changes = {};

        if (fullname) changes.fullname = fullname;
        if (email) changes.email = email;
        if (password) changes.password = password;

        user = await User.findByIdAndUpdate(_id, changes, {
            new: true,
        }).select('-password');

        res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        next({ status: 500, error: err.toString() });
    }
});

module.exports = router;
