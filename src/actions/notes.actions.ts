"use server";
import { db } from "@/db";
import { notes } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { extractTitle } from "@/lib/utils";

export async function createNote(formData: FormData) {
    const content = formData.get("content") as string;
    const userId = formData.get("userId") as string;
    const dateStr = formData.get("dateStr") as string;

    if (!content || !userId || !dateStr) {
        throw new Error("Missing fields");
    }

    // Default title from content, tag could be extracted or passed if needed
    const title = extractTitle(content);

    try {
        await db.insert(notes).values({
            title,
            content,
            dateStr,
            userId,
            tag: "NOTE"
        });

        revalidatePath("/planner");
    } catch (e) {
        console.error("Error creating note:", e);
        throw new Error("Failed to create note");
    }
}
