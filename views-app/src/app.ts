import express from 'express';
import session from 'express-session';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { UserModel } from './models/User';
import { PostModel } from './models/Post';
const app = express();

app.use(express.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await UserModel.findByUsername(username);
            if (!user) return done(null, false);
            if (await bcrypt.compare(password, user.password)) return done(null, user);
            return done(null, false);
        } catch (err) {
            return done(err);
        }
    })
);
passport.serializeUser((user, done) => done(null, (user as UserModel).id));
passport.deserializeUser(async (id: number, done) => {
    const user = await UserModel.findById(id);
    done(null, user);
});

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        await UserModel.create(username, password);
        res.status(201).send('User registered');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/login', passport.authenticate('local'), (req, res) => {
    res.send('Logged in');
});

app.get('/posts', async (req, res) => {
    try {
        const posts = await PostModel.getAll();
        res.json(posts);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/posts-extended', async (req, res) => {
    try {
        const posts = await PostModel.getPostsExtended();
        res.json(posts);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.put('/edit-post', async (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(403).send('Unauthorized');
        return;
    }
    try {
        const { id, title, content } = req.body;
        await PostModel.update(id, title, content);
        res.send('Post updated');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/add-post', async (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(403).send('Unauthorized');
        return;
    };
    try {
        const { title, content } = req.body;
        await PostModel.create((req.user as UserModel).id, title, content);
        res.status(201).send('Post added');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));

