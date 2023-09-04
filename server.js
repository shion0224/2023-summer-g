import { serve } from "https://deno.land/std@0.180.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.180.0/http/file_server.ts";

/**
 * APIリクエストを処理する
 */
serve( async (req)  => {
  // URLのパスを取得
  const pathname = new URL(req.url).pathname
  console.log(pathname)

    // パスが'/post'だったら新規投稿の文字を返す。 
  // if( req.method === "POST" && pathname === "/post" ){
  //   return new Response("新規投稿")
  // }

  if( req.method === "POST" && pathname === "/dreams" ){
    const reqJson =  await req.json();
    const contents = reqJson.contents;
    if( contents === "" ){
      return new Response("空文字です。")
    }else{
      return new Response("空文字ではありません。")
    }
  }

  // publicフォルダ内にあるファイルを返す
  return serveDir(req, {
    fsRoot: 'public',
    urlRoot: '',
    showDirListing: true,
    enableCors: true,
  })
})
