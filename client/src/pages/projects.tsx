import { useState } from "react";
import { Plus, Calendar, FolderOpen, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/sidebar";
import AddProjectModal from "@/components/add-project-modal";
import { useProjects, useDeleteProject } from "@/hooks/use-projects";
import { useItems } from "@/hooks/use-items";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Link } from "wouter";

export default function Projects() {
  const [showAddProject, setShowAddProject] = useState(false);
  const { toast } = useToast();
  
  const { data: projects = [], isLoading } = useProjects();
  const { data: allItems = [] } = useItems();
  const deleteProject = useDeleteProject();

  const getProjectItemCount = (projectId: number) => {
    return allItems.filter(item => item.projectId === projectId).length;
  };

  const handleDeleteProject = async (projectId: number, projectName: string) => {
    if (window.confirm(`Are you sure you want to delete "${projectName}"? This will also delete all items in this project.`)) {
      try {
        await deleteProject.mutateAsync(projectId);
        toast({
          title: "Success",
          description: "Project deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete project",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Projects</h1>
            <p className="text-sm text-slate-500">Manage your project repositories</p>
          </div>
          <Button onClick={() => setShowAddProject(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-slate-600">Loading projects...</p>
              </div>
            </div>
          ) : projects.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <FolderOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  No projects yet
                </h2>
                <p className="text-slate-600 mb-4">
                  Create your first project to start organizing your items
                </p>
                <Button onClick={() => setShowAddProject(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Project
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <FolderOpen className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => {
                            // TODO: Implement edit project functionality
                            toast({
                              title: "Info",
                              description: "Edit project functionality coming soon",
                            });
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => handleDeleteProject(project.id, project.name)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {project.description || "No description"}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        {getProjectItemCount(project.id)} items
                      </Badge>
                      <Link href={`/?project=${project.id}`}>
                        <Button variant="outline" size="sm">
                          Open Project
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      <Calendar className="w-3 h-3" />
                      <span>
                        Updated {format(new Date(project.updatedAt), "MMM d, yyyy")}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddProjectModal
        open={showAddProject}
        onOpenChange={setShowAddProject}
      />
    </div>
  );
}
