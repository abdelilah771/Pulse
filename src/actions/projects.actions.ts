"use server";

import { db } from "@/db";
import { projects, projectMembers, users, tasks, taskAssignees } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string | null;
    const color = formData.get("color") as string;
    const userId = formData.get("userId") as string;
    const redirectPath = formData.get("redirectPath") as string || "/";

    if (!name || name.trim() === "" || !userId) {
        throw new Error("Nom du projet et UserID requis");
    }

    const insertedProjects = await db.insert(projects).values({
        name: name.trim(),
        description: description?.trim(),
        color: color || "primary",
        userId,
    }).returning({ id: projects.id });

    if (insertedProjects.length > 0) {
        const projectId = insertedProjects[0].id;
        await db.insert(projectMembers).values({
            projectId,
            userId,
            role: "owner",
        });
    }

    revalidatePath(redirectPath);
}

export async function updateProject(formData: FormData) {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string | null;
    const color = formData.get("color") as string;
    const userId = formData.get("userId") as string;
    const redirectPath = formData.get("redirectPath") as string || "/";

    if (!id || !name || name.trim() === "" || !userId) {
        throw new Error("Project ID, Nom et UserID requis");
    }

    // Verify ownership or membership
    const project = await db.query.projects.findFirst({
        where: eq(projects.id, id),
    });

    if (!project) throw new Error("Projet introuvable");

    // Only allow update if user is the creator (in a more complex app, check projectMembers role)
    if (project.userId !== userId) {
        throw new Error("Non autorisé à modifier ce projet");
    }

    await db.update(projects)
        .set({
            name: name.trim(),
            description: description?.trim(),
            color: color || "primary",
            updatedAt: new Date(),
        })
        .where(eq(projects.id, id));

    revalidatePath(redirectPath);
}

export async function deleteProject(formData: FormData) {
    const id = formData.get("id") as string;
    const userId = formData.get("userId") as string;
    const redirectPath = formData.get("redirectPath") as string || "/";

    if (!id || !userId) {
        throw new Error("Project ID and UserID are required");
    }

    // Verify ownership
    const project = await db.query.projects.findFirst({
        where: eq(projects.id, id),
    });

    if (!project) throw new Error("Projet introuvable");
    if (project.userId !== userId) {
        throw new Error("Seul le créateur peut supprimer ce projet");
    }

    await db.delete(projects).where(eq(projects.id, id));
    revalidatePath(redirectPath);
}

export async function shareProject(formData: FormData) {
    const projectId = formData.get("projectId") as string;
    const email = formData.get("email") as string;
    const ownerId = formData.get("userId") as string;
    const redirectPath = formData.get("redirectPath") as string || "/";

    if (!projectId || !email || !ownerId) {
        throw new Error("Paramètres manquants");
    }

    // Verify ownership
    const project = await db.query.projects.findFirst({
        where: eq(projects.id, projectId),
    });

    if (!project || project.userId !== ownerId) {
        throw new Error("Non autorisé à partager ce projet");
    }

    // Find user by email
    const targetUser = await db.query.users.findFirst({
        where: eq(users.email, email.trim().toLowerCase()),
    });

    if (!targetUser) {
        throw new Error("Aucun utilisateur trouvé avec cet email. Il doit d'abord se créer un compte.");
    }

    if (targetUser.id === ownerId) {
        throw new Error("Vous êtes déjà le propriétaire de ce projet");
    }

    // Check if already a member
    const existingMember = await db.query.projectMembers.findFirst({
        where: and(
            eq(projectMembers.projectId, projectId),
            eq(projectMembers.userId, targetUser.id)
        ),
    });

    if (existingMember) {
        throw new Error("Cet utilisateur est déjà membre du projet");
    }

    await db.insert(projectMembers).values({
        projectId,
        userId: targetUser.id,
        role: "member",
    });

    revalidatePath(redirectPath);
}

export async function removeMember(formData: FormData) {
    const projectId = formData.get("projectId") as string;
    const memberId = formData.get("memberId") as string;
    const ownerId = formData.get("userId") as string;
    const redirectPath = formData.get("redirectPath") as string || "/";

    if (!projectId || !memberId || !ownerId) {
        throw new Error("Paramètres manquants");
    }

    // Verify ownership
    const project = await db.query.projects.findFirst({
        where: eq(projects.id, projectId),
    });

    if (!project || project.userId !== ownerId) {
        throw new Error("Seul le propriétaire peut retirer des membres");
    }

    if (memberId === ownerId) {
        throw new Error("Impossible de se retirer soi-même via cette action");
    }

    await db.delete(projectMembers).where(
        and(
            eq(projectMembers.projectId, projectId),
            eq(projectMembers.userId, memberId)
        )
    );

    revalidatePath(redirectPath);
}

export async function getProjectSummary(projectId: string) {
    try {
        const project = await db.query.projects.findFirst({
            where: eq(projects.id, projectId),
        });

        if (!project) return null;

        const allTasks = await db.select().from(tasks).where(eq(tasks.projectId, projectId));
        const completedTasks = allTasks.filter(t => t.done).length;
        const totalTasks = allTasks.length;

        const memberDetails = await db
            .select({
                id: users.id,
                name: users.name,
                avatarUrl: users.avatarUrl,
                role: projectMembers.role
            })
            .from(projectMembers)
            .innerJoin(users, eq(users.id, projectMembers.userId))
            .where(eq(projectMembers.projectId, projectId));

        return {
            project,
            stats: { totalTasks, completedTasks },
            members: memberDetails
        };

    } catch (e) {
        console.error("Erreur getProjectSummary:", e);
        return null;
    }
}

export async function addProjectTask(formData: FormData) {
    const text = formData.get("text") as string;
    const projectId = formData.get("projectId") as string;

    if (!text || !text.trim() || !projectId) {
        return { error: "Texte et ProjectID requis" };
    }

    try {
        const { createClient } = await import("@/lib/supabase/server");
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return { error: "Non authentifié" };

        const today = new Date().toISOString().split('T')[0];

        await db.insert(tasks).values({
            text: text.trim(),
            projectId,
            userId: user.id,
            dateStr: today,
            timeSlot: "morning",
            priority: "medium",
            type: "learn",
        });

        revalidatePath(`/projects/${projectId}`);
        return { success: true };
    } catch (e: any) {
        return { error: e.message || "Erreur lors de l'ajout de la tâche" };
    }
}

export async function toggleProjectTask(formData: FormData) {
    const taskId = formData.get("taskId") as string;
    const isDone = formData.get("done") === "true";

    if (!taskId) return { error: "TaskID requis" };

    try {
        const { createClient } = await import("@/lib/supabase/server");
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return { error: "Non authentifié" };

        await db.update(tasks)
            .set({ done: isDone, updatedAt: new Date() })
            .where(and(eq(tasks.id, taskId), eq(tasks.userId, user.id)));

        // We don't have projectId mapped here easily unless we fetch it, but Next.js router handles optimistic UI 
        // We'll revalidate the layout if needed, or rely on optimistic UI for now.
        return { success: true };
    } catch (e: any) {
        return { error: e.message || "Erreur lors de la mise à jour" };
    }
}
