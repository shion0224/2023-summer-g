window.onload = async () => {
  // const dreamId = localStorage.getItem("dream_id");
  const dreamId = 60;
  if (dreamId) {
    try {
      const response = await fetch(`/dreams/${dreamId}`);
      const dream = await response.json();
      document.getElementById("dream-title-display").innerText = dream.title;
      localStorage.setItem("dream_id", dream.id);
    } catch (error) {
      console.error("Error fetching the associated dream:", error);
    }
  }
};
document.getElementById("post-comment-button").onclick = async () => {
  const commentContents = document.getElementById("comment-contents").value;

  if (!commentContents.trim()) {
    alert("Comment cannot be empty.");
    return;
  }

  //   const dreamId = localStorage.getItem("dream_id");
  const dreamId = 60;
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
