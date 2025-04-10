CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id INT REFERENCES users(id)
);

CREATE VIEW post_stats_view AS
SELECT posts.id, posts.title, users.username AS author
FROM posts
JOIN users ON posts.author_id = users.id;

CREATE VIEW editable_posts_view AS
SELECT id, title, content FROM posts;
GRANT SELECT, UPDATE (title, content) ON editable_posts_view TO public;

CREATE MATERIALIZED VIEW cached_posts AS
SELECT posts.id, posts.title, posts.content, users.username AS author
FROM posts
JOIN users ON posts.author_id = users.id;
REFRESH MATERIALIZED VIEW cached_posts;