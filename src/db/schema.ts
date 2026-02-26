import { boolean, integer, pgTable, text, timestamp, uniqueIndex, uuid, index, foreignKey } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey(), // We will use Supabase Auth UUID here
    name: text("name"),
    email: text("email").notNull().unique(),
    avatarUrl: text("avatar_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    color: text("color").default("primary").notNull(), // To store Tailwind colors or Hex
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tasks = pgTable("tasks", {
    id: uuid("id").defaultRandom().primaryKey(),
    text: text("text").notNull(),
    done: boolean("done").default(false).notNull(),
    priority: text("priority").default("medium").notNull(), // high, medium, low
    type: text("type").default("learn").notNull(),
    description: text("description"),
    timeSlot: text("time_slot").default("morning").notNull(), // morning, afternoon, evening
    dateStr: text("date_str").notNull(),
    projectId: uuid("project_id").references(() => projects.id, { onDelete: 'set null' }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
    index("task_user_date_idx").on(table.userId, table.dateStr),
    index("task_project_idx").on(table.projectId),
]);

export const dailyMetrics = pgTable("daily_metrics", {
    id: uuid("id").defaultRandom().primaryKey(),
    dateStr: text("date_str").notNull(),
    mood: integer("mood").default(5).notNull(),
    energy: integer("energy").default(5).notNull(),
    coffee: integer("coffee").default(0).notNull(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
    uniqueIndex("metrics_user_date_idx").on(table.userId, table.dateStr),
]);

export const notes = pgTable("notes", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    tag: text("tag"),
    dateStr: text("date_str").notNull(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
    index("note_user_date_idx").on(table.userId, table.dateStr),
]);

export const taskAssignees = pgTable("task_assignees", {
    id: uuid("id").defaultRandom().primaryKey(),
    taskId: uuid("task_id").notNull().references(() => tasks.id, { onDelete: 'cascade' }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
    uniqueIndex("task_assignee_unique_idx").on(table.taskId, table.userId),
    index("task_assignee_task_idx").on(table.taskId),
]);

export const projectMembers = pgTable("project_members", {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: 'cascade' }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
    role: text("role").default("member").notNull(), // 'owner', 'member'
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
    uniqueIndex("project_member_unique_idx").on(table.projectId, table.userId),
    index("project_member_user_idx").on(table.userId),
]);

export const projectMessages = pgTable("project_messages", {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: 'cascade' }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
    index("project_message_project_idx").on(table.projectId),
    index("project_message_created_idx").on(table.createdAt),
]);
