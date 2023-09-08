window.onload = async () => {
  try {
    const response = await fetch("/profile");
    const data = await response.json(); // response.text()をresponse.json()に変更

    const postContainer = document.querySelector(".post-container");

    for (let i = 0; i < data.length; i++) {
      // data.lengthをチェックしてindexが範囲外にならないようにする
    if (localStorage.getItem("did") === data[i].did) {
        const postDiv = document.createElement("div");
        postDiv.className = `dreams`;

        const postTitleDiv = document.createElement("div");
        postTitleDiv.id = `profile-post-title${i}`;
        postTitleDiv.innerText = data[i].title; // titleをdiv要素の中身に設定
        postTitleDiv.style.wordBreak = "break-word";
        postDiv.appendChild(postTitleDiv);

        const postTagDetailDiv = document.createElement("div");
        postTagDetailDiv.id = `profile-post-tag${i}`;
        postTagDetailDiv.innerText = data[i].tag; // tagをdiv要素の中身に設定
        postDiv.appendChild(postTagDetailDiv);

        postContainer.appendChild(postDiv);

        postDiv.onclick = async () => {
            localStorage.setItem("dream_id", data[i].dream_id);
            console.log(data[i].dream_id);
            window.location.href = `./post-detail.html`;
        };
    }
    }
    } catch (error) {
        console.error("Error fetching from /post:", error);
    }
};
