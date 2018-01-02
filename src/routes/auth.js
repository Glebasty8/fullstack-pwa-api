import express from 'express';
import User from '../models/User';

const router = express.Router();

router.post("/", (req, res) => {
    const { credentials } = req.body;
    User.findOne({ email: credentials.email }, (err, user) => {
       if (user && user.isValidPassword(credentials.password)) {
           console.log(user);
           res.json({ user: user.toAuthJSON() });
       } else {
           res.status(400).json({ errors: { global: "Invalid Credentials" } });
       }
    });

});

export default router;