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
  const titles = document.getElementById("post-titles").value;

  //一旦沼るタグの作業はパス！
  // if(document.getElementById("check_horror").value === horror){
  //   const horror = 1;
  // }

  try {
    const response = await fetch("/dreams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        { contents: contents ,
          titles: titles
        }),
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
