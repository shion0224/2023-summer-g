window.onload = async () => {
  const dreamId = localStorage.getItem("dream_id");
  try {
    const response = await fetch(`/dreams/${dreamId}/comments`);
    const comments = await response.json();
    if (comments.length > 0) {
      const withComment = document.getElementById("with-comment");
      withComment.style.display = "block";
    } else {
      const noComment = document.getElementById("no-comment");
      noComment.style.display = "block";
    }
    const commentsListDiv = document.getElementById("comments-list");

    comments.forEach((comment) => {
      const commentDiv = document.createElement("h3");
      commentDiv.classList.add("comment");
      commentDiv.innerText = comment.content;
      commentsListDiv.prepend(commentDiv);
    });
  } catch (error) {
    console.error("Error fetching the comments:", error);
  }
  if (dreamId) {
    try {
      const response = await fetch(`/dreams/${dreamId}`);
      const dream = await response.json();
      document.getElementById("dream-title").innerText = dream[0].title;
      document.getElementById("dream-content").innerText = dream[0].content;
      document.getElementById("dream-tag-detail").innerText = dream[0].tag;
    } catch (error) {
      console.error("Error fetching the associated dream:", error);
    }
  }
};
document.getElementById("post-comment-button").onclick = async () => {
  const commentContents = document.getElementById("post-contents").value;
  const commentElement = document.getElementById("post-contents");

  if (!commentContents.trim()) {
    commentElement.value = "";
    commentElement.setAttribute("placeholder", "コメントを入力してください！");
    commentElement.classList.add("textarea-error");
    commentElement.focus();
    return; // exit the function early
  } else {
    commentElement.setAttribute("placeholder", "夢の内容");
    commentElement.classList.remove("textarea-error");
  }

  const dreamId = localStorage.getItem("dream_id");
  if (!dreamId) {
    alert("No associated dream selected.");
    return;
  }
  window.location.href = "/post-detail.html";

  try {
    const response = await fetch(`/dreams/${dreamId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment: commentContents }),
    });
    const result = await response.text();
    const dreamDiv = document.getElementById("comments-list");
    const dreamContentDiv = document.createElement("div");
    // dreamTitleDiv.setAttribute("id", `dream-title${i}`);
    dreamContentDiv.textContent = commentContents;
    dreamDiv.appendChild(dreamContentDiv);
  } catch (error) {
    console.error("Error posting comment:", error);
  }
};
