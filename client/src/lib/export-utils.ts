import { Item, Project } from "@shared/schema";

export interface ExportData {
  projects: Project[];
  items: Item[];
  exportDate: string;
  version: string;
}

export function exportToCSV(items: Item[], projects: Project[]): string {
  const projectMap = new Map(projects.map(p => [p.id, p.name]));
  
  const headers = [
    "ID",
    "Name", 
    "Description",
    "Type",
    "Source",
    "Tags",
    "Project",
    "Created At",
    "Updated At"
  ];
  
  const rows = items.map(item => [
    item.id.toString(),
    item.name,
    item.description || "",
    item.type,
    item.source || "",
    item.tags?.join(", ") || "",
    projectMap.get(item.projectId) || "",
    item.createdAt.toISOString(),
    item.updatedAt.toISOString()
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(","))
    .join("\n");
    
  return csvContent;
}

export function exportToJSON(items: Item[], projects: Project[]): string {
  const exportData: ExportData = {
    projects,
    items,
    exportDate: new Date().toISOString(),
    version: "1.0.0"
  };
  
  return JSON.stringify(exportData, null, 2);
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function parseImportData(content: string): ExportData {
  try {
    const data = JSON.parse(content);
    if (!data.projects || !data.items) {
      throw new Error("Invalid import data format");
    }
    return data;
  } catch (error) {
    throw new Error("Failed to parse import data: " + (error as Error).message);
  }
}
