const express = require('express');
const { createServer } = require('http');
const session = require('express-session');
const { RedisStore } = require('connect-redis');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {redisClient} = require("./redis");

const app = express();

app.use(cors());

app.use(express.json());
app.use(cookieParser());
app.use(express.static('./public'));

const sessionMiddleware = session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || 'redis-app-secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
    },
});
app.use(sessionMiddleware);

app.post('/login', (req, res) => {
    const { username } = req.body;
    if (!username) {
        res.status(400).json({ error: 'Username is required' });
        return;
    }
    req.session.username = username;
    res.json({ success: true, username });
});

const server = createServer(app);

module.exports.server = server;
module.exports.sessionMiddleware = sessionMiddleware;
