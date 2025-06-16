// public/index.js

const MOCK_USER = {
  id: 'user123',
  name: 'Jane Doe',
  avatarUrl: 'https://i.pravatar.cc/150?img=3'
};

const MOCK_POSTS = [
  {
    id: '1',
    userId: 'user1',
    username: 'Alice Wonderland',
    userAvatarUrl: 'https://picsum.photos/seed/alice/40/40',
    title: 'Tailwind CSS v4: 新機能紹介',
    tags: ['tailwindcss', 'css', 'webdev'],
    timestamp: Date.now() - 1000 * 60 * 60
  },
  {
    id: '2',
    userId: 'user2',
    username: 'Bob Builder',
    userAvatarUrl: 'https://picsum.photos/seed/bob/40/40',
    title: 'Denoを使ったAPI構築入門',
    tags: ['deno', 'api', 'backend'],
    timestamp: Date.now() - 1000 * 60 * 60 * 3
  }
];

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

function renderPosts(posts) {
  const list = document.getElementById("postList");
  list.innerHTML = '';
  posts.forEach(post => {
    const card = document.createElement("div");
    card.className = "bg-white shadow-lg rounded-xl p-5 border border-slate-200 hover:shadow-xl transition-shadow";
    card.innerHTML = `
      <div class="flex items-center mb-3">
        <img src="${post.userAvatarUrl}" alt="${post.username}" class="w-10 h-10 rounded-full mr-3 border-2 border-sky-100" />
        <div>
          <p class="text-sm font-medium text-slate-700">${post.username}</p>
          <p class="text-xs text-slate-500">${timeAgo(post.timestamp)}</p>
        </div>
      </div>
      <h2 class="text-xl font-semibold text-slate-800 mb-3">${post.title}</h2>
      <div class="flex flex-wrap gap-2">
        ${post.tags.map(tag => `<span class="px-3 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full">#${tag}</span>`).join('')}
      </div>
    `;
    list.appendChild(card);
  });
}

function showUser(user) {
  const section = document.getElementById("userSection");
  document.getElementById("userAvatar").src = user.avatarUrl;
  document.getElementById("userName").textContent = user.name;
  section.classList.remove("hidden");
  document.getElementById("logoutButton").addEventListener("click", () => {
    alert("ログアウトしました（モック）");
  });
}

function init() {
  document.getElementById("year").textContent = new Date().getFullYear();
  showUser(MOCK_USER);

  const loading = document.getElementById("loading");
  const error = document.getElementById("error");
  const empty = document.getElementById("empty");
  const list = document.getElementById("postList");

  setTimeout(() => {
    loading.classList.add("hidden");
    if (MOCK_POSTS.length === 0) {
      empty.classList.remove("hidden");
    } else {
      list.classList.remove("hidden");
      renderPosts(MOCK_POSTS);
    }
  }, 1000);

  document.getElementById("fab").addEventListener("click", () => {
    alert("投稿作成モーダルを表示（未実装）");
  });
  console.log("aaa")
}

document.addEventListener("DOMContentLoaded", init);
