"use server";

import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData) {
    const text = formData.get("text") as string;
    const priority = formData.get("priority") as string || "medium"; // high, medium, low
    const projectId = formData.get("projectId") as string | null;
    const userId = formData.get("userId") as string;
    const dateStr = formData.get("dateStr") as string;
    const type = formData.get("type") as string || "learn";
    const redirectPath = formData.get("redirectPath") as string || "/planner";

    if (!text || text.trim() === "" || !userId || !dateStr) {
        throw new Error("Texte de la tâche, Date, et UserID sont requis");
    }

    await db.insert(tasks).values({
        text: text.trim(),
        priority,
        projectId: projectId ? projectId : null,
        userId,
        dateStr,
        type,
    });

    revalidatePath(redirectPath);
}

export async function toggleTaskDone(taskId: string, userId: string, isDone: boolean, redirectPath: string = "/planner") {
    if (!taskId || !userId) {
        throw new Error("Task ID and UserID are required");
    }

    await db.update(tasks)
        .set({ done: isDone, updatedAt: new Date() })
        .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));

    revalidatePath(redirectPath);
}

export async function deleteTask(formData: FormData) {
    const id = formData.get("id") as string;
    const userId = formData.get("userId") as string;
    const redirectPath = formData.get("redirectPath") as string || "/planner";

    if (!id || !userId) {
        throw new Error("Task ID and UserID are required");
    }

    await db.delete(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
    revalidatePath(redirectPath);
}
