import {pool} from "./db";

export class PostModel {
    static async getAll() {
        const result = await pool.query('SELECT * FROM post_stats_view');
        return result.rows;
    }

    static async getPostsExtended() {
        const result = await pool.query('SELECT * FROM cached_posts');
        return result.rows;
    }

    static async create(authorId: number, title: string, content: string) {
        await pool.query('INSERT INTO posts (author_id, title, content) VALUES ($1, $2, $3)', [authorId, title, content]);
        await pool.query('REFRESH MATERIALIZED VIEW cached_posts');
    }

    static async update(id: number, title: string, content: string) {
        await pool.query('UPDATE editable_posts_view SET title = $1, content = $2 WHERE id = $3', [title, content, id]);
        await pool.query('REFRESH MATERIALIZED VIEW cached_posts');
    }
}
