import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from "@/db"
import { users } from "@/db/schema"

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const safeOrigin = origin.replace('0.0.0.0', 'localhost')
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/home'

    if (code) {
        const supabase = await createClient()
        const { error, data } = await supabase.auth.exchangeCodeForSession(code)
        if (!error && data.user) {
            // Auto-sync OAuth users to the Drizzle public users table
            try {
                await db.insert(users).values({
                    id: data.user.id,
                    name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || "Voyageur",
                    email: data.user.email || "",
                }).onConflictDoNothing();
            } catch (e) {
                console.error("Error syncing OAuth user to public.users:", e);
            }

            return NextResponse.redirect(`${safeOrigin}${next}`)
        } else {
            console.error("Auth callback error exchanging code:", error?.message)
        }
    }

    // Return the user to an error page with some instructions
    return NextResponse.redirect(`${safeOrigin}/login?error=auth-callback-failed`)
}
