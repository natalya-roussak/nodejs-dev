import { pool } from '../db';

export async function getAccountById(id: number) {
    const res = await pool.query('SELECT * FROM accounts WHERE id = $1', [id]);
    return res.rows[0];
}

export async function updateBalance(id: number, amount: number) {
    await pool.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amount, id]);
}

export async function createAccount(holderName: string, userId: number) {
    const res = await pool.query(
        'INSERT INTO accounts (holder_name, balance, user_id) VALUES ($1, $2, $3) RETURNING *',
        [holderName, 0, userId]
    );
    return res.rows[0];
}
