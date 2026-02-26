"use server";

import { db } from "@/db";
import { projectMessages, users } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";
import { eq, desc } from "drizzle-orm";

export async function getProjectMessages(projectId: string) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { error: "Non authentifié." };
        }

        const messages = await db
            .select({
                id: projectMessages.id,
                content: projectMessages.content,
                createdAt: projectMessages.createdAt,
                user: {
                    id: users.id,
                    name: users.name,
                    avatarUrl: users.avatarUrl,
                }
            })
            .from(projectMessages)
            .leftJoin(users, eq(users.id, projectMessages.userId))
            .where(eq(projectMessages.projectId, projectId))
            .orderBy(projectMessages.createdAt);

        return { data: messages };
    } catch (error: any) {
        console.error("Erreur gPM:", error);
        return { error: "Impossible de charger les messages." };
    }
}

export async function sendProjectMessage(projectId: string, content: string) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { error: "Non authentifié." };
        }

        if (!content || content.trim() === "") {
            return { error: "Le message ne peut pas être vide." };
        }

        const [newMessage] = await db.insert(projectMessages).values({
            projectId,
            userId: user.id,
            content: content.trim(),
        }).returning();

        return { success: true, message: newMessage };
    } catch (error: any) {
        console.error("Erreur sPM:", error);
        return { error: "Impossible d'envoyer le message." };
    }
}
