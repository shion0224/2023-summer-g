window.onload = async () => {
  // ログインする必要があるならログイン画面へ
  // const did = localStorage.getItem('did')
  // if (!did) {
  //   window.location.href = '/login.html'
  //   return
  // }

  /**
   * /index.htmlでの処理
   */
  if (
    window.location.pathname === "/" ||
    window.location.pathname === "/index.html"
  ) {
    localStorage.removeItem("dream_id");
    try {
      const response = await fetch("/dreams");

      const result = await response.text();
      const data = JSON.parse(result);

      const parentDiv = document.getElementById("get-contents");
      for (let i = 0; i < data.length; i++) {
        // dreams1, dreams2, ... のようなdiv要素を作成
        const dreamDiv = document.createElement("div");
        dreamDiv.setAttribute("class", `dreams`);
        parentDiv.appendChild(dreamDiv);

        // dream-title1, dream-title2, ... のようなdiv要素をdreamDivの子要素として作成
        const dreamTitleDiv = document.createElement("div");
        dreamTitleDiv.setAttribute("id", `dream-title${i}`);
        dreamTitleDiv.textContent = data[i].title; // タイトル名を挿入
        dreamDiv.appendChild(dreamTitleDiv);

        const dreamTagDiv = document.createElement("div");
        dreamTagDiv.setAttribute("id", `dream-tag-detail${i}`);
        // 「ファンタジー, 恋愛, コメディー, その他」の文字を「#ファンタジー #恋愛 #コメディー その他」に変換
        const tagsString = data[i].tag
          .split(',')
          .map(tag => tag.trim())
          .map(tag => tag === 'その他' ? tag : `#${tag}`)
          .join(' ');
        dreamTagDiv.textContent = tagsString; // Tagを挿入
        dreamDiv.appendChild(dreamTagDiv);

        // dream-content1, dream-content2, ... のようなdiv要素をdreamDivの子要素として作成
        // const dreamContentDiv = document.createElement("div");
        // dreamContentDiv.setAttribute("id", `dream-content${i}`);
        // dreamContentDiv.textContent = data[i].content; // 夢の内容を挿入
        // dreamDiv.appendChild(dreamContentDiv);
        dreamDiv.onclick = async () => {
          localStorage.setItem("dream_id", data[i].dream_id);
          console.log(data[i].dream_id);
          window.location.href = `./post-detail.html`;
        };
      }
    } catch (error) {
      console.error("Error fetching from /post:", error);
    }
  }
};
