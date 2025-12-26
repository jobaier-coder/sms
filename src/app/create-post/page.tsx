import Link from "next/link";
import { createPost } from "@/server/actions";

export default function CreatePostPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Create Post
        </h1>

        <form
          action={createPost}
          className="flex flex-col gap-4 w-full max-w-md"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-lg font-semibold">
              Post Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="rounded-lg bg-white/10 px-4 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Enter post name..."
            />
          </div>

          <button
            type="submit"
            className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          >
            Create Post
          </button>
        </form>

        <Link
          href="/"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
