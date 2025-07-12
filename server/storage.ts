import { projects, items, type Project, type Item, type InsertProject, type InsertItem, type UpdateProject, type UpdateItem } from "@shared/schema";
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import os from 'os';

export interface IStorage {
  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: UpdateProject): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Items
  getItems(projectId?: number): Promise<Item[]>;
  getItem(id: number): Promise<Item | undefined>;
  createItem(item: InsertItem): Promise<Item>;
  updateItem(id: number, item: UpdateItem): Promise<Item | undefined>;
  deleteItem(id: number): Promise<boolean>;
  searchItems(query: string, projectId?: number): Promise<Item[]>;
  getItemsByType(type: string, projectId?: number): Promise<Item[]>;
  getItemsByTags(tags: string[], projectId?: number): Promise<Item[]>;
}

export class SQLiteStorage implements IStorage {
  private db: Database.Database;

  constructor() {
    // Create data directory in user's home folder for desktop app
    const dataDir = path.join(os.homedir(), '.infovault');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const dbPath = path.join(dataDir, 'infovault.db');
    console.log(`InfoVault database location: ${dbPath}`);
    
    this.db = new Database(dbPath);
    
    // Enable WAL mode for better performance
    this.db.pragma('journal_mode = WAL');
    
    this.initializeDatabase();
    this.initializeDefaultData();
  }

