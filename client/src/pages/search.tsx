import { useState, useMemo } from "react";
import { Search as SearchIcon, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Sidebar from "@/components/sidebar";
import ItemCard from "@/components/item-card";
import EditItemModal from "@/components/edit-item-modal";
import FilterModal, { FilterState } from "@/components/filter-modal";
import { useItems } from "@/hooks/use-items";
import { useProjects } from "@/hooks/use-projects";
import { Item } from "@shared/schema";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [showEditItem, setShowEditItem] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [filters, setFilters] = useState<FilterState>({ types: [], dateRange: "" });

  const { data: allItems = [] } = useItems();
  const { data: projects = [] } = useProjects();

  const filteredItems = useMemo(() => {
    let filtered = [...allItems];

    // Apply project filter
    if (selectedProject !== "all") {
      filtered = filtered.filter(item => item.projectId === parseInt(selectedProject));
    }

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

    return filtered;
  }, [allItems, searchQuery, selectedProject, filters]);

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setShowEditItem(true);
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Search</h1>
            <p className="text-sm text-slate-500">Find items across all projects</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white border-b border-slate-200 p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Input
                placeholder="Search items by name, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <SearchIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            </div>
            
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id.toString()}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
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

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4">
            <p className="text-sm text-slate-600">
              {searchQuery ? (
                <>
                  Found {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''} for "{searchQuery}"
                </>
              ) : (
                <>
                  {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} total
                </>
              )}
            </p>
          </div>

          {filteredItems.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <SearchIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  {searchQuery ? "No items found" : "Start searching"}
                </h2>
                <p className="text-slate-600">
                  {searchQuery 
                    ? "Try adjusting your search terms or filters"
                    : "Enter a search query to find items across all projects"
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="space-y-2">
                  <ItemCard
                    item={item}
                    onEdit={handleEditItem}
                  />
                  <div className="text-xs text-slate-500">
                    in {projects.find(p => p.id === item.projectId)?.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
    </div>
  );
}
