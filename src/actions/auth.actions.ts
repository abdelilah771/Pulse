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

// --- PROFILE & SECURITY ACTIONS ---

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();
    const name = formData.get("name") as string;
    const avatarUrl = formData.get("avatarUrl") as string | null;

    if (!name) return { error: "Le nom est requis." };

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Non authentifié." };

    // Update Supabase Auth metadata
    const { error: authError } = await supabase.auth.updateUser({
        data: { name, avatar_url: avatarUrl }
    });

    if (authError) return { error: authError.message };

    // Update Public Users Table
    const updateData: any = { name, updatedAt: new Date() };
    if (avatarUrl !== null) updateData.avatarUrl = avatarUrl; // Allow empty string to clear

    await db.update(users).set(updateData).where(eq(users.id, user.id));

    return { success: true };
}

export async function updatePassword(formData: FormData) {
    const supabase = await createClient();
    const password = formData.get("password") as string;

    if (!password || password.length < 6) return { error: "Le mot de passe doit faire au moins 6 caractères." };

    const { error } = await supabase.auth.updateUser({ password });

    if (error) return { error: error.message };
    return { success: true };
}

// --- TOTP MFA ACTIONS ---

export async function getMfaStatus() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { enabled: false, factors: [] };

    // Find verified TOTP factors
    const totpFactors = user.factors?.filter(f => f.factor_type === 'totp' && f.status === 'verified') || [];

    return {
        enabled: totpFactors.length > 0,
        factors: totpFactors
    };
}

export async function enrollMfa() {
    const supabase = await createClient();

    // 1. Enroll user in TOTP
    const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp'
    });

    if (error) return { error: error.message };

    // 2. We return the QR code data for the frontend to render, plus the factorId
    const qrCodeUrl = data.totp.qr_code; // SVG or URL format string depending on env, but Supabase usually returns the otpauth:// URI
    return {
        factorId: data.id,
        qrCodeUri: data.totp.uri,
        secret: data.totp.secret
    };
}

export async function verifyMfaEnrollment(factorId: string, code: string) {
    const supabase = await createClient();

    const challenge = await supabase.auth.mfa.challenge({ factorId });
    if (challenge.error) return { error: challenge.error.message };

    const verify = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.data.id,
        code
    });

    if (verify.error) return { error: verify.error.message };

    return { success: true };
}

export async function unenrollMfa(factorId: string) {
    const supabase = await createClient();
    const { error } = await supabase.auth.mfa.unenroll({ factorId });
    if (error) return { error: error.message };
    return { success: true };
}
