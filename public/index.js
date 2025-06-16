// public/index.js

import { insertPost } from '../utils/db.ts';

const MOCK_USER = {
  id: 'user123',
  name: 'Jane Doe',
  avatarUrl: 'https://i.pravatar.cc/150?img=3'
};

const MOCK_POSTS = [];

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
      <h2 class="text-xl font-semibold text-slate-800 mb-2">${post.title}</h2>
      ${post.content ? `<p class="text-sm text-slate-600 mb-3">${post.content}</p>` : ''}
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

function openModal() {
  const modal = document.createElement("div");
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
  document.body.appendChild(modal);

  document.getElementById("cancelModal").addEventListener("click", () => {
    modal.remove();
  });

  document.getElementById("postForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("postTitle").value;
    const content = document.getElementById("postContent").value;
    const tags = document.getElementById("postTags").value.split(',').map(t => t.trim()).filter(t => t);
    const newPost = {
      id: String(Date.now()),
      userId: MOCK_USER.id,
      username: MOCK_USER.name,
      userAvatarUrl: MOCK_USER.avatarUrl,
      title,
      content,
      tags,
      timestamp: Date.now()
    };
    MOCK_POSTS.unshift(newPost);
    renderPosts(MOCK_POSTS);
    document.getElementById("empty").classList.add("hidden");
    document.getElementById("postList").classList.remove("hidden");
    await insertPost(newPost); // Denoサーバーへ送信する例（要実装）
    modal.remove();
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
    openModal();
  });
}

document.addEventListener("DOMContentLoaded", init);
