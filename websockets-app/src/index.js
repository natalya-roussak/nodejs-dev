const {Server} = require("socket.io");
const Redis = require("ioredis");
const {sessionMiddleware, server} = require("./app");
const {REDIS_PORT, REDIS_HOST} = require("./constants");
const {redisClient} = require("./redis");

const redisPublisher = new Redis(REDIS_PORT, REDIS_HOST);
const MESSAGE_CHANNEL = 'chat_messages';

const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

io.on('connection', (socket) => {
    const username = socket.request.session.username;
    console.log('A user connected:', username);

    redisClient.lrange(MESSAGE_CHANNEL, -50, -1).then(messages => {
        messages.forEach(msg => socket.emit('message', msg));
    });

    socket.on('message', async (msg) => {
        console.log('Message received:', msg);
        const message = `${username}: ${msg}`;
        await redisClient.rpush(MESSAGE_CHANNEL, message);
        redisPublisher.publish(MESSAGE_CHANNEL, message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', username);
    });
});

const redisSubscriber = new Redis(REDIS_PORT, REDIS_HOST);
redisSubscriber.subscribe(MESSAGE_CHANNEL);
redisSubscriber.on('message', (_, message) => {
    io.emit('message', message);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
