document.getElementById("post-button").onclick = async () => {
  try {
    const response = await fetch("/dreams");
    document.getElementById("post-button").innerText = await response.text();
  } catch (error) {
    console.error("Error fetching from /post:", error);
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
