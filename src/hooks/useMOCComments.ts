import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export function useMOCComments(mocId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: comments, isLoading, error } = useQuery({
    queryKey: ["moc-comments", mocId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("moc_comments")
        .select(`
          *,
          attachments:moc_attachments(id, file_name, file_size, file_path)
        `)
        .eq("moc_request_id", mocId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Fetch author profiles
      const userIds = [...new Set(data.map(c => c.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email, department")
        .in("id", userIds);
      
      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
      
      return data.map(comment => ({
        ...comment,
        author: profileMap.get(comment.user_id) || null,
      }));
    },
    enabled: !!user && !!mocId,
  });

  const addComment = useMutation({
    mutationFn: async (data: { content: string; parentCommentId?: string }) => {
      if (!user) throw new Error("User not authenticated");

      const { data: result, error } = await supabase
        .from("moc_comments")
        .insert({
          moc_request_id: mocId,
          user_id: user.id,
          content: data.content,
          parent_comment_id: data.parentCommentId || null,
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moc-comments", mocId] });
      toast({
        title: "Comment Added",
        description: "Your comment has been posted.",
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

  const updateComment = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const { data: result, error } = await supabase
        .from("moc_comments")
        .update({ content })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moc-comments", mocId] });
      toast({
        title: "Comment Updated",
        description: "Your comment has been updated.",
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

  const deleteComment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("moc_comments")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moc-comments", mocId] });
      toast({
        title: "Comment Deleted",
        description: "The comment has been removed.",
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

  return {
    comments,
    isLoading,
    error,
    addComment,
    updateComment,
    deleteComment,
  };
}
