import { serve } from "https://deno.land/std@0.194.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.194.0/http/file_server.ts";
import {
  insertPost,
  getAllPosts,
  insertUser,
  findUserByUsername,
  findUserById, 
} from "./public/utils/db-deploy.ts";

// Cookie取得ユーティリティ
function getCookies(req) {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [key, ...rest] = c.trim().split("=");
      return [key, rest.join("=")];
    }),
  );
}

// HTMLテンプレート（Deno Deployではファイル読み込みが制限されるため）
const HTML_TEMPLATES = {
  login: `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ログイン</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 400px; margin: 50px auto; padding: 20px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; }
        input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        button { width: 100%; padding: 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #0056b3; }
        .error { color: red; margin-top: 10px; }
        .register-link { text-align: center; margin-top: 15px; }
    </style>
</head>
<body>
    <h2>ログイン</h2>
    <form action="/login" method="POST">
        <div class="form-group">
            <label for="username">ユーザー名:</label>
            <input type="text" id="username" name="username" required>
        </div>
        <div class="form-group">
            <label for="password">パスワード:</label>
            <input type="password" id="password" name="password" required>
        </div>
        <button type="submit">ログイン</button>
    </form>
    <div class="register-link">
        <a href="/register">新規登録</a>
    </div>
</body>
</html>`,

  register: `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ユーザー登録</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 400px; margin: 50px auto; padding: 20px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; }
        input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        button { width: 100%; padding: 10px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #218838; }
        .login-link { text-align: center; margin-top: 15px; }
    </style>
</head>
<body>
    <h2>ユーザー登録</h2>
    <form action="/register" method="POST">
        <div class="form-group">
            <label for="username">ユーザー名:</label>
            <input type="text" id="username" name="username" required>
        </div>
        <div class="form-group">
            <label for="password">パスワード:</label>
            <input type="password" id="password" name="password" required>
        </div>
        <div class="form-group">
            <label for="avatarUrl">アバターURL (オプション):</label>
            <input type="url" id="avatarUrl" name="avatarUrl" placeholder="https://example.com/avatar.jpg">
        </div>
        <button type="submit">登録</button>
    </form>
    <div class="login-link">
        <a href="/login.html">ログインに戻る</a>
    </div>
</body>
</html>`,

  index: `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>投稿アプリ</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .post-form { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input, textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        textarea { height: 100px; resize: vertical; }
        button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #0056b3; }
        .post { background: white; border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 15px; }
        .post-header { display: flex; align-items: center; margin-bottom: 10px; }
        .avatar { width: 40px; height: 40px; border-radius: 50%; margin-right: 10px; }
        .post-meta { color: #666; font-size: 0.9em; }
        .tags { margin-top: 10px; }
        .tag { background: #e9ecef; padding: 2px 8px; border-radius: 12px; font-size: 0.8em; margin-right: 5px; }
        .logout { background: #dc3545; }
        .logout:hover { background: #c82333; }
    </style>
</head>
<body>
    <div class="header">
        <h1>投稿アプリ</h1>
        <div>
            <span>ようこそ、{{USERNAME}}さん！</span>
            <a href="/logout"><button class="logout">ログアウト</button></a>
        </div>
    </div>

    <div class="post-form">
        <h3>新しい投稿</h3>
        <form id="postForm">
            <div class="form-group">
                <label for="title">タイトル:</label>
                <input type="text" id="title" name="title" required>
            </div>
            <div class="form-group">
                <label for="content">内容:</label>
                <textarea id="content" name="content" required></textarea>
            </div>
            <div class="form-group">
                <label for="tags">タグ (カンマ区切り):</label>
                <input type="text" id="tags" name="tags" placeholder="技術,プログラミング,Deno">
            </div>
            <button type="submit">投稿</button>
        </form>
    </div>

    <div id="posts"></div>

    <script>
        // 投稿フォームの処理
        document.getElementById('postForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const tags = formData.get('tags') ? formData.get('tags').split(',').map(t => t.trim()) : [];
            
            try {
                const response = await fetch('/posts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: formData.get('title'),
                        content: formData.get('content'),
                        tags: tags
                    })
                });
                
                if (response.ok) {
                    e.target.reset();
                    loadPosts();
                } else {
                    alert('投稿に失敗しました');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('投稿に失敗しました');
            }
        });

        // 投稿の読み込み
        async function loadPosts() {
            try {
                const response = await fetch('/posts');
                const posts = await response.json();
                
                const postsContainer = document.getElementById('posts');
                postsContainer.innerHTML = posts.map(post => \`
                    <div class="post">
                        <div class="post-header">
                            <img src="\${post.userAvatarUrl}" alt="Avatar" class="avatar">
                            <div>
                                <strong>\${post.username}</strong>
                                <div class="post-meta">\${new Date(post.timestamp).toLocaleString()}</div>
                            </div>
                        </div>
                        <h3>\${post.title}</h3>
                        <p>\${post.content}</p>
                        \${post.tags.length > 0 ? \`<div class="tags">\${post.tags.map(tag => \`<span class="tag">\${tag}</span>\`).join('')}</div>\` : ''}
                    </div>
                \`).join('');
            } catch (error) {
                console.error('Error loading posts:', error);
            }
        }

        // 初期読み込み
        loadPosts();
    </script>
</body>
</html>`
};

