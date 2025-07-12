import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Plus, 
  Grid3X3, 
  List,
  SortAsc,
  SortDesc
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/sidebar";
import ItemCard from "@/components/item-card";
import AddItemModal from "@/components/add-item-modal";
import EditItemModal from "@/components/edit-item-modal";
import FilterModal, { FilterState } from "@/components/filter-modal";
import ExportModal from "@/components/export-modal";
import ImportModal from "@/components/import-modal";
import { useItems } from "@/hooks/use-items";
import { useProjects } from "@/hooks/use-projects";
import { Item } from "@shared/schema";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAddItem, setShowAddItem] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [filters, setFilters] = useState<FilterState>({ types: [], dateRange: "" });

  // Get project ID from URL
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const projectId = urlParams.get('project') ? parseInt(urlParams.get('project')!) : undefined;

  const { data: items = [], isLoading } = useItems(projectId);
  const { data: projects = [] } = useProjects();

  const currentProject = projectId ? projects.find(p => p.id === projectId) : null;

  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...items];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply type filters
    if (filters.types.length > 0) {
      filtered = filtered.filter(item => filters.types.includes(item.type));
    }

    // Apply date range filter
    if (filters.dateRange) {
      const now = new Date();
      const startDate = new Date();
      
      switch (filters.dateRange) {
        case "today":
          startDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          startDate.setDate(now.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(item => 
        new Date(item.updatedAt) >= startDate
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "date") {
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      } else if (sortBy === "type") {
        comparison = a.type.localeCompare(b.type);
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [items, searchQuery, filters, sortBy, sortOrder]);

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setShowEditItem(true);
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-slate-900">
                {currentProject?.name || "All Projects"}
              </span>
              <span className="text-sm text-slate-500">
                ({filteredAndSortedItems.length} items)
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10"
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            </div>
            
            {/* Sort */}
            <div className="flex items-center space-x-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSortOrder}
              >
                {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>
            </div>
            
            {/* Filter */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilter(true)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
              {(filters.types.length > 0 || filters.dateRange) && (
                <Badge variant="secondary" className="ml-2">
                  {filters.types.length + (filters.dateRange ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="h-12 bg-slate-50 border-b border-slate-200 flex items-center justify-between px-6">
          <div className="flex items-center space-x-3">
            <Button
              size="sm"
              onClick={() => setShowAddItem(true)}
              disabled={!currentProject}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowImport(true)}
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExport(true)}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("grid")}
              className={cn(viewMode === "grid" && "bg-slate-200")}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("list")}
              className={cn(viewMode === "list" && "bg-slate-200")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!currentProject ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  Welcome to InfoVault
                </h2>
                <p className="text-slate-600 mb-4">
                  Select a project from the sidebar to view and manage your items
                </p>
              </div>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-slate-600">Loading items...</p>
              </div>
            </div>
          ) : filteredAndSortedItems.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  No items found
                </h2>
                <p className="text-slate-600 mb-4">
                  {searchQuery || filters.types.length > 0 || filters.dateRange
                    ? "Try adjusting your search or filters"
                    : "Start by adding your first item to this project"
                  }
                </p>
                {!searchQuery && filters.types.length === 0 && !filters.dateRange && (
                  <Button onClick={() => setShowAddItem(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Item
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className={cn(
              viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            )}>
              {filteredAndSortedItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onEdit={handleEditItem}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {currentProject && (
        <AddItemModal
          open={showAddItem}
          onOpenChange={setShowAddItem}
          projectId={currentProject.id}
        />
      )}
      
      <EditItemModal
        open={showEditItem}
        onOpenChange={setShowEditItem}
        item={editingItem}
      />
      
      <FilterModal
        open={showFilter}
        onOpenChange={setShowFilter}
        onApplyFilters={handleApplyFilters}
      />
      
      <ExportModal
        open={showExport}
        onOpenChange={setShowExport}
        projectId={projectId}
      />
      
      <ImportModal
        open={showImport}
        onOpenChange={setShowImport}
      />
    </div>
  );
}
