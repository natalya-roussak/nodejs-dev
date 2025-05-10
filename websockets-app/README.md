# Chat App Documentation

This is a real-time chat application built using **Express**, **Socket.IO**, and **Redis**. The app stores messages in Redis and broadcasts them to connected clients. The chat is simple, with no additional features like user presence indicators or timestamps.

### Prerequisites

Before you can run this application, ensure you have the following installed:

1. **Node.js** (version 14.x or higher)
2. **Redis** (make sure Redis server is running locally or you have access to a Redis server)

### Setting Up the Application

Follow these steps to set up the application:

#### 1. Clone the Repository

Clone the project repository to your local machine (if you haven't already).

```bash
git clone https://github.com/natalya-roussak/nodejs-dev.git
cd redis-app
```

#### 2. Install Dependencies

Install the necessary dependencies using **npm**:

```bash
npm install
```

This will install both production and development dependencies:
- **express**: Web framework for Node.js
- **socket.io**: For real-time communication
- **ioredis**: Redis client for interacting with Redis
- **express-session** and **connect-redis**: For session management and storing sessions in Redis
- **supertest**: For HTTP assertions in tests
- **mocha**, **chai**, and **sinon**: For testing and mocking

#### 3. Set Up Redis

Ensure that Redis is running locally on your machine (default: `localhost:6379`), or use a hosted Redis instance.

To start Redis locally, run the following command (assuming Redis is installed):

```bash
redis-server
```

#### 4. Configure the Environment (Optional)

If you need to set up any environment variables (e.g., `SESSION_SECRET`), you can create a `.env` file in the root directory of your project and add the following configuration:

```env
SESSION_SECRET=your_secret_key
```

#### 5. Running the Application

You can start the application using:

```bash
npm start
```

This will run the app on port 3000 by default. You can change the port in the `src/index.js` file if needed.
Also, you can specify the port by setting the `PORT` environment variable. 

For example, to run the app on port `4000`, you can create a `.env` file with the following content:
```env
PORT=4000
```
Alternatively, you can set the `PORT` variable directly in the terminal:
```bash
PORT=4000 npm start
```

#### 6. Running Tests

To run the tests for the application, use the following command:

```bash
npm test
```

This will execute the Mocha tests in the `test` directory.


### API Endpoints

- `POST /login`: Accepts a `username` parameter in the body. This endpoint sets the username in the session.
    - Request body example:
      ```json
      { "username": "your_username" }
      ```

### WebSocket Integration

- The app uses **Socket.IO** to send and receive real-time messages between the server and clients.
- On connection, the last 50 messages are sent to the client.
- Messages are stored in **Redis** and broadcasted to all connected clients.

---

### Troubleshooting

- **Redis connection error**: Ensure that Redis is running locally and the server is accessible.
- **Port in use**: If port `3000` is already occupied, update the port in the `src/index.js` file or close the process using that port.

