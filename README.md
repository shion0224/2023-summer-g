# jig.jp 2023 summer intern G team

https://sleep-peep.deno.dev/

問題点
・register.htmlで登録した後にindex.htmlにログインの詳細が反映されない
→registerからloginへ飛ぶようにして解決

・login.htmlからregister.htmlにページの遷移ができない。
・ユーザー登録の際に画像登録ができない。
→画像を保存するデータベースの構造にしなければならない。SQliteで可能？
・plofile.htmlのheaderとfooterがindex.htmlとズレている
・index.htmlに表示されている投稿をクリックしたときに詳細に飛ぶことができない。
→ポップアップ的なものが表示されてそこで返信を書き込めるような形にしたい。
→返信を保存するようにデータベースの設計を組み直さないといけない。


・すでにユーザーが登録されているとき別ページに遷移してエラーが出るのがだるい