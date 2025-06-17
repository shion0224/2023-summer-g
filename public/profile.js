async function loadProfile() {
  try {
    // プロフィール情報を取得
    const res = await fetch("/profile");
    if (!res.ok) {
      throw new Error("プロフィール情報の取得に失敗しました");
    }

    const profile = await res.json();
    document.getElementById("avatar").src = profile.avatarUrl;
    document.getElementById("username").textContent = profile.username;
    document.getElementById("userDetails").textContent = `ユーザーID: ${profile.id}`;

    // ユーザーの投稿を取得
    const postsRes = await fetch("/profile/posts");
    if (!postsRes.ok) {
      throw new Error("投稿情報の取得に失敗しました");
    }

    const posts = await postsRes.json();
    renderPosts(posts);
  } catch (err) {
    console.error(err);
    document.body.innerHTML = `
      <div class="text-center mt-20">
        <p class="text-red-500 font-semibold">データの取得に失敗しました。</p>
        <a href="/index.html" class="text-primary hover:underline">ホームに戻る</a>
      </div>
    `;
  }
}

function renderPosts(posts) {
  const postList = document.getElementById("postList");
  postList.innerHTML = "";

  if (posts.length === 0) {
    postList.innerHTML = `<p class="text-center text-slate-500">投稿がありません。</p>`;
    return;
  }

  posts.forEach((post) => {
    const card = document.createElement("div");
    card.className =
      "bg-white shadow-lg rounded-xl p-5 border border-slate-200 hover:shadow-xl transition-shadow";
    card.innerHTML = `
      <div class="flex items-center mb-3">
        <img src="${post.userAvatarUrl}" alt="${post.username}" class="w-10 h-10 rounded-full mr-3 border-2 border-sky-100" />
        <div>
          <p class="text-sm font-medium text-slate-700">${post.username}</p>
          <p class="text-xs text-slate-500">${timeAgo(post.timestamp)}</p>
        </div>
      </div>
      <h2 class="text-xl font-semibold text-slate-800 mb-2">${post.title}</h2>
      ${post.content ? `<p class="text-sm text-slate-600 mb-3">${post.content}</p>` : ""}
      <div class="flex flex-wrap gap-2">
        ${post.tags
          .map(
            (tag) =>
              `<span class="px-3 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full">#${tag}</span>`
          )
          .join("")}
      </div>
    `;
    postList.appendChild(card);
  });
}

function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

loadProfile();