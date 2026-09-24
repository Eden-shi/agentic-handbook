import { pgTable, uuid, varchar, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('app_user', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  username: varchar('username', { length: 100 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: varchar('role', { length: 20 }).default('user').notNull(),
  banned: boolean('banned').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const learningStages = pgTable('learning_stage', {
  id: uuid('id').primaryKey().defaultRandom(),
  stageNumber: integer('stage_number').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  subtitle: varchar('subtitle', { length: 500 }),
  description: text('description'),
  content: text('content'),
  duration: varchar('duration', { length: 100 }),
  topics: text('topics').array().default([]),
  resources: text('resources').array().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const practiceProjects = pgTable('practice_project', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectNumber: integer('project_number').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  difficulty: varchar('difficulty', { length: 50 }),
  description: text('description'),
  content: text('content'),
  duration: varchar('duration', { length: 100 }),
  prerequisites: text('prerequisites').array().default([]),
  deliverables: text('deliverables').array().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const learningResources = pgTable('learning_resource', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  description: text('description'),
  url: varchar('url', { length: 500 }),
  stageNumber: integer('stage_number'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const experiments = pgTable('experiment', {
  id: uuid('id').primaryKey().defaultRandom(),
  expNumber: integer('exp_number').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }),
  description: text('description'),
  content: text('content'),
  difficulty: varchar('difficulty', { length: 50 }),
  duration: varchar('duration', { length: 100 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const userProgress = pgTable('user_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  itemType: varchar('item_type', { length: 50 }).notNull(),
  itemId: varchar('item_id', { length: 100 }).notNull(),
  isCompleted: boolean('is_completed').default(false).notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const learningNotes = pgTable('learning_note', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  relatedType: varchar('related_type', { length: 50 }),
  relatedId: varchar('related_id', { length: 100 }),
  relatedTitle: varchar('related_title', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
