window.onload = async () => {
  const dreamId = localStorage.getItem("dream_id");

  if (dreamId) {
    try {
      const response = await fetch(`/dreams/${dreamId}`);
      const dream = await response.json();
      document.getElementById("dream-title").innerText = dream[0].title;
      document.getElementById("dream-content").innerText = dream[0].content;
    } catch (error) {
      console.error("Error fetching the associated dream:", error);
    }
  }
};
document.getElementById("post-comment-button").onclick = async () => {
  const commentContents = document.getElementById("post-contents").value;

  if (!commentContents.trim()) {
    alert("Comment cannot be empty.");
    return;
  }

  const dreamId = localStorage.getItem("dream_id");
  if (!dreamId) {
    alert("No associated dream selected.");
    return;
  }

  try {
    const response = await fetch(`/dreams/${dreamId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment: commentContents }),
    });
    const result = await response.text();
    alert(result);
  } catch (error) {
    console.error("Error posting comment:", error);
  }
};
