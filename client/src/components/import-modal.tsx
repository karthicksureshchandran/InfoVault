import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useCreateProject } from "@/hooks/use-projects";
import { useCreateItem } from "@/hooks/use-items";
import { parseImportData } from "@/lib/export-utils";
import { Upload } from "lucide-react";

interface ImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ImportModal({ open, onOpenChange }: ImportModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  const createProject = useCreateProject();
  const createItem = useCreateItem();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to import",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const content = await file.text();
      const importData = parseImportData(content);
      
      // Create a mapping from old project IDs to new project IDs
      const projectIdMap = new Map<number, number>();
      
      // Import projects first
      for (const project of importData.projects) {
        const newProject = await createProject.mutateAsync({
          name: `${project.name} (Imported)`,
          description: project.description,
        });
        projectIdMap.set(project.id, newProject.id);
      }
      
      // Import items with updated project IDs
      for (const item of importData.items) {
        const newProjectId = projectIdMap.get(item.projectId);
        if (newProjectId) {
          await createItem.mutateAsync({
            type: item.type,
            name: item.name,
            projectId: newProjectId,
            source: item.source ?? null,
            metadata: item.metadata,
            description: item.description ?? null,
            tags: item.tags ?? [],
            thumbnail: item.thumbnail ?? null
          });
        }
      }
      toast({
        title: "Success",
        description: `Successfully imported ${importData.projects.length} projects and ${importData.items.length} items`,
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import data: " + (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Data</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Select Import File</Label>
            <Input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="mt-2"
            />
            <p className="text-xs text-slate-500 mt-1">
              Only JSON files exported from InfoVault are supported
            </p>
          </div>
          
          {file && (
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-slate-600">
                <strong>Selected file:</strong> {file.name}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Size: {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={isLoading || !file}>
              <Upload className="w-4 h-4 mr-2" />
              {isLoading ? "Importing..." : "Import"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
