import { useState } from "react";
import { 
  Link, 
  Image, 
  Video, 
  FileText, 
  Code, 
  StickyNote, 
  Bookmark, 
  Archive, 
  Edit, 
  Trash2, 
  ExternalLink,
  Eye,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Item, ItemType } from "@shared/schema";
import { useDeleteItem } from "@/hooks/use-items";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ItemCardProps {
  item: Item;
  onEdit: (item: Item) => void;
}

const itemTypeConfig: Record<ItemType, { icon: any; color: string; actionLabel: string }> = {
  url: { icon: Link, color: "bg-blue-500", actionLabel: "Open" },
  image: { icon: Image, color: "bg-green-500", actionLabel: "Preview" },
  video: { icon: Video, color: "bg-red-500", actionLabel: "Play" },
  document: { icon: FileText, color: "bg-slate-500", actionLabel: "Open" },
  code: { icon: Code, color: "bg-yellow-500", actionLabel: "Open" },
  note: { icon: StickyNote, color: "bg-amber-500", actionLabel: "Edit" },
  reference: { icon: Bookmark, color: "bg-indigo-500", actionLabel: "View" },
  archive: { icon: Archive, color: "bg-gray-500", actionLabel: "Extract" },
};

export default function ItemCard({ item, onEdit }: ItemCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const deleteItem = useDeleteItem();

  const config = itemTypeConfig[item.type as ItemType];
  const IconComponent = config.icon;

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setIsLoading(true);
      try {
        await deleteItem.mutateAsync(item.id);
        toast({
          title: "Success",
          description: "Item deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete item",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAction = () => {
    if (item.type === "url" && item.source) {
      window.open(item.source, "_blank");
    } else if (item.type === "image" && item.source) {
      window.open(item.source, "_blank");
    } else if (item.type === "video" && item.source) {
      window.open(item.source, "_blank");
    } else {
      // For other types, you could implement file opening logic here
      toast({
        title: "Info",
        description: "File opening functionality to be implemented",
      });
    }
  };

  const getActionIcon = () => {
    switch (item.type) {
      case "url":
        return <ExternalLink className="w-3 h-3" />;
      case "image":
        return <Eye className="w-3 h-3" />;
      case "video":
        return <Play className="w-3 h-3" />;
      default:
        return <ExternalLink className="w-3 h-3" />;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <IconComponent className={`w-4 h-4 ${config.color === "bg-blue-500" ? "text-blue-500" : 
              config.color === "bg-green-500" ? "text-green-500" :
              config.color === "bg-red-500" ? "text-red-500" :
              config.color === "bg-slate-500" ? "text-slate-500" :
              config.color === "bg-yellow-500" ? "text-yellow-500" :
              config.color === "bg-amber-500" ? "text-amber-500" :
              config.color === "bg-indigo-500" ? "text-indigo-500" :
              "text-gray-500"}`} />
            <span className="text-sm font-medium text-slate-900 truncate">
              {item.name}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
            >
              <Edit className="w-3 h-3 text-slate-500" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={isLoading}
            >
              <Trash2 className="w-3 h-3 text-red-500" />
            </Button>
          </div>
        </div>

        {/* Thumbnail for images/videos */}
        {(item.type === "image" || item.type === "video") && item.source && (
          <div className="mb-3 relative">
            <img
              src={item.source}
              alt={item.name}
              className="w-full h-24 object-cover rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            {item.type === "video" && (
              <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
                <Play className="text-white w-6 h-6" />
              </div>
            )}
          </div>
        )}

        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
          {item.description || "No description"}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-wrap">
            {item.tags && item.tags.length > 0 && (
              <>
                {item.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {item.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{item.tags.length - 2}
                  </Badge>
                )}
              </>
            )}
          </div>
          <Button
            size="sm"
            variant="default"
            className="text-xs"
            onClick={(e) => {
              e.stopPropagation();
              handleAction();
            }}
          >
            {getActionIcon()}
            <span className="ml-1">{config.actionLabel}</span>
          </Button>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Modified: {format(new Date(item.updatedAt), "MMM d, yyyy")}
            {item.metadata?.size && (
              <span> • {item.metadata.size}</span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
