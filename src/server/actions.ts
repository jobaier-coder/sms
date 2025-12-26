"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { posts } from "@/server/db/schema";

export async function createPost(formData: FormData) {
  const name = formData.get("name") as string;

  if (!name || name.trim().length === 0) {
    throw new Error("Post name is required");
  }

  await db.insert(posts).values({ name: name.trim() });

  revalidatePath("/");
  redirect("/");
}
