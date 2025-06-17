import { serve } from "https://deno.land/std@0.194.0/http/server.ts?s=serve";
import { serveDir } from "https://deno.land/std@0.194.0/http/file_server.ts?s=serveDir";
import { insertPost, getAllPosts, insertUser, findUserByUsername } from "./public/utils/db.ts";

// Cookie取得関数
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

  // ----- 投稿の登録 -----
  if (req.method === "POST" && pathname === "/posts") {
    try {
      const reqJson = await req.json();
      if (!reqJson.title || !reqJson.content || !reqJson.username) {
        return new Response("Missing required fields", { status: 400 });
      }

      const newPost = {
        id: crypto.randomUUID(),
        userId: reqJson.userId || "anonymous",
        username: reqJson.username,
        userAvatarUrl: reqJson.userAvatarUrl || "https://i.pravatar.cc/150?img=1",
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

  // ----- 投稿の取得 -----
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

  if (req.method === "POST" && pathname === "/login") {
    const form = await req.formData();
    const username = form.get("username")?.toString();
    const password = form.get("password")?.toString();
  
    const user = findUserByUsername(username);
    if (!user || user.password !== password) {
      // ✨ ポップアップ表示のためにクエリ付きでリダイレクト
      return new Response(null, {
        status: 303,
        headers: {
          Location: "/login.html?error=1",
        },
      });
    }
  
    return new Response(null, {
      status: 303,
      headers: {
        "Set-Cookie": "auth=true; Path=/; SameSite=Lax",
        "Location": "/index.html",
      },
    });
  }
  
  
  

  // ----- 登録ページ表示 -----
  if (req.method === "GET" && pathname === "/register") {
    const html = await Deno.readTextFile("./public/register.html");
    console.log("✅ GET /register arrived");
    return new Response(html, { headers: { "Content-Type": "text/html" } });
  }

  // ----- 登録処理 -----
  if (req.method === "POST" && pathname === "/register") {
    const form = await req.formData();
    console.log("register done!!!!!!!!!!")
    const username = form.get("username")?.toString();
    const password = form.get("password")?.toString();

    if (!username || !password) {
      return new Response("Missing username or password", { status: 400 });
    }

    const existing = findUserByUsername(username);
    if (existing) {
      return new Response("ユーザー名はすでに使用されています。", { status: 400 });
    }

    insertUser(username, password);
    return new Response(null, {
      status: 303,
      headers: {
        "Set-Cookie": "auth=true; Path=/; SameSite=Lax",
        "Location": "/index.html",
      },
    });
  }

  // ----- index.html にアクセスする場合は Cookie チェック -----
  if (pathname === "/index.html") {
    const cookies = getCookies(req);
    if (cookies.auth !== "true") {
      return new Response(null, {
        status: 303,
        headers: { Location: "/login.html" },
      });
    }
  }

    // ✅ ✅ ✅ 保護された `/index.html` の処理
    if (req.method === "GET" && pathname === "/index.html") {
      const cookies = getCookies(req);
      if (cookies.auth !== "true") {
        return new Response(null, {
          status: 303,
          headers: { Location: "/login.html" },
        });
      }
  
      const html = await Deno.readTextFile("./public/index.html");
      return new Response(html, { headers: { "Content-Type": "text/html" } });
    }

  // ----- 静的ファイル配信 -----
  return serveDir(req, {
    fsRoot: "./public",
    urlRoot: "",
    showDirListing: true,
  });
});
