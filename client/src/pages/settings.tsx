import { useState } from "react";
import { Settings as SettingsIcon, Download, Upload, Trash2, HardDrive, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/sidebar";
import ExportModal from "@/components/export-modal";
import ImportModal from "@/components/import-modal";
import { useProjects } from "@/hooks/use-projects";
import { useItems } from "@/hooks/use-items";

export default function Settings() {
  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const { toast } = useToast();
  
  const { data: projects = [] } = useProjects();
  const { data: allItems = [] } = useItems();

  const handleClearCache = () => {
    if (window.confirm("Are you sure you want to clear the application cache? This will not delete your data.")) {
      // Clear localStorage/sessionStorage if needed
      localStorage.removeItem("infovault-cache");
      sessionStorage.clear();
      
      toast({
        title: "Success",
        description: "Application cache cleared successfully",
      });
    }
  };

  const handleResetApp = () => {
    if (window.confirm("Are you sure you want to reset the application? This will delete ALL your data and cannot be undone.")) {
      if (window.confirm("This is permanent! Are you absolutely sure?")) {
        // This would reset the storage in a real app
        toast({
          title: "Info",
          description: "Reset functionality is disabled in demo mode",
        });
      }
    }
  };

  const getTotalDataSize = () => {
    // Estimate data size (in a real app, this would be more accurate)
    const dataSize = JSON.stringify({ projects, items: allItems }).length;
    return (dataSize / 1024).toFixed(2) + " KB";
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center px-6">
          <div className="flex items-center space-x-3">
            <SettingsIcon className="w-6 h-6 text-slate-600" />
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Settings</h1>
              <p className="text-sm text-slate-500">Manage your InfoVault preferences</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Application Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5" />
                  <span>Application Information</span>
                </CardTitle>
                <CardDescription>
                  Information about your InfoVault installation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{projects.length}</div>
                    <div className="text-sm text-slate-600">Projects</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-bold text-accent">{allItems.length}</div>
                    <div className="text-sm text-slate-600">Items</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-bold text-secondary">{getTotalDataSize()}</div>
                    <div className="text-sm text-slate-600">Data Size</div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Version</span>
                    <Badge variant="outline">1.0.0</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Storage</span>
                    <Badge variant="outline">Local Memory</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Last Updated</span>
                    <Badge variant="outline">
                      {new Date().toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HardDrive className="w-5 h-5" />
                  <span>Data Management</span>
                </CardTitle>
                <CardDescription>
                  Export, import, and manage your data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Export Data</h4>
                    <p className="text-sm text-slate-600">
                      Export all your projects and items to CSV or JSON format
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setShowExport(true)}
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Import Data</h4>
                    <p className="text-sm text-slate-600">
                      Import projects and items from a JSON export file
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setShowImport(true)}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Import Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Application Maintenance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trash2 className="w-5 h-5" />
                  <span>Application Maintenance</span>
                </CardTitle>
                <CardDescription>
                  Maintenance tools and cleanup options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Clear Cache</h4>
                    <p className="text-sm text-slate-600">
                      Clear temporary files and cached data
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleClearCache}
                      className="w-full"
                    >
                      Clear Cache
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-red-600">Reset Application</h4>
                    <p className="text-sm text-slate-600">
                      Delete all data and reset to factory defaults
                    </p>
                    <Button
                      variant="destructive"
                      onClick={handleResetApp}
                      className="w-full"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Reset App
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help & Support */}
            <Card>
              <CardHeader>
                <CardTitle>Help & Support</CardTitle>
                <CardDescription>
                  Get help and learn more about InfoVault
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4">
                  <h4 className="font-medium mb-2">About InfoVault</h4>
                  <p className="text-sm text-slate-600 mb-4">
                    InfoVault is a personal repository manager designed to help you organize 
                    and manage all your important digital assets in one place. All data is 
                    stored locally for complete privacy.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Privacy First</Badge>
                    <Badge variant="secondary">Local Storage</Badge>
                    <Badge variant="secondary">No Cloud Sync</Badge>
                    <Badge variant="secondary">Open Source</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ExportModal
        open={showExport}
        onOpenChange={setShowExport}
      />
      
      <ImportModal
        open={showImport}
        onOpenChange={setShowImport}
      />
    </div>
  );
}
