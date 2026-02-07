import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface MOCTask {
  id: string;
  moc_request_id: string;
  title: string;
  description: string | null;
  assigned_to: string | null;
  created_by: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "critical";
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  assignee?: {
    id: string;
    full_name: string | null;
    email: string;
  } | null;
  creator?: {
    id: string;
    full_name: string | null;
    email: string;
  } | null;
}

interface CreateTaskData {
  moc_request_id: string;
  title: string;
  description?: string;
  assigned_to?: string;
  priority?: "low" | "medium" | "high" | "critical";
  due_date?: string;
}

interface UpdateTaskData {
  id: string;
  title?: string;
  description?: string;
  assigned_to?: string | null;
  status?: "pending" | "in_progress" | "completed" | "cancelled";
  priority?: "low" | "medium" | "high" | "critical";
  due_date?: string | null;
}

export function useMOCTasks(mocId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ["moc-tasks", mocId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("moc_tasks")
        .select("*")
        .eq("moc_request_id", mocId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch profiles for assignees and creators
      const userIds = [...new Set([
        ...data.map(t => t.assigned_to).filter(Boolean),
        ...data.map(t => t.created_by)
      ])];

      if (userIds.length === 0) return data as MOCTask[];

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      return data.map(task => ({
        ...task,
        assignee: task.assigned_to ? profileMap.get(task.assigned_to) || null : null,
        creator: profileMap.get(task.created_by) || null,
      })) as MOCTask[];
    },
    enabled: !!user && !!mocId,
  });

  const createTask = useMutation({
    mutationFn: async (data: CreateTaskData) => {
      if (!user) throw new Error("User not authenticated");

      const { data: result, error } = await supabase
        .from("moc_tasks")
        .insert({
          moc_request_id: data.moc_request_id,
          title: data.title,
          description: data.description || null,
          assigned_to: data.assigned_to || null,
          created_by: user.id,
          priority: data.priority || "medium",
          due_date: data.due_date || null,
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moc-tasks", mocId] });
      toast({
        title: "Task Created",
        description: "The action item has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, ...data }: UpdateTaskData) => {
      const updateData: Record<string, unknown> = { ...data };
      
      // Set completed_at when status changes to completed
      if (data.status === "completed") {
        updateData.completed_at = new Date().toISOString();
      } else if (data.status) {
        updateData.completed_at = null;
      }

      const { data: result, error } = await supabase
        .from("moc_tasks")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moc-tasks", mocId] });
      toast({
        title: "Task Updated",
        description: "The action item has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("moc_tasks")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moc-tasks", mocId] });
      toast({
        title: "Task Deleted",
        description: "The action item has been removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const taskStats = {
    total: tasks?.length || 0,
    pending: tasks?.filter(t => t.status === "pending").length || 0,
    inProgress: tasks?.filter(t => t.status === "in_progress").length || 0,
    completed: tasks?.filter(t => t.status === "completed").length || 0,
    overdue: tasks?.filter(t => 
      t.status !== "completed" && 
      t.status !== "cancelled" && 
      t.due_date && 
      new Date(t.due_date) < new Date()
    ).length || 0,
  };

  return {
    tasks,
    isLoading,
    error,
    taskStats,
    createTask,
    updateTask,
    deleteTask,
  };
}

export type { MOCTask, CreateTaskData, UpdateTaskData };
