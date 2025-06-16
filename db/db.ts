import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync("posts.db");

// テーブルがなければ作成
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
  )
`);

// 投稿を保存する関数
export function insertPost(post: {
  id: string;
  userId: string;
  username: string;
  userAvatarUrl: string;
  title: string;
  content: string;
  tags: string[];
  timestamp: number;
}): void {
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
    post.timestamp
  );
}

// 全投稿を取得する関数
export function getAllPosts(): {
  id: string;
  userId: string;
  username: string;
  userAvatarUrl: string;
  title: string;
  content: string;
  tags: string[];
  timestamp: number;
}[] {
  const stmt = db.prepare(`
    SELECT id, userId, username, userAvatarUrl, title, content, tags, timestamp
    FROM posts
    ORDER BY timestamp DESC
  `);
  return stmt.all().map((row: any) => ({
    ...row,
    tags: row.tags ? row.tags.split(",") : []
  }));
}
