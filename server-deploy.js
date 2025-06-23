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

// HTMLテンプレート（元のデザインを復元）
const HTML_TEMPLATES = {
  login: `<!DOCTYPE html>
<html lang="ja">
    <head>
        <meta charset="UTF-8" />
        <title>ログイン</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body
        class="bg-gray-100 min-h-screen flex items-center justify-center px-4"
    >
        <div class="bg-white p-6 sm:p-8 rounded-xl shadow-md w-full max-w-md">
            <h2
                class="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800"
            >
                ログイン
            </h2>
            <form action="/login" method="POST" class="space-y-4">
                <div>
                    <label
                        for="username"
                        class="block text-sm font-medium text-gray-700"
                        >ユーザー名</label
                    >
                    <input
                        type="text"
                        id="username"
                        name="username"
                        required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>
                <div>
                    <label
                        for="password"
                        class="block text-sm font-medium text-gray-700"
                        >パスワード</label
                    >
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>
                <button
                    type="submit"
                    class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                >
                    ログイン
                </button>
            </form>
            <p class="mt-4 text-center text-sm text-gray-600">
                アカウントをお持ちでないですか？
                <a href="/register" class="text-blue-500 underline"
                    >新規登録はこちら</a
                >
            </p>
            <!-- エラーメッセージ用のポップアップ -->
            <div
                id="errorPopup"
                class="hidden mt-6 text-red-600 bg-red-100 border border-red-400 px-4 py-3 rounded relative"
                role="alert"
            >
                <strong class="font-bold">ログインに失敗しました！</strong>
            </div>
        </div>

        <script>
            // URLクエリパラメータに ?error=1 があれば表示
            const params = new URLSearchParams(window.location.search);
            if (params.get("error") === "1") {
                document
                    .getElementById("errorPopup")
                    .classList.remove("hidden");
            }
        </script>
    </body>
</html>`,

  register: `<!DOCTYPE html>
<html lang="ja">
    <head>
        <meta charset="UTF-8" />
        <title>ユーザー登録</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body
        class="bg-gray-100 min-h-screen flex items-center justify-center px-4"
    >
        <div class="bg-white p-6 sm:p-8 rounded-xl shadow-md w-full max-w-md">
            <h2
                class="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800"
            >
                新規登録
            </h2>
            <form action="/register" method="POST" class="space-y-4">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                        >アバター画像を選択</label
                    >
                    <div class="flex space-x-4">
                        <label>
                            <input
                                type="radio"
                                name="avatarUrl"
                                value="https://i.pravatar.cc/150?img=5"
                                required
                                class="hidden peer"
                            />
                            <img
                                src="https://i.pravatar.cc/150?img=5"
                                alt="Avatar 5"
                                class="w-16 h-16 rounded-full border-2 border-transparent peer-checked:border-blue-500"
                            />
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="avatarUrl"
                                value="https://i.pravatar.cc/150?img=6"
                                required
                                class="hidden peer"
                            />
                            <img
                                src="https://i.pravatar.cc/150?img=6"
                                alt="Avatar 6"
                                class="w-16 h-16 rounded-full border-2 border-transparent peer-checked:border-blue-500"
                            />
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="avatarUrl"
                                value="https://i.pravatar.cc/150?img=7"
                                required
                                class="hidden peer"
                            />
                            <img
                                src="https://i.pravatar.cc/150?img=7"
                                alt="Avatar 7"
                                class="w-16 h-16 rounded-full border-2 border-transparent peer-checked:border-blue-500"
                            />
                        </label>
                    </div>
                </div>

                <div>
                    <label
                        for="username"
                        class="block text-sm font-medium text-gray-700"
                        >ユーザー名</label
                    >
                    <input
                        type="text"
                        id="username"
                        name="username"
                        required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                    />
                </div>
                <div>
                    <label
                        for="password"
                        class="block text-sm font-medium text-gray-700"
                        >パスワード</label
                    >
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                    />
                </div>
                <button
                    type="submit"
                    class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
                >
                    登録する
                </button>
            </form>
            <p class="mt-4 text-center text-sm text-gray-600">
                すでにアカウントをお持ちですか？
                <a href="/login.html" class="text-blue-500 underline"
                    >ログインページへ</a
                >
            </p>
        </div>
    </body>
</html>`,

  index: `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Sleep Peep</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
            tailwind.config = {
                theme: {
                    extend: {
                        colors: {
                            sky: {
                                50: "#f0f9ff",
                                100: "#e0f2fe",
                                200: "#bae6fd",
                                300: "#7dd3fc",
                                400: "#38bdf8",
                                500: "#0ea5e9",
                                600: "#0284c7",
                                700: "#0369a1",
                                800: "#075985",
                                900: "#0c4a6e",
                            },
                            slate: {
                                50: "#f8fafc",
                                100: "#f1f5f9",
                                200: "#e2e8f0",
                                300: "#cbd5e1",
                                400: "#94a3b8",
                                500: "#64748b",
                                600: "#475569",
                                700: "#334155",
                                800: "#1e293b",
                                900: "#0f172a",
                            },
                            emerald: {
                                50: "#ecfdf5",
                                100: "#d1fae5",
                                200: "#a7f3d0",
                                300: "#6ee7b7",
                                400: "#34d399",
                                500: "#10b981",
                                600: "#059669",
                                700: "#047857",
                                800: "#065f46",
                                900: "#064e3b",
                            },
                        },
                    },
                },
            };
        </script>
    </head>
    <body class="bg-slate-50 font-sans">
        <header class="bg-white shadow-sm sticky top-0 z-50">
            <div class="container mx-auto px-4 py-3 flex justify-between items-center">
                <div class="text-xl font-bold text-sky-600">Sleep Peep</div>
                <div id="userSection" class="flex items-center space-x-3 hidden">
                    <!-- プロフィール画像 -->
                    <a href="./profile.html">
                        <img
                            id="userAvatar"
                            class="w-8 h-8 rounded-full border-2 border-sky-200"
                            alt="User Avatar"
                        />
                    </a>
                    <!-- ユーザー名 -->
                    <span
                        id="userName"
                        class="text-sm text-slate-700 font-medium"
                    ></span>
                    <!-- ユーザー名を表示するためのもの。なんか微妙。 -->
                    <div>{{USERNAME}}</div>
                    <!-- ログアウトボタン -->
                    <button
                        id="logoutButton"
                        class="p-2 rounded-md text-slate-600 hover:bg-slate-100 hover:text-sky-600 transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-5 h-5"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-9A2.25 2.25 0 002.25 5.25v13.5A2.25 2.25 0 004.5 21h9a2.25 2.25 0 002.25-2.25V15M18 12h.008v.008H18v-.008zm-3-3l6 6m0 0l-6 6m6-6H9"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </header>

        <main class="container mx-auto px-4 py-6">
            <div id="loading" class="flex justify-center items-center h-64">
                <div
                    class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-sky-500"
                ></div>
            </div>
            <div id="error" class="hidden text-center text-red-500 py-10"></div>
            <div id="empty" class="hidden text-center text-slate-500 py-10">
                No posts yet. Be the first to create one!
            </div>
            <div
                id="postList"
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 md:p-6 hidden"
            ></div>
        </main>

        <footer
            class="text-center py-4 text-sm text-slate-500 border-t border-slate-200 bg-white"
        >
            &copy; <span id="year"></span> Modern Post Feed. All rights
            reserved.
        </footer>

        <button
            id="fab"
            class="fixed bottom-8 right-8 bg-sky-500 hover:bg-sky-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform duration-150 ease-in-out hover:scale-105 z-40"
            aria-label="Create new post"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewbox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-7 h-7"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                />
            </svg>
        </button>

        <script>
            // APIにPOSTリクエストを送信する関数
            async function insertPost(post) {
              await fetch("/posts", {
                method: "POST", // HTTPメソッドをPOSTに設定
                headers: { "Content-Type": "application/json" }, // JSON形式でデータを送信
                body: JSON.stringify(post), // オブジェクトをJSON文字列に変換して送信
              });
            }

            // ログアウトボタンのクリックイベントを設定
            document.getElementById("logoutButton").addEventListener("click", () => {
              location.href = "/logout"; // ログアウトページにリダイレクト
            });

            // 時間を「○秒前」「○分前」などの形式で表示する関数
            function timeAgo(timestamp) {
              const seconds = Math.floor((Date.now() - timestamp) / 1000); // 現在時刻との差を秒で計算
              if (seconds < 60) return \`\${seconds}s ago\`; // 60秒未満の場合
              const minutes = Math.floor(seconds / 60);
              if (minutes < 60) return \`\${minutes}m ago\`; // 60分未満の場合
              const hours = Math.floor(minutes / 60);
              if (hours < 24) return \`\${hours}h ago\`; // 24時間未満の場合
              const days = Math.floor(hours / 24);
              return \`\${days}d ago\`; // それ以上の場合
            }

            // 投稿リストを描画する関数
            function renderPosts(posts) {
              const list = document.getElementById("postList"); // 投稿リストのDOM要素を取得
              list.innerHTML = ''; // リストを初期化
              posts.forEach(post => {
                const card = document.createElement("div"); // 投稿カードを作成
                card.className = "bg-white shadow-lg rounded-xl p-5 border border-slate-200 hover:shadow-xl transition-shadow";
                card.innerHTML = \`
                  <div class="flex items-center mb-3">
                    <img src="\${post.userAvatarUrl}" alt="\${post.username}" class="w-10 h-10 rounded-full mr-3 border-2 border-sky-100" />
                    <div>
                      <p class="text-sm font-medium text-slate-700">\${post.username}</p>
                      <p class="text-xs text-slate-500">\${timeAgo(post.timestamp)}</p>
                    </div>
                  </div>
                  <h2 class="text-xl font-semibold text-slate-800 mb-2">\${post.title}</h2>
                  \${post.content ? \`<p class="text-sm text-slate-600 mb-3">\${post.content}</p>\` : ''}
                  <div class="flex flex-wrap gap-2">
                    \${post.tags.map(tag => \`<span class="px-3 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full">#\${tag}</span>\`).join('')}
                  </div>
                \`;
                list.appendChild(card); // 投稿カードをリストに追加
              });
            }

            // ユーザー情報を表示する関数
            function showUser(user) {
              const section = document.getElementById("userSection"); // ユーザーセクションのDOM要素を取得
              document.getElementById("userAvatar").src = user.avatarUrl; // ユーザーのアバター画像を設定
              console.log("User Avatar URL:", user); // デバッグ用にアバターURLを表示
              document.getElementById("userName").textContent = user.username; // ユーザー名を設定
              section.classList.remove("hidden"); // セクションを表示
            }

            // 投稿モーダルを開く関数
            function openModal() {
              const modal = document.createElement("div"); // モーダル要素を作成
              modal.id = "postModal";
              modal.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
              modal.innerHTML = \`
                <div class="bg-white p-6 rounded-md w-full max-w-md">
                  <h2 class="text-xl font-bold mb-4">新しい投稿</h2>
                  <form id="postForm" class="space-y-4">
                    <input type="text" id="postTitle" placeholder="タイトル" class="w-full px-3 py-2 border rounded-md" required />
                    <textarea id="postContent" placeholder="夢の内容" class="w-full px-3 py-2 border rounded-md"></textarea>
                    <input type="text" id="postTags" placeholder="タグ（カンマ区切り）" class="w-full px-3 py-2 border rounded-md" />
                    <div class="flex justify-end space-x-2">
                      <button type="button" id="cancelModal" class="px-4 py-2 bg-slate-200 rounded">キャンセル</button>
                      <button type="submit" class="px-4 py-2 bg-sky-500 text-white rounded">投稿</button>
                    </div>
                  </form>
                </div>
              \`;
              document.body.appendChild(modal); // モーダルをDOMに追加

              // キャンセルボタンのイベントリスナー
              document.getElementById("cancelModal").addEventListener("click", () => {
                modal.remove(); // モーダルを削除
              });

              // 投稿フォームの送信イベント
              document.getElementById("postForm").addEventListener("submit", async (e) => {
                e.preventDefault(); // デフォルトのフォーム送信を防止
                const title = document.getElementById("postTitle").value;
                const content = document.getElementById("postContent").value;
                const tags = document.getElementById("postTags").value.split(',').map(t => t.trim()).filter(t => t);

                const newPost = {
                  title,
                  content,
                  tags,
                };

                try {
                  const res = await fetch("/posts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newPost),
                  });

                  if (!res.ok) {
                    throw new Error("投稿に失敗しました");
                  }

                  const result = await res.json();
                  document.getElementById("empty").classList.add("hidden");
                  document.getElementById("postList").classList.remove("hidden");
                  renderPosts([result.post, ...window.loadedPosts]); // 新しい投稿をリストに追加
                  window.loadedPosts.unshift(result.post);
                } catch (err) {
                  alert("投稿に失敗しました");
                  console.error(err);
                }

                document.getElementById("postModal").remove(); // モーダルを閉じる
              });
            }

            // 初期化関数
            async function init() {
              document.getElementById("year").textContent = new Date().getFullYear(); // 現在の年を表示
              // 現在ログインしているユーザー情報を取得して表示
              try {
                const res = await fetch("/currentUser");
                if (!res.ok) throw new Error("ユーザー情報の取得に失敗しました");
                const user = await res.json();
                showUser(user); // ログインしているユーザー情報を表示
              } catch (err) {
                console.error(err);
                alert("ユーザー情報の取得に失敗しました");
              }

              const loading = document.getElementById("loading");
              const error = document.getElementById("error");
              const empty = document.getElementById("empty");
              const list = document.getElementById("postList");

              // 投稿データを非同期で取得
              setTimeout(async () => {
                try {
                  const res = await fetch("/posts");
                  if (!res.ok) throw new Error("投稿取得に失敗しました");
                  const posts = await res.json();
                  window.loadedPosts = posts; // 投稿データをグローバル変数に保存
                  loading.classList.add("hidden"); // ローディングを非表示
                  if (posts.length === 0) {
                    empty.classList.remove("hidden"); // 投稿がない場合は空メッセージを表示
                  } else {
                    list.classList.remove("hidden"); // 投稿リストを表示
                    renderPosts(posts); // 投稿を描画
                  }
                } catch (err) {
                  loading.classList.add("hidden");
                  error.classList.remove("hidden"); // エラーメッセージを表示
                  console.error(err);
                }
              }, 1000);

              // フローティングアクションボタンのクリックイベント
              document.getElementById("fab").addEventListener("click", () => {
                openModal(); // 投稿モーダルを開く
              });
            }

            document.addEventListener("DOMContentLoaded", init);
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