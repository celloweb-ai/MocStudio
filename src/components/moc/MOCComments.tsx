import { useState } from "react";
import { format } from "date-fns";
import { Send, Paperclip, MoreVertical, Edit, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useMOCComments } from "@/hooks/useMOCComments";
import { useAuth } from "@/contexts/AuthContext";

interface MOCCommentsProps {
  mocId: string;
}

export function MOCComments({ mocId }: MOCCommentsProps) {
  const [newComment, setNewComment] = useState("");
  const { user } = useAuth();
  const { comments, isLoading, addComment, deleteComment } = useMOCComments(mocId);

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    addComment.mutate({ content: newComment });
    setNewComment("");
  };

  const handleDelete = (commentId: string) => {
    deleteComment.mutate(commentId);
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Comments ({comments?.length || 0})</h3>
      </div>

      {/* Comments List */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {(!comments || comments.length === 0) ? (
          <p className="text-muted-foreground text-center py-8">
            No comments yet. Be the first to add one.
          </p>
        ) : (
          comments.map((comment) => {
            const isOwn = comment.user_id === user?.id;
            const author = comment.author as { full_name: string | null; email: string; department: string | null } | null;
            return (
              <div
                key={comment.id}
                className={cn(
                  "p-4 rounded-lg border",
                  isOwn ? "bg-primary/5 border-primary/20" : "bg-muted/30 border-border"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback
                        className={cn(
                          "text-xs",
                          isOwn ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        )}
                      >
                        {getInitials(author?.full_name || null, author?.email || "?")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{author?.full_name || author?.email || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">{author?.department || "Team Member"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(comment.created_at), "MMM d, h:mm a")}
                    </span>
                    {isOwn && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(comment.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
                <p className="text-sm whitespace-pre-line">{comment.content}</p>
                
                {comment.attachments && comment.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {comment.attachments.map((file) => (
                      <div
                        key={file.id}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-background border border-border text-sm hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <Paperclip className="h-3 w-3 text-muted-foreground" />
                        <span>{file.file_name}</span>
                        {file.file_size && (
                          <span className="text-xs text-muted-foreground">({file.file_size})</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* New Comment Input */}
      <div className="space-y-3 pt-4 border-t border-border">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px] resize-none"
        />
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm">
            <Paperclip className="h-4 w-4 mr-2" />
            Attach File
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!newComment.trim() || addComment.isPending}
            className="gradient-primary"
          >
            {addComment.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Send Comment
          </Button>
        </div>
      </div>
    </div>
  );
}
