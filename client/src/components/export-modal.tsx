import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useItems } from "@/hooks/use-items";
import { useProjects } from "@/hooks/use-projects";
import { exportToCSV, exportToJSON, downloadFile } from "@/lib/export-utils";
import { Download } from "lucide-react";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: number;
}

export default function ExportModal({ open, onOpenChange, projectId }: ExportModalProps) {
  const [format, setFormat] = useState("csv");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const { data: items = [] } = useItems(projectId);
  const { data: projects = [] } = useProjects();

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const projectName = projectId 
        ? projects.find(p => p.id === projectId)?.name || 'project'
        : 'all-projects';
      
      if (format === "csv") {
        const csvContent = exportToCSV(items, projects);
        downloadFile(csvContent, `infovault-${projectName}-${timestamp}.csv`, "text/csv");
      } else if (format === "json") {
        const jsonContent = exportToJSON(items, projects);
        downloadFile(jsonContent, `infovault-${projectName}-${timestamp}.json`, "application/json");
      }
      
      toast({
        title: "Success",
        description: `Export completed successfully as ${format.toUpperCase()}`,
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data",
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
          <DialogTitle>Export Data</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Export Format</Label>
            <RadioGroup value={format} onValueChange={setFormat} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="cursor-pointer">
                  CSV (Comma Separated Values)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json" className="cursor-pointer">
                  JSON (JavaScript Object Notation)
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-sm text-slate-600">
              <strong>Export includes:</strong>
            </p>
            <ul className="text-sm text-slate-600 mt-2 space-y-1">
              <li>• {items.length} items</li>
              <li>• {projectId ? "Current project" : `${projects.length} projects`}</li>
              <li>• All metadata and tags</li>
            </ul>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isLoading}>
              <Download className="w-4 h-4 mr-2" />
              {isLoading ? "Exporting..." : "Export"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
