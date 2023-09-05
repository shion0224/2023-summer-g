window.onload = async () => {
  try {
    const response = await fetch("/dreams");
    //これがあると投稿を押したときに気持ち悪くなる。
    // document.getElementById("post-button").innerText = await response.text();
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
