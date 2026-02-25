"use server";

import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string | null;
    const color = formData.get("color") as string;
    const userId = formData.get("userId") as string;
    const redirectPath = formData.get("redirectPath") as string || "/planner";

    if (!name || name.trim() === "" || !userId) {
        throw new Error("Nom du projet et UserID requis");
    }

    await db.insert(projects).values({
        name: name.trim(),
        description: description?.trim(),
        color: color || "primary",
        userId,
    });

    revalidatePath(redirectPath);
}

export async function deleteProject(formData: FormData) {
    const id = formData.get("id") as string;
    const userId = formData.get("userId") as string;
    const redirectPath = formData.get("redirectPath") as string || "/planner";

    if (!id || !userId) {
        throw new Error("Project ID and UserID are required");
    }

    await db.delete(projects).where(and(eq(projects.id, id), eq(projects.userId, userId)));
    revalidatePath(redirectPath);
}
