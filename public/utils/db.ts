// db.ts
import { DatabaseSync } from "node:sqlite";
// データベースファイルを開く（なければ自動で作成）
const db = new DatabaseSync("posts.db");
// テーブル作成
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    userId TEXT,
    username TEXT,
    userAvatarUrl TEXT,
    title TEXT,
    content TEXT,
    tags TEXT,
    timestamp INTEGER
  );
`);

// 投稿の追加
export function insertPost(post: {
  id: string;
  userId: string;
  username: string;
  userAvatarUrl: string;
  title: string;
  content: string;
  tags: string[];
  timestamp: number;
}) {
  const stmt = db.prepare(`
    INSERT INTO posts (id, userId, username, userAvatarUrl, title, content, tags, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    post.id,
    post.userId,
    post.username,
    post.userAvatarUrl,
    post.title,
    post.content,
    post.tags.join(","),
    post.timestamp,
  );
}

// 投稿の取得
export function getAllPosts() {
  const stmt = db.prepare(`
    SELECT id, userId, username, userAvatarUrl, title, content, tags, timestamp
    FROM posts
    ORDER BY timestamp DESC
  `);
  return stmt.all().map((row: any) => ({
    id: row.id,
    userId: row.userId,
    username: row.username,
    userAvatarUrl: row.userAvatarUrl,
    title: row.title,
    content: row.content,
    tags: row.tags ? row.tags.split(",") : [],
    timestamp: row.timestamp,
  }));
}
