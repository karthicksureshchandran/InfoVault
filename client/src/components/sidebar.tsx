import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Home, Folder, Search, Settings, Plus, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import RandomQuote from "./random-quote";
import AddProjectModal from "./add-project-modal";
import AboutModal from "./about-modal";
import { useProjects } from "@/hooks/use-projects";
import { useItems } from "@/hooks/use-items";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [location] = useLocation();
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const { data: projects = [] } = useProjects();
  const { data: allItems = [] } = useItems();

  const getProjectItemCount = (projectId: number) => {
    return allItems.filter(item => item.projectId === projectId).length;
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/projects", label: "Projects", icon: Folder },
    { path: "/search", label: "Search", icon: Search },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col h-screen">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Database className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">InfoVault</h1>
              <p className="text-sm text-slate-500">Personal Repository</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <a
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                  location === item.path
                    ? "bg-primary text-white"
                    : "text-slate-700 hover:bg-slate-100"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </a>
            </Link>
          ))}
        </nav>

        {/* Projects List */}
        <div className="flex-1 p-4 min-h-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Projects</h3>
            <Button
              size="sm"
              variant="default"
              className="w-6 h-6 p-0"
              onClick={() => setShowAddProject(true)}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
          <ScrollArea className="h-full">
            <div className="space-y-2">
              {projects.map((project) => (
                <Link key={project.id} href={`/?project=${project.id}`}>
                  <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-100 cursor-pointer">
                    <Folder className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium text-slate-700 flex-1">
                      {project.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      {getProjectItemCount(project.id)} items
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Random Quote */}
        <div className="p-4 border-t border-slate-200">
          <RandomQuote />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200">
          <Button
            variant="ghost"
            className="w-full justify-center"
            onClick={() => setShowAbout(true)}
          >
            <span className="text-sm text-slate-600">About InfoVault</span>
          </Button>
        </div>
      </div>

      <AddProjectModal
        open={showAddProject}
        onOpenChange={setShowAddProject}
      />
      <AboutModal
        open={showAbout}
        onOpenChange={setShowAbout}
      />
    </>
  );
}
