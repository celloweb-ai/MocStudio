import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  category: "system" | "moc_status" | "moc_approval" | "task_assigned" | "task_due" | "comment";
  reference_type: string | null;
  reference_id: string | null;
  is_read: boolean;
  email_sent: boolean;
  created_at: string;
}

interface SendEmailParams {
  notificationId?: string;
  toEmail: string;
  toName?: string;
  subject: string;
  notificationType: Notification["category"];
  data: {
    moc_title?: string;
    moc_number?: string;
    moc_id?: string;
    task_title?: string;
    task_id?: string;
    old_status?: string;
    new_status?: string;
    due_date?: string;
    assigned_by?: string;
    action_url?: string;
  };
}

export function useNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: notifications, isLoading, error } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as Notification[];
    },
    enabled: !!user,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("is_read", false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // Manual email sending for cases where you want to trigger emails directly
  const sendEmail = useMutation({
    mutationFn: async (params: SendEmailParams) => {
      const { data, error } = await supabase.functions.invoke("send-notification-email", {
        body: {
          notification_id: params.notificationId,
          to_email: params.toEmail,
          to_name: params.toName,
          subject: params.subject,
          notification_type: params.notificationType,
          data: params.data,
        },
      });

      if (error) throw error;
      return data;
    },
  });

  return {
    notifications,
    isLoading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    sendEmail,
  };
}

export type { Notification, SendEmailParams };
