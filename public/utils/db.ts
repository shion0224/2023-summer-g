// db.ts
import { DatabaseSync } from "node:sqlite";
// データベースファイルを開く（なければ自動で作成）
const db = new DatabaseSync("./public/utils/posts.db");
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

// 初期データを投入する関数
export function seedInitialPosts() {
  const existing = db.prepare("SELECT COUNT(*) FROM posts");
  const count = existing[0][0] as number;
  if (count > 0) return;

  const initialPosts = [
    {
      id: "init-1",
      userId: "user001",
      username: "初期ユーザー1",
      userAvatarUrl: "https://i.pravatar.cc/150?img=10",
      title: "最初の投稿",
      content: "これは初期データとして追加された投稿です。",
      tags: ["初期", "テスト"],
      timestamp: Date.now() - 10000000,
    },
    {
      id: "init-2",
      userId: "user002",
      username: "初期ユーザー2",
      userAvatarUrl: "https://i.pravatar.cc/150?img=11",
      title: "２番目の投稿",
      content: "これも初期データです。",
      tags: ["スタート"],
      timestamp: Date.now() - 5000000,
    },
  ];

  for (const post of initialPosts) {
    insertPost(post);
  }
}
