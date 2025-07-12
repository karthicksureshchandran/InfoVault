import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Item, InsertItem, UpdateItem } from "@shared/schema";

export function useItems(projectId?: number) {
  return useQuery<Item[]>({
    queryKey: projectId ? ["/api/items", { projectId }] : ["/api/items"],
    queryFn: async () => {
      const url = projectId ? `/api/items?projectId=${projectId}` : "/api/items";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch items");
      return response.json();
    },
  });
}

export function useItem(id: number) {
  return useQuery<Item>({
    queryKey: ["/api/items", id],
    enabled: !!id,
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (item: InsertItem) => {
      const response = await apiRequest("POST", "/api/items", item);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, item }: { id: number; item: UpdateItem }) => {
      const response = await apiRequest("PUT", `/api/items/${id}`, item);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
  });
}

export function useSearchItems(query: string, projectId?: number) {
  return useQuery<Item[]>({
    queryKey: ["/api/search", { q: query, projectId }],
    queryFn: async () => {
      const url = projectId 
        ? `/api/search?q=${encodeURIComponent(query)}&projectId=${projectId}`
        : `/api/search?q=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to search items");
      return response.json();
    },
    enabled: !!query,
  });
}
