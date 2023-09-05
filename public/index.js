// When the page loads, fetch the welcome message
window.onload = async () => {
  try {
    const response = await fetch("/welcome-message");
    const welcomeMessage = await response.text();
    document.getElementById("welcome-message-container").innerText =
      welcomeMessage;
  } catch (error) {
    console.error("Error fetching welcome message:", error);
  }
  const dreamId = localStorage.getItem("currentDreamId");
  if (dreamId) {
    try {
      const response = await fetch(`/dreams/${dreamId}`);
      const dream = await response.json();
      document.getElementById("dream-title-display").innerText = dream.title;
    } catch (error) {
      console.error("Error fetching the associated dream:", error);
    }
  }
};

document.getElementById("post-button").onclick = async () => {
  try {
    const response = await fetch("/dreams");
    document.getElementById("post-button").innerText = await response.text();
  } catch (error) {
    console.error("Error fetching from /post:", error);
  }

  const contents = document.getElementById("post-contents").value;
  const titles = document.getElementById("post-titles").value;

  try {
    const response = await fetch("/dreams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: contents, titles: titles }),
    });
    document.getElementById("test").innerText = await response.text();
  } catch (error) {
    console.error("Error posting dream:", error);
  }
};
document.getElementById("fetch-dreams-button").onclick = async () => {
  try {
    const response = await fetch("/dreams");
    const dreams = await response.json();
    console.log(dreams);
    const userIds = dreams.map((dream) => dream.title);
    document.getElementById("dreams-container").innerText = userIds.join(", ");
  } catch (error) {
    console.error("Error fetching dreams:", error);
  }
};
document.getElementById("post-comment-button").onclick = async () => {
  const commentContent = document.getElementById("comment-contents").value;
  const dreamId = 60;
  console.log("button clicked");
  if (!dreamId) {
    console.error("Error: No dream selected");
    return;
  }

  if (!commentContent) {
    console.error("Error: Comment content is empty");
    return;
  }

  try {
    const response = await fetch(`/dreams/${dreamId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment: commentContent }),
    });
    const resultText = await response.text();
    console.log(resultText);
    // Optionally, you can reset the textarea after successful submission.
    document.getElementById("comment-contents").value = "";
  } catch (error) {
    console.error("Error posting comment:", error);
  }
};
