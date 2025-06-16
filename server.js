// Corrected URLs with versions
import { serve } from "https://deno.land/std@0.194.0/http/server.ts?s=serve";
import { serveDir } from "https://deno.land/std@0.194.0/http/file_server.ts?s=serveDir";
import { Client } from "https://deno.land/x/mysql@v2.11.0/mod.ts";
import "https://deno.land/std@0.193.0/dotenv/load.ts";
import { insertPost, getAllPosts } from "./public/utils/db.ts";

serve(async (req) => {
  const pathname = new URL(req.url).pathname;
  console.log(pathname);

  if (req.method === "POST" && pathname === "/posts") {
    try {
      const reqJson = await req.json();
      if (!reqJson.title || !reqJson.content || !reqJson.username) {
        return new Response("Missing required fields", { status: 400 });
      }

      const newPost = {
        id: crypto.randomUUID(),
        userId: reqJson.userId || "anonymous",
        username: reqJson.username,
        userAvatarUrl: reqJson.userAvatarUrl || "https://i.pravatar.cc/150?img=1",
        title: reqJson.title,
        content: reqJson.content,
        tags: reqJson.tags || [],
        timestamp: Date.now(),
      };

      insertPost(newPost);
      return new Response(JSON.stringify({ message: "Post created", post: newPost }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.error(e);
      return new Response("Failed to insert post", { status: 500 });
    }
  } else if (req.method === "GET" && pathname === "/posts") {
    try {
      const posts = getAllPosts();
      return new Response(JSON.stringify(posts), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.error(e);
      return new Response("Failed to retrieve posts", { status: 500 });
    }
  } else {
    return serveDir(req, {
      fsRoot: "./public",
      urlRoot: "",
      showDirListing: true,
    });
  }
});
