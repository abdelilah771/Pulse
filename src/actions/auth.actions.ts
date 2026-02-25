"use server";
import { db } from "@/db";
import { users, tasks, dailyMetrics } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";

export async function loginUser(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Email et mot de passe requis." };
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: "Email ou mot de passe incorrect." };
    }

    return { success: true };
}

export async function registerUser(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Email et mot de passe requis." };
    }

    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name,
            }
        }
    });

    if (authError) {
        return { error: authError.message };
    }

    if (authData.user) {
        // If identities is empty, the user already exists in Supabase Auth (likely via OAuth)
        if (authData.user.identities && authData.user.identities.length === 0) {
            return { error: "Cet email est déjà associé à un compte. Veuillez vous connecter, par exemple avec Google ou GitHub." };
        }

        // Also insert into our public users table
        try {
            await db.insert(users).values({
                id: authData.user.id,
                name: name,
                email: email,
            }).onConflictDoNothing();
        } catch (e) {
            console.error("Error creating user profile in public.users:", e);
        }
    }

    return { success: true };
}

export async function logoutUser() {
    const supabase = await createClient();
    await supabase.auth.signOut();
}

export async function updateDailyMetrics(userId: string, dateStr: string, mood: number, energy: number) {
    await db.insert(dailyMetrics).values({
        userId,
        dateStr,
        mood,
        energy,
    }).onConflictDoUpdate({
        target: [dailyMetrics.userId, dailyMetrics.dateStr],
        set: { mood, energy, updatedAt: new Date() }
    });
    return { success: true };
}
