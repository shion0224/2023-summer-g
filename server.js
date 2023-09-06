// Corrected URLs with versions
import { serve } from "https://deno.land/std@0.194.0/http/server.ts?s=serve";
import { serveDir } from "https://deno.land/std@0.194.0/http/file_server.ts?s=serveDir";
import { Client } from "https://deno.land/x/mysql@v2.11.0/mod.ts";
import "https://deno.land/std@0.193.0/dotenv/load.ts";

const mySqlClient = await new Client().connect({
  hostname: Deno.env.get("MYSQL_HOSTNAME"),
  username: Deno.env.get("MYSQL_USER"),
  password: Deno.env.get("MYSQL_PASSWORD"),
  db: Deno.env.get("DATABASE"),
});

serve(async (req) => {
  const pathname = new URL(req.url).pathname;
  console.log(pathname);

  if (req.method === "GET" && pathname === "/dream-title") {
    const dreams = await mySqlClient.query(
      "SELECT title FROM dreams WHERE dream_id = 58"
    );
    const title = dreams[0].title;
    return new Response(title);
  }

  if (req.method === "GET" && pathname === "/dream-content") {
    const dreams = await mySqlClient.query(
      "SELECT content FROM dreams WHERE dream_id = 58"
    );
    const content = dreams[0].content;
    return new Response(content);
  }

  /*
   * 夢の内容をPOSTする。
   */

  if (req.method === "POST" && pathname === "/dreams") {
    const reqJson = await req.json();
    console.log(reqJson);
    const titles = reqJson.titles;
    const contents = reqJson.contents;
    if (contents === "" && titles === "") {
      return new Response("空文字です。");
    } else {
      // INSERTなど、書込用SQLを実行する
      const insertResult = await mySqlClient.execute(
        `INSERT INTO dreams (title,content) VALUES (?,?);`,
        [titles, contents]
      );

      return new Response("文字です。");
    }
  }
  // New endpoint for fetching dreams
  /**
   * 投稿をGETする。
   */

  if (req.method === "GET" && pathname === "/dreams") {
    const dreams = await mySqlClient.query(
      "SELECT * FROM dreams ORDER BY timestamp DESC LIMIT 20"
    );
    // titleとcontentの両方を含むオブジェクトの配列を作成
    const result = dreams.map((dream) => ({
      title: dream.title,
      content: dream.content,
      dream_id: dream.dream_id,
    }));

    // JSON形式でResponseを返す
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  }

  /* */

  if (req.method === "GET" && pathname.startsWith("/dreams/paginated")) {
    const params = new URLSearchParams(new URL(req.url).search);
    const page = parseInt(params.get("page") || "1");
    const limit = parseInt(params.get("limit") || "10");
    const offset = (page - 1) * limit;

    const dreams = await mySqlClient.query(
      "SELECT * FROM dreams ORDER BY timestamp DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );

    const filteredDreams = dreams.map((dream) => ({
      dream_content: dream.dream_content,
      timestamp: dream.timestamp,
    }));
    return new Response(JSON.stringify(filteredDreams));
  }
  if (
    req.method === "POST" &&
    pathname.startsWith("/dreams/") &&
    pathname.endsWith("/comments")
  ) {
    const dreamId = parseInt(pathname.split("/")[2]);
    const reqJson = await req.json();
    const commentContent = reqJson.comment;

    if (commentContent === "") {
      return new Response("Comment cannot be empty.");
    } else {
      // Inserting comment into the comments table
      await mySqlClient.execute(
        `INSERT INTO comments (dream_id, content) VALUES (?, ?);`,
        [dreamId, commentContent]
      );

      // Appending the comment to the related_comment column in the dreams table
      const currentDream = await mySqlClient.query(
        "SELECT related_comment FROM dreams WHERE dream_id = ?",
        [dreamId]
      );

      const currentRelatedComments = currentDream[0].related_comment || "";
      const updatedComments = currentRelatedComments
        ? currentRelatedComments + "," + commentContent
        : commentContent;

      await mySqlClient.execute(
        "UPDATE dreams SET related_comment = ? WHERE dream_id = ?",
        [updatedComments, dreamId]
      );

      return new Response("Comment added successfully.");
    }
  }

  // Endpoint to retrieve comments for a specific dream
  if (req.method === "GET" && pathname.startsWith("/dreams/")) {
    const dreamId = parseInt(pathname.split("/")[2]); // Assuming "/dreams/{dreamId}/comments" format

    const comments = await mySqlClient.query(
      "SELECT * FROM dreams WHERE dream_id = ? ORDER BY timestamp DESC LIMIT 50",
      [dreamId]
    );

    return new Response(JSON.stringify(comments));
  }
  console.log("Attaching event to post-comment-button");

  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
