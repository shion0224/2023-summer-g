// public/index.js

// APIにPOSTリクエストを送信する関数
export async function insertPost(post) {
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
  if (seconds < 60) return `${seconds}s ago`; // 60秒未満の場合
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`; // 60分未満の場合
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`; // 24時間未満の場合
  const days = Math.floor(hours / 24);
  return `${days}d ago`; // それ以上の場合
}

// 投稿リストを描画する関数
function renderPosts(posts) {
  const list = document.getElementById("postList"); // 投稿リストのDOM要素を取得
  list.innerHTML = ''; // リストを初期化
  posts.forEach(post => {
    const card = document.createElement("div"); // 投稿カードを作成
    card.className = "bg-white shadow-lg rounded-xl p-5 border border-slate-200 hover:shadow-xl transition-shadow";
    card.innerHTML = `
      <div class="flex items-center mb-3">
        <img src="${post.userAvatarUrl}" alt="${post.username}" class="w-10 h-10 rounded-full mr-3 border-2 border-sky-100" />
        <div>
          <p class="text-sm font-medium text-slate-700">${post.username}</p>
          <p class="text-xs text-slate-500">${timeAgo(post.timestamp)}</p>
        </div>
      </div>
      <h2 class="text-xl font-semibold text-slate-800 mb-2">${post.title}</h2>
      ${post.content ? `<p class="text-sm text-slate-600 mb-3">${post.content}</p>` : ''}
      <div class="flex flex-wrap gap-2">
        ${post.tags.map(tag => `<span class="px-3 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full">#${tag}</span>`).join('')}
      </div>
    `;
    list.appendChild(card); // 投稿カードをリストに追加
  });
}

// ユーザー情報を表示する関数
function showUser(user) {
  const section = document.getElementById("userSection"); // ユーザーセクションのDOM要素を取得
  document.getElementById("userAvatar").src = user.avatarUrl; // ユーザーのアバター画像を設定
  console.log("User Avatar URL:", user); // デバッグ用にアバターURLを表示
  document.getElementById("userName").textContent = user.name; // ユーザー名を設定
  section.classList.remove("hidden"); // セクションを表示
}

// 投稿モーダルを開く関数
function openModal() {
  const modal = document.createElement("div"); // モーダル要素を作成
  modal.id = "postModal";
  modal.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
  modal.innerHTML = `
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
  `;
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
