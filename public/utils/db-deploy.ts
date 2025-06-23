// Deno Deploy用のインメモリデータベース
// ファイルシステムにアクセスできないため、メモリ内でデータを管理

interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatarUrl: string;
  title: string;
  content: string;
  tags: string[];
  timestamp: number;
}

interface User {
  id: string;
  username: string;
  password: string;
  avatarUrl: string;
}

// インメモリデータストア
let posts: Post[] = [];
let users: User[] = [];

// 初期データ
const initialPosts: Post[] = [
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

// 初期ユーザー
const initialUsers: User[] = [
  {
    id: "user001",
    username: "初期ユーザー1",
    password: "password123",
    avatarUrl: "https://i.pravatar.cc/150?img=10",
  },
  {
    id: "user002",
    username: "初期ユーザー2",
    password: "password123",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
  },
];

// 初期化
function initializeData() {
  if (posts.length === 0) {
    posts = [...initialPosts];
  }
  if (users.length === 0) {
    users = [...initialUsers];
  }
}

// 投稿の追加
export function insertPost(post: Post) {
  initializeData();
  posts.push(post);
}

// 投稿の取得
export function getAllPosts(): Post[] {
  initializeData();
  return posts.sort((a, b) => b.timestamp - a.timestamp);
}

// ユーザー登録
export function insertUser(username: string, password: string, avatarUrl: string) {
  initializeData();
  const newUser: User = {
    id: crypto.randomUUID(),
    username,
    password,
    avatarUrl: avatarUrl || "https://i.pravatar.cc/150?img=1",
  };
  users.push(newUser);
}

// ユーザー名検索
export function findUserByUsername(username: string): User | null {
  initializeData();
  return users.find(user => user.username === username) || null;
}

// ユーザーID検索
export function findUserById(id: string): User | null {
  initializeData();
  return users.find(user => user.id === id) || null;
}

// 初期データ投入（既存のAPIとの互換性のため）
export function seedInitialPosts() {
  initializeData();
} 