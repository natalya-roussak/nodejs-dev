import { pool } from '../db';

export async function createUser(username: string, passwordHash: string) {
    const res = await pool.query(
        'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *',
        [username, passwordHash]
    );
    return res.rows[0];
}

export async function findUserByUsername(username: string) {
    const res = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return res.rows[0];
}

