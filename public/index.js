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
};

document.getElementById("post-button").onclick = async () => {
  try {
    const response = await fetch("/dreams");
    document.getElementById("post-button").innerText = await response.text();
  } catch (error) {
    console.error("Error fetching from /post:", error);
  }

  const contents = document.getElementById("post-contents").value;
  try {
    const response = await fetch("/dreams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: contents }),
    });
    document.getElementById("test").innerText = await response.text();
  } catch (error) {
    console.error("Error posting dream:", error);
  }
};