  private initializeDatabase() {
    // Create projects table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create items table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        projectId INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL,
        source TEXT,
        tags TEXT, -- JSON array as text
        metadata TEXT, -- JSON object as text
        thumbnail TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (projectId) REFERENCES projects (id) ON DELETE CASCADE
      )
    `);

    // Create indexes for better performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_items_projectId ON items(projectId);
      CREATE INDEX IF NOT EXISTS idx_items_type ON items(type);
      CREATE INDEX IF NOT EXISTS idx_items_name ON items(name);
    `);
  }

  private initializeDefaultData() {
    // Check if we already have data
    const existingProjectsCount = this.db.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number };
    
    if (existingProjectsCount.count === 0) {
      // Add default projects
      const insertProject = this.db.prepare(`
        INSERT INTO projects (name, description, createdAt, updatedAt)
        VALUES (?, ?, datetime('now'), datetime('now'))
      `);

      const defaultProjects = [
        { name: "Web Development", description: "Resources for web development projects" },
        { name: "Design Resources", description: "UI/UX design inspiration and assets" },
        { name: "Learning Materials", description: "Educational content and tutorials" },
      ];

      defaultProjects.forEach(project => {
        insertProject.run(project.name, project.description);
      });

      // Add sample items
      const insertItem = this.db.prepare(`
        INSERT INTO items (projectId, name, description, type, source, tags, metadata, thumbnail, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `);

      const defaultItems = [
        {
          projectId: 1,
          name: "React Documentation",
          description: "Official React documentation for learning and reference",
          type: "url",
          source: "https://react.dev",
          tags: JSON.stringify(["react", "documentation", "frontend"]),
          metadata: null,
          thumbnail: null,
        },
        {
          projectId: 1,
          name: "TypeScript Guide",
          description: "Complete guide to TypeScript programming",
          type: "url",
          source: "https://www.typescriptlang.org/docs/",
          tags: JSON.stringify(["typescript", "programming", "guide"]),
          metadata: null,
          thumbnail: null,
        },
        {
          projectId: 2,
          name: "Design System Examples",
          description: "Collection of modern design systems",
          type: "url",
          source: "https://designsystemsrepo.com",
          tags: JSON.stringify(["design", "ui", "inspiration"]),
          metadata: null,
          thumbnail: null,
        },
        {
          projectId: 3,
          name: "API Best Practices",
          description: "Guidelines for building REST APIs",
          type: "note",
          source: null,
          tags: JSON.stringify(["api", "backend", "best-practices"]),
          metadata: null,
          thumbnail: null,
        },
      ];

      defaultItems.forEach(item => {
        insertItem.run(
          item.projectId,
          item.name,
          item.description,
          item.type,
          item.source,
          item.tags,
          item.metadata,
          item.thumbnail
        );
      });
    }
  }

  private parseDbRow(row: any): Project | Item {
    if (row.tags) {
      try {
        row.tags = JSON.parse(row.tags);
      } catch {
        row.tags = null;
      }
    }
    if (row.metadata) {
      try {
        row.metadata = JSON.parse(row.metadata);
      } catch {
        row.metadata = null;
      }
    }
    if (row.createdAt) row.createdAt = new Date(row.createdAt);
    if (row.updatedAt) row.updatedAt = new Date(row.updatedAt);
    return row;
  }

  async getProjects(): Promise<Project[]> {
    const stmt = this.db.prepare('SELECT * FROM projects ORDER BY updatedAt DESC');
    const rows = stmt.all();
    return rows.map(row => this.parseDbRow(row)) as Project[];
  }

  async getProject(id: number): Promise<Project | undefined> {
    const stmt = this.db.prepare('SELECT * FROM projects WHERE id = ?');
    const row = stmt.get(id);
    return row ? this.parseDbRow(row) as Project : undefined;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const stmt = this.db.prepare(`
      INSERT INTO projects (name, description, createdAt, updatedAt)
      VALUES (?, ?, datetime('now'), datetime('now'))
    `);
    
    const result = stmt.run(insertProject.name, insertProject.description || null);
    const newProject = await this.getProject(result.lastInsertRowid as number);
    return newProject!;
  }

  async updateProject(id: number, updateProject: UpdateProject): Promise<Project | undefined> {
    const setClause = [];
    const values = [];
    
    if (updateProject.name !== undefined) {
      setClause.push('name = ?');
      values.push(updateProject.name);
    }
    if (updateProject.description !== undefined) {
      setClause.push('description = ?');
      values.push(updateProject.description);
    }
    
    if (setClause.length === 0) return this.getProject(id);
    
    setClause.push('updatedAt = datetime("now")');
    values.push(id);
    
    const stmt = this.db.prepare(`
      UPDATE projects SET ${setClause.join(', ')} 
      WHERE id = ?
    `);
    
    stmt.run(...values);
    return this.getProject(id);
  }

  async deleteProject(id: number): Promise<boolean> {
    const stmt = this.db.prepare('DELETE FROM projects WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  async getItems(projectId?: number): Promise<Item[]> {
    let stmt;
    if (projectId) {
      stmt = this.db.prepare('SELECT * FROM items WHERE projectId = ? ORDER BY updatedAt DESC');
      const rows = stmt.all(projectId);
      return rows.map(row => this.parseDbRow(row)) as Item[];
    } else {
      stmt = this.db.prepare('SELECT * FROM items ORDER BY updatedAt DESC');
      const rows = stmt.all();
      return rows.map(row => this.parseDbRow(row)) as Item[];
    }
  }

  async getItem(id: number): Promise<Item | undefined> {
    const stmt = this.db.prepare('SELECT * FROM items WHERE id = ?');
    const row = stmt.get(id);
    return row ? this.parseDbRow(row) as Item : undefined;
  }

  async createItem(insertItem: InsertItem): Promise<Item> {
    const stmt = this.db.prepare(`
      INSERT INTO items (projectId, name, description, type, source, tags, metadata, thumbnail, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);
    
    const tagsJson = insertItem.tags ? JSON.stringify(insertItem.tags) : null;
    const metadataJson = insertItem.metadata ? JSON.stringify(insertItem.metadata) : null;
    
    const result = stmt.run(
      insertItem.projectId,
      insertItem.name,
      insertItem.description || null,
      insertItem.type,
      insertItem.source || null,
      tagsJson,
      metadataJson,
      insertItem.thumbnail || null
    );
    
    const newItem = await this.getItem(result.lastInsertRowid as number);
    return newItem!;
  }

  async updateItem(id: number, updateItem: UpdateItem): Promise<Item | undefined> {
    const setClause = [];
    const values = [];
    
    if (updateItem.projectId !== undefined) {
      setClause.push('projectId = ?');
      values.push(updateItem.projectId);
    }
    if (updateItem.name !== undefined) {
      setClause.push('name = ?');
      values.push(updateItem.name);
    }
    if (updateItem.description !== undefined) {
      setClause.push('description = ?');
      values.push(updateItem.description);
    }
    if (updateItem.type !== undefined) {
      setClause.push('type = ?');
      values.push(updateItem.type);
    }
    if (updateItem.source !== undefined) {
      setClause.push('source = ?');
      values.push(updateItem.source);
    }
    if (updateItem.tags !== undefined) {
      setClause.push('tags = ?');
      values.push(updateItem.tags ? JSON.stringify(updateItem.tags) : null);
    }
    if (updateItem.metadata !== undefined) {
      setClause.push('metadata = ?');
      values.push(updateItem.metadata ? JSON.stringify(updateItem.metadata) : null);
    }
    if (updateItem.thumbnail !== undefined) {
      setClause.push('thumbnail = ?');
      values.push(updateItem.thumbnail);
    }
    
    if (setClause.length === 0) return this.getItem(id);
    
    setClause.push('updatedAt = datetime("now")');
    values.push(id);
    
    const stmt = this.db.prepare(`
      UPDATE items SET ${setClause.join(', ')} 
      WHERE id = ?
    `);
    
    stmt.run(...values);
    return this.getItem(id);
  }

  async deleteItem(id: number): Promise<boolean> {
    const stmt = this.db.prepare('DELETE FROM items WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  async searchItems(query: string, projectId?: number): Promise<Item[]> {
    const searchTerm = `%${query.toLowerCase()}%`;
    let stmt;
    
    if (projectId) {
      stmt = this.db.prepare(`
        SELECT * FROM items 
        WHERE projectId = ? AND (
          LOWER(name) LIKE ? OR 
          LOWER(description) LIKE ? OR 
          LOWER(tags) LIKE ?
        )
        ORDER BY updatedAt DESC
      `);
      const rows = stmt.all(projectId, searchTerm, searchTerm, searchTerm);
      return rows.map(row => this.parseDbRow(row)) as Item[];
    } else {
      stmt = this.db.prepare(`
        SELECT * FROM items 
        WHERE LOWER(name) LIKE ? OR 
              LOWER(description) LIKE ? OR 
              LOWER(tags) LIKE ?
        ORDER BY updatedAt DESC
      `);
      const rows = stmt.all(searchTerm, searchTerm, searchTerm);
      return rows.map(row => this.parseDbRow(row)) as Item[];
    }
  }

  async getItemsByType(type: string, projectId?: number): Promise<Item[]> {
    let stmt;
    if (projectId) {
      stmt = this.db.prepare('SELECT * FROM items WHERE type = ? AND projectId = ? ORDER BY updatedAt DESC');
      const rows = stmt.all(type, projectId);
      return rows.map(row => this.parseDbRow(row)) as Item[];
    } else {
      stmt = this.db.prepare('SELECT * FROM items WHERE type = ? ORDER BY updatedAt DESC');
      const rows = stmt.all(type);
      return rows.map(row => this.parseDbRow(row)) as Item[];
    }
  }

  async getItemsByTags(tags: string[], projectId?: number): Promise<Item[]> {
    const tagConditions = tags.map(() => 'LOWER(tags) LIKE ?').join(' OR ');
    const searchTerms = tags.map(tag => `%"${tag.toLowerCase()}"%`);
    
    let stmt;
    if (projectId) {
      stmt = this.db.prepare(`
        SELECT * FROM items 
        WHERE projectId = ? AND (${tagConditions})
        ORDER BY updatedAt DESC
      `);
      const rows = stmt.all(projectId, ...searchTerms);
      return rows.map(row => this.parseDbRow(row)) as Item[];
    } else {
      stmt = this.db.prepare(`
        SELECT * FROM items 
        WHERE ${tagConditions}
        ORDER BY updatedAt DESC
      `);
      const rows = stmt.all(...searchTerms);
      return rows.map(row => this.parseDbRow(row)) as Item[];
    }
  }
}

export const storage = new SQLiteStorage();