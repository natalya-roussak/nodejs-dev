import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {createUser, findUserByUsername} from '../models/user';
import {createAccount} from '../models/account';

const router = express.Router();

router.post('/register', async (req, res) => {
    const {username, password} = req.body;
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
        res.status(400).send({error: 'User already exists'});
        return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser(username, passwordHash);
    await createAccount(username, user.id); // default account with same name

    const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET!);
    res.send({token});
});

router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const user = await findUserByUsername(username);
    if (!user) {
        res.status(400).send({error: 'Invalid credentials'});
        return;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        res.status(400).send({error: 'Invalid credentials'});
        return;
    }

    const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET!);
    res.send({token});
});

export default router;