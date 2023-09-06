window.onload = async () => {
  /**
   * /index.htmlでの処理
   */
  if (
    window.location.pathname === "/" ||
    window.location.pathname === "/index.html"
  ) {
    try {
      const response = await fetch("/dreams");
      const titles = await response.text();
      const titlearray = titles.split(",");
      console.log(titlearray);
      const parentDiv = document.getElementById("get-contents");
      for (let i = 1; i <= 5; i++) {
        // dreams1, dreams2, ... のようなdiv要素を作成
        const dreamDiv = document.createElement("div");
        dreamDiv.setAttribute("id", `dreams`);
        parentDiv.appendChild(dreamDiv);

        // dream-title1, dream-title2, ... のようなdiv要素をdreamDivの子要素として作成
        const dreamTitleDiv = document.createElement("div");
        dreamTitleDiv.setAttribute("id", `dream-title${i}`);
        dreamTitleDiv.textContent = `This is dream title ${i}`; // サンプルテキスト
        dreamDiv.appendChild(dreamTitleDiv);

        // dream-content1, dream-content2, ... のようなdiv要素をdreamDivの子要素として作成
        const dreamContentDiv = document.createElement("div");
        dreamContentDiv.setAttribute("id", `dream-content${i}`);
        dreamContentDiv.textContent = `This is dream content ${i}`; // サンプルテキスト
        dreamDiv.appendChild(dreamContentDiv);
        dreamDiv.onclick = async () => {
          localStorage.setItem("dream_id", 51);
          window.location.href = `./post-detail.html`;
        };
      }
    } catch (error) {
      console.error("Error fetching from /post:", error);
    }
  }

  if (window.location.pathname === "/post-detail.html") {
    try {
      const response = await fetch("/dream-title");
      document.getElementById("dream-title").innerText = await response.text();
    } catch (error) {
      console.error("Error fetching from /dream-title:", error);
    }

    try {
      const response = await fetch("/dream-content");
      document.getElementById("dream-content").innerText =
        await response.text();
    } catch (error) {
      console.error("Error fetching from /dream-title:", error);
    }
  }
};

// document.getElementById("fetch-dreams-button").onclick = async () => {
//   try {
//     const response = await fetch("/dreams");
//     const dreams = await response.json();
//     console.log(dreams);
//     const userIds = dreams.map((dream) => dream.title);
//     document.getElementById("dreams-container").innerText = userIds.join(", ");
//   } catch (error) {
//     console.error("Error fetching dreams:", error);
//   }
// };
