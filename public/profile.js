window.onload = async () => {
    try {
        const response = await fetch("/profile");
        const data = await response.json();  // response.text()をresponse.json()に変更

        const postContainer = document.querySelector('.post-container');

        for (let i = 0;  i < data.length; i++) {  // data.lengthをチェックしてindexが範囲外にならないようにする
            if(localStorage.getItem("did") === data[i].did){
                const postDiv = document.createElement('div');
                postDiv.id = `post-${i}`;
    
                const postTitleDiv = document.createElement('div');
                postTitleDiv.id = `post-title${i}`;
                postTitleDiv.innerText = data[i].title;  // titleをdiv要素の中身に設定
                postDiv.appendChild(postTitleDiv);
    
                const postTagDetailDiv = document.createElement('div');
                postTagDetailDiv.id = `post-tag${i}`;
                postTagDetailDiv.innerText = data[i].tag;  // tagをdiv要素の中身に設定
                postDiv.appendChild(postTagDetailDiv);
    
                const postContentDiv = document.createElement('div');
                postContentDiv.id = `post-content${i}`;
                postContentDiv.innerText = data[i].content;  // contentをdiv要素の中身に設定
                postDiv.appendChild(postContentDiv);
    
                postContainer.appendChild(postDiv);
            }

        }

    } catch (error) {
        console.error("Error fetching from /post:", error);
    }
};
