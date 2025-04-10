import express from 'express';
import transferRoutes from './routes/transfer';
import authRoutes from './routes/auth';
import { authenticateToken } from './middleware/auth';

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', authenticateToken, transferRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})