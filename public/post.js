document.getElementById("post-button").onclick = async () => {
  const contents = document.getElementById("post-contents").value;
  const titles = document.getElementById("post-titles").value;

  // Getting all checkboxes
  const checkboxes = document.querySelectorAll(".checkbox");

  // Filtering only the checked ones and mapping to their values
  const selectedTags = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  // Join the selected tags into a single string (if necessary)
  const tag = selectedTags.join(", ");

  try {
    const response = await fetch("/dreams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: contents, titles: titles, tag: tag }),
    });
    window.location.href = "/";
  } catch (error) {
    console.error("Error posting dream:", error);
  }
};
