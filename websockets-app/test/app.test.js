const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const { Server } = require('socket.io');
const {server} = require('../src/app.js');
const Redis = require('ioredis');

describe('Server tests', () => {
    let redisClientStub, redisPublisherStub, redisSubscriberStub;
    let io;

    before((done) => {
        redisClientStub = sinon.stub(Redis.prototype, 'lrange').resolves([]);
        redisPublisherStub = sinon.stub(Redis.prototype, 'rpush').resolves('OK');
        redisSubscriberStub = sinon.stub(Redis.prototype, 'subscribe').resolves('OK');

        io = new Server(server);

        server.listen(3001, () => {
            console.log('Server running on test port 3001');
            done();
        });
    });

    after(() => {
        sinon.restore();
        server.close();
    });

    it('should return 400 if no username is provided for login', async () => {
        const response = await request(server)
            .post('/login')
            .send({});
        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal('Username is required');
    });

    it('should successfully set the session and return username on login', async () => {
        const response = await request(server)
            .post('/login')
            .send({ username: 'testuser' });

        expect(response.status).to.equal(200);
        expect(response.body.success).to.equal(true);
        expect(response.body.username).to.equal('testuser');
    });


    it('should get the last 50 messages from Redis on socket connection', async () => {
        redisClientStub.resolves(['Message 1', 'Message 2']);

        const socket = require('socket.io-client')('http://localhost:3001');

        socket.on('connect', () => {
            socket.on('message', (msg) => {
                expect(msg).to.be.oneOf(['Message 1', 'Message 2']);
            });
            socket.disconnect();
        });
    });
});
