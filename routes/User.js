const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { sign } = require('jsonwebtoken');

const { extname } = require('path');
const multer = require('multer');
const { existsSync, mkdirSync } = require('fs');

const destinationPath = 'public/';

const storage = multer.diskStorage({
    destination: (req, file, done) => {
        if (!existsSync(destinationPath)) {
            mkdirSync(destinationPath, { recursive: true });
        }
        done(null, destinationPath);
    }, //'public/images/',
    filename: function (req, file, done) {
        const name = file.fieldname + '-' + Date.now() + extname(file.originalname);
        done(null, name);
    },
});

const upload = multer({ storage: storage });

const authorization = require('../middleware/authentication');

// Bring data of user from Models

let User = require('../Models/User');
const { relativePathToUrl } = require('../utils/Utils');

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

    // res.status(200).send({token,user})
});

//Register Process
router.post('/register', upload.any(), async function (req, res) {
    const { fullname, email, password } = req.body;
    const [file] = req.files;

    console.log(password);
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

        user = new User({
            fullname,
            email,
            password: encryptedpassword,
            profilePictureUrl: file.destination + file.filename,
        });

        await user.save();
        user = user.toObject();
        delete user.password;

        user.profilePictureUrl = relativePathToUrl(req, user.profilePictureUrl);
        res.status(200).send(user);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: err.message });
    }
});

router.use(authorization);

//Edit/Update user
router.put('/profile', async (req, res) => {
    try {
        const { _id } = req.user;
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