serve(async (req) => {
  const { pathname } = new URL(req.url);
  console.log("📥 Request:", pathname);

  // 投稿登録
  if (req.method === "POST" && pathname === "/posts") {
    try {
      const cookies = getCookies(req);
      const userId = cookies.userId;

      if (!userId) {
        return new Response("Unauthorized", { status: 401 });
      }

      const user = findUserById(userId);
      if (!user) {
        return new Response("User not found", { status: 404 });
      }

      const reqJson = await req.json();
      if (!reqJson.title || !reqJson.content) {
        return new Response("Missing required fields", { status: 400 });
      }

      const newPost = {
        id: crypto.randomUUID(),
        userId: user.id,
        username: user.username,
        userAvatarUrl: user.avatarUrl,
        title: reqJson.title,
        content: reqJson.content,
        tags: reqJson.tags || [],
        timestamp: Date.now(),
      };

      insertPost(newPost);

      return new Response(JSON.stringify({ message: "Post created", post: newPost }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.error(e);
      return new Response("Failed to insert post", { status: 500 });
    }
  }

  // 投稿取得
  if (req.method === "GET" && pathname === "/posts") {
    try {
      const posts = getAllPosts();
      return new Response(JSON.stringify(posts), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.error(e);
      return new Response("Failed to retrieve posts", { status: 500 });
    }
  }

  // ログイン
  if (req.method === "POST" && pathname === "/login") {
    const form = await req.formData();
    const username = form.get("username")?.toString().trim();
    const password = form.get("password")?.toString().trim();

    const user = findUserByUsername(username);
    console.log("🔍 ログイン試行:", username, password);
    console.log("🔍 見つかったユーザー:", user);

    if (!user || user.password !== password) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/login.html?error=1" },
      });
    }

    const headers = new Headers();
    headers.append("Set-Cookie", "auth=true; Path=/; SameSite=Lax");
    headers.append("Set-Cookie", `userId=${user.id}; Path=/; SameSite=Lax`);
    headers.set("Location", "/index.html");

    return new Response(null, {
      status: 303,
      headers,
    });
  }

  // ログアウト
  if (req.method === "GET" && pathname === "/logout") {
    return new Response(null, {
      status: 303,
      headers: {
        "Set-Cookie": [
          "auth=; Max-Age=0; Path=/",
          "userId=; Max-Age=0; Path=/",
        ],
        "Location": "/login.html",
      },
    });
  }

  // 登録画面表示
  if (req.method === "GET" && pathname === "/register") {
    return new Response(HTML_TEMPLATES.register, { headers: { "Content-Type": "text/html" } });
  }

  // 登録処理
  if (req.method === "POST" && pathname === "/register") {
    const form = await req.formData();
    const username = form.get("username")?.toString();
    const password = form.get("password")?.toString();

    if (!username || !password) {
      return new Response("Missing username or password", { status: 400 });
    }

    const existing = findUserByUsername(username);
    if (existing) {
      return new Response("ユーザー名はすでに使用されています。", { status: 400 });
    }
    const avatarUrl = form.get("avatarUrl")?.toString().trim();
    insertUser(username, password, avatarUrl);
    const user = findUserByUsername(username);

    return new Response(null, {
      status: 303,
      headers: {
        "Set-Cookie": [
          "auth=true; Path=/; SameSite=Lax",
          `userId=${user.id}; Path=/; SameSite=Lax`,
        ],
        "Location": "/login.html",
      },
    });
  }

  // / → /index.html へリダイレクト
  if (req.method === "GET" && pathname === "/") {
    return new Response(null, {
      status: 303,
      headers: { Location: "/index.html" },
    });
  }

  // 認証付き index.html 表示処理
  if (req.method === "GET" && pathname === "/index.html") {
    const cookies = getCookies(req);
    console.log("🔍 Cookie:", cookies);

    if (cookies.auth !== "true" || !cookies.userId) {
      console.log("🔒 認証されていない → /login.html にリダイレクト");
      return new Response(null, {
        status: 303,
        headers: { Location: "/login.html" },
      });
    }

    const user = findUserById(cookies.userId);
    if (!user) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/login.html" },
      });
    }

    let html = HTML_TEMPLATES.index.replaceAll("{{USERNAME}}", user.username);
    return new Response(html, { headers: { "Content-Type": "text/html" } });
  }

  // ログイン画面表示
  if (req.method === "GET" && pathname === "/login.html") {
    return new Response(HTML_TEMPLATES.login, { headers: { "Content-Type": "text/html" } });
  }

  // プロフィール取得
  if (req.method === "GET" && pathname === "/profile") {
    const cookies = getCookies(req);
    const userId = cookies.userId;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = findUserById(userId);
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    return new Response(JSON.stringify({
      id: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
    }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // プロフィールの投稿取得
  if (req.method === "GET" && pathname === "/profile/posts") {
    const cookies = getCookies(req);
    const userId = cookies.userId;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const posts = getAllPosts().filter((post) => post.userId === userId);
    return new Response(JSON.stringify(posts), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // 現在ログインしているユーザー情報を取得
  if (req.method === "GET" && pathname === "/currentUser") {
    const cookies = getCookies(req);
    if (!cookies.auth || !cookies.userId) {
      return new Response("Not authenticated", { status: 401 });
    }

    const user = findUserById(cookies.userId);
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    return new Response(JSON.stringify(user), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // 静的ファイル配信
  return serveDir(req, {
    fsRoot: "./public",
    urlRoot: "",
    showDirListing: true,
  });
}); 