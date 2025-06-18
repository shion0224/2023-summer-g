import { serve } from "https://deno.land/std@0.194.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.194.0/http/file_server.ts";
import {
  insertPost,
  getAllPosts,
  insertUser,
  findUserByUsername,
  findUserById, 
} from "./public/utils/db.ts";

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
    const html = await Deno.readTextFile("./public/register.html");
    return new Response(html, { headers: { "Content-Type": "text/html" } });
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

    let html = await Deno.readTextFile("./public/index.html");
    html = html.replaceAll("{{USERNAME}}", user.username);

    return new Response(html, { headers: { "Content-Type": "text/html" } });
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

  // ユーザーの投稿を取得
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
