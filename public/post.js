document.getElementById("post-button").onclick = async () => {
  const contentsElement = document.getElementById("post-contents");
  const titlesElement = document.getElementById("post-titles");

  const contents = contentsElement.value;
  const titles = titlesElement.value;

  let hasError = false;

  if (!contents.trim()) {
    contentsElement.value = "";
    contentsElement.setAttribute("placeholder", "内容を入力してください！");
    contentsElement.classList.add("textarea-error");
    contentsElement.focus();
    hasError = true;
  } else {
    contentsElement.setAttribute("placeholder", "夢の内容");
    contentsElement.classList.remove("textarea-error");
  }

  if (!titles.trim()) {
    titlesElement.value = "";
    titlesElement.setAttribute("placeholder", "タイトルを入力してください！");
    titlesElement.classList.add("textarea-error");
    if (!hasError) {
      // Only focus on the title if the content is not empty
      titlesElement.focus();
    }
    hasError = true;
  } else {
    titlesElement.setAttribute("placeholder", "タイトル");
    titlesElement.classList.remove("textarea-error");
  }

  if (hasError) return;

  // Getting all checkboxes
  const checkboxes = document.querySelectorAll(".checkbox");

  // Filtering only the checked ones and mapping to their values
  const selectedTags = Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  // Join the selected tags into a single string (if necessary)
  const tag = selectedTags.join(", ");

  try {
    const did = localStorage.getItem("did");
    const response = await fetch("/dreams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: contents,
        titles: titles,
        tag: tag,
        did: did,
      }),
    });
    window.location.href = "/";
  } catch (error) {
    console.error("Error posting dream:", error);
  }
};
