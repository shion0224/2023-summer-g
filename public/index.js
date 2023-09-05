window.onload = async () => {

  //コメントアウトで処理を消せる。
  // try {
  //   const response = await fetch("/dreams");
  //   document.getElementById("post-button").innerText = await response.text();
  // } catch (error) {
  //   console.error("Error fetching from /post:", error);
  // }


  try {
    const response = await fetch("/dream-title");
    document.getElementById("dream-title").innerText = await response.text();
  } catch (error) {
    console.error("Error fetching from /dream-title:", error);
  }
  
  try {
    const response = await fetch("/dream-content");
    document.getElementById("dream-content").innerText = await response.text();
  } catch (error) {
    console.error("Error fetching from /dream-title:", error);
  }
  

  const contents = document.getElementById("post-contents").value;
  const titles = document.getElementById("post-titles").value;

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
