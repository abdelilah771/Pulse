"use server";

import { db } from "@/db";
import { tasks, dailyMetrics } from "@/db/schema";
import { WEEKS } from "@/lib/courseData";
import { createClient } from "@/lib/supabase/server";
import { eq } from "drizzle-orm";

const EMOJI_TYPE_MAP: Record<string, string> = {
    '📘': 'learn',
    '🛠️': 'practice',
    '📖': 'read',
    '📝': 'review',
    '🚀': 'project',
    '🎉': 'celebrate',
};

function toDateStr(date: Date) {
    return date.toISOString().split('T')[0];
}

export async function seedDatabase() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        // 1. Check if already seeded by checking if user has any tasks for Feb 23, 2026
        const checkDate = "2026-02-23";
        const existingTasks = await db.query.tasks.findFirst({
            where: (t, { and, eq }) => and(eq(t.userId, user.id), eq(t.dateStr, checkDate))
        });

        if (existingTasks) {
            return { success: true, message: "Database already seeded." };
        }

        let cursor = new Date(2026, 1, 23); // Feb 23, 2026

        // 2. Iterate and collect all inserts
        // Since sqlite/pg bulk inserts exist, we'll collect them in an array
        const tasksToInsert: any[] = [];
        const metricsToInsert: any[] = [];

        WEEKS.forEach(week => {
            week.days.forEach(day => {
                // Skip weekends
                while (cursor.getDay() === 0 || cursor.getDay() === 6) {
                    cursor.setDate(cursor.getDate() + 1);
                }

                const dateStr = toDateStr(cursor);

                // Add metrics for the day
                metricsToInsert.push({
                    userId: user.id,
                    date: dateStr,
                    mood: 5,
                    coffee: 2,
                    energy: 5
                });

                // Add tasks, split by the topic concepts mapping
                // Assuming `day.topic` + emojis from legacy structure
                // We'll map the `concepts` which were previously `tasks: [{text: ...}]` in vanillaJS

                day.concepts.forEach(concept => {
                    let type = 'learn';
                    let text = concept;
                    for (const [emoji, ttype] of Object.entries(EMOJI_TYPE_MAP)) {
                        if (text.startsWith(emoji)) {
                            type = ttype;
                            text = text.slice(emoji.length).trim();
                            break;
                        }
                    }

                    tasksToInsert.push({
                        userId: user.id,
                        dateStr: dateStr,
                        text: text,
                        done: false,
                        priority: 'medium',
                        type: type
                    });
                });

                cursor.setDate(cursor.getDate() + 1);
            });
        });

        // 3. Perform bulk inserts using Drizzle
        if (metricsToInsert.length > 0) {
            await db.insert(dailyMetrics).values(metricsToInsert);
        }

        if (tasksToInsert.length > 0) {
            // Bulk insert tasks in chunks if needed, but Drizzle can usually handle a few hundred
            await db.insert(tasks).values(tasksToInsert);
        }

        return { success: true, message: `Successfully seeded ${tasksToInsert.length} tasks across ${metricsToInsert.length} days.` };
    } catch (e: any) {
        console.error("Failed to seed database:", e);
        return { success: false, error: e.message };
    }
}
