import { db } from "@/server/db";
import { posts } from "@/server/db/schema";
import Link from "next/link";

export default async function HomePage() {
  const allPosts = await db.select().from(posts);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          All Posts
        </h1>

        <div className="flex flex-col gap-4 w-full max-w-2xl">
          {allPosts.length === 0 ? (
            <p className="text-center text-xl">No posts yet. Create one!</p>
          ) : (
            allPosts.map((post) => (
              <div
                key={post.id}
                className="flex flex-col gap-2 rounded-lg bg-white/10 p-4"
              >
                <h2 className="text-2xl font-bold">{post.name}</h2>
                <p className="text-sm text-white/60">
                  Created: {post.createdAt.toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>

        <Link
          href="/create-post"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        >
          Create New Post
        </Link>
      </div>
    </main>
  );
}
