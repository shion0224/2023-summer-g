/**
 * ロードが終わったら 「GET /welcome-message」でサーバーにアクセスする
 */
// window.onload = async () => {
//   const response = await fetch('/welcome-message')
//   document.querySelector('#welcomeMessage').innerText = await response.text()
// }

/**
 * post-buttonをクリックしたら 「GET /welcome-message」でサーバーにアクセスする
 */
document.getElementById("post-button").onclick = async () => {
  const response = await fetch("/post");
  document.getElementById("post-button").innerText = await response.text();
};


/**
 * post-buttonをクリックしたら 「GET /welcome-message」でサーバーにアクセスする
 */

document.getElementById("post-button").onclick = async () => {
  const contents = document.getElementById("post-contents").value;
  const response = await fetch("/dreams",{
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    //タグとかタイトルを増やしたいときにここを変える。
    body: JSON.stringify({contents: contents})
  });
  document.getElementById("test").innerText = await response.text();
};