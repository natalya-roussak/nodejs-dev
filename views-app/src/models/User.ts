import {pool} from "./db";
import bcrypt from "bcrypt";

export class UserModel {
    id: number;
    username: string;
    password: string;

    constructor(id: number, username: string, password: string) {
        this.id = id;
        this.username = username;
        this.password = password;
    }

    static async findByUsername(username: string): Promise<UserModel | null> {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) return null;
        const { id, password } = result.rows[0];
        return new UserModel(id, username, password);
    }

    static async findById(id: number): Promise<UserModel | null> {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) return null;
        const { username, password } = result.rows[0];
        return new UserModel(id, username, password);
    }

    static async create(username: string, password: string): Promise<void> {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
    }
}
