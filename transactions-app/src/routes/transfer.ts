import express from 'express';
import { pool } from '../db';

const router = express.Router();

router.post('/transfer', async (req, res) => {
    const { fromAccount, toAccount, amount, isolationLevel = 'READ COMMITTED' } = req.body;
    const userId = (req as any).user.userId;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        await client.query(`SET TRANSACTION ISOLATION LEVEL ${isolationLevel}`);

        const ownerCheck = await client.query(
            'SELECT * FROM accounts WHERE id = $1 AND user_id = $2',
            [fromAccount, userId]
        );
        if (ownerCheck.rowCount === 0) throw new Error('You are not authorized to transfer from this account');

        const fromRes = await client.query('SELECT balance FROM accounts WHERE id = $1 FOR UPDATE', [fromAccount]);
        const fromBalance = fromRes.rows[0].balance;

        if (fromBalance < amount) throw new Error('Insufficient funds');

        await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amount, fromAccount]);
        await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amount, toAccount]);

        await client.query('COMMIT');
        res.send('Transfer successful');
    } catch (e: any) {
        await client.query('ROLLBACK');
        res.status(400).send({ error: e.message });
    } finally {
        client.release();
    }
});

export default router;