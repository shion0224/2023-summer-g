window.onload = async () => {
  try {
    const response = await fetch("/dreams");

    const parentDiv = document.getElementById("get-contents");

    for (let i = 1; i <= 10; i++) {
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
    }

  } catch (error) {
    console.error("Error fetching from /post:", error);
  }

  // try {
  //   const response = await fetch("/dream-title");
  //   document.getElementById("dream-title").innerText = await response.text();
  // } catch (error) {
  //   console.error("Error fetching from /dream-title:", error);
  // }

  // try {
  //   const response = await fetch("/dream-content");
  //   document.getElementById("dream-content").innerText = await response.text();
  // } catch (error) {
  //   console.error("Error fetching from /dream-title:", error);
  // }
};

document.getElementById("post-button").onclick = async () => {
  const contents = document.getElementById("post-contents").value;
  const titles = document.getElementById("post-titles").value;

  try {
    const response = await fetch("/dreams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        { contents: contents, titles: titles },
      ),
    });
    document.getElementById("test").innerText = await response.text();
  } catch (error) {
    console.error("Error posting dream:", error);
  }
};
