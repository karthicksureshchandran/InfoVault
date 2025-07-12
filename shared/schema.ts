import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // url, image, video, document, code, note, reference, archive
  source: text("source"), // URL or file path
  tags: text("tags").array().default([]),
  metadata: jsonb("metadata"), // Store additional metadata like file size, dimensions, etc.
  thumbnail: text("thumbnail"), // Path to thumbnail image
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertItemSchema = createInsertSchema(items).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateProjectSchema = insertProjectSchema.partial();
export const updateItemSchema = insertItemSchema.partial();

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertItem = z.infer<typeof insertItemSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;
export type UpdateItem = z.infer<typeof updateItemSchema>;
export type Project = typeof projects.$inferSelect;
export type Item = typeof items.$inferSelect;

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export const ItemTypeEnum = z.enum([
  "url",
  "image", 
  "video",
  "document",
  "code",
  "note",
  "reference",
  "archive"
]);

export type ItemType = z.infer<typeof ItemTypeEnum>;
