import { useState } from "react";
import { format } from "date-fns";
import { Send, Paperclip, MoreVertical, Edit, Trash2 } from "lucide-react";
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

interface Comment {
  id: string;
  author: {
    name: string;
    role: string;
    initials: string;
  };
  content: string;
  timestamp: string;
  isOwn?: boolean;
  attachments?: { name: string; size: string }[];
}

const mockComments: Comment[] = [
  {
    id: "1",
    author: { name: "Carlos Silva", role: "Process Engineer", initials: "CS" },
    content: "I've updated the scope to include the additional instrumentation requirements. Please review the changes in the attached document.",
    timestamp: "2024-02-05T10:30:00",
    isOwn: true,
    attachments: [{ name: "scope_update_v2.pdf", size: "2.4 MB" }],
  },
  {
    id: "2",
    author: { name: "Helena Santos", role: "HSE Coordinator", initials: "HS" },
    content: "The safety assessment looks good. I've added a few recommendations for the hot work procedures. Please ensure all personnel are briefed before starting.",
    timestamp: "2024-02-06T14:15:00",
  },
  {
    id: "3",
    author: { name: "Antonio Mendes", role: "Facility Manager", initials: "AM" },
    content: "Approved from my side. Make sure to coordinate with the marine team for vessel positioning during the installation phase.",
    timestamp: "2024-02-06T16:45:00",
  },
  {
    id: "4",
    author: { name: "Ricardo Ferreira", role: "Process Engineer", initials: "RF" },
    content: "I'm reviewing the technical specifications now. A few questions: \n1. What's the expected flow rate through the new manifold?\n2. Have we confirmed the pressure rating compatibility with existing headers?",
    timestamp: "2024-02-08T09:20:00",
  },
];

interface MOCCommentsProps {
  mocId: string;
}

export function MOCComments({ mocId }: MOCCommentsProps) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>(mockComments);

  const handleSubmit = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: { name: "You", role: "Current User", initials: "YO" },
      content: newComment,
      timestamp: new Date().toISOString(),
      isOwn: true,
    };

    setComments([...comments, comment]);
    setNewComment("");
  };

  return (
    <div className="glass-card rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Comments ({comments.length})</h3>
      </div>

      {/* Comments List */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className={cn(
              "p-4 rounded-lg border",
              comment.isOwn ? "bg-primary/5 border-primary/20" : "bg-muted/30 border-border"
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback
                    className={cn(
                      "text-xs",
                      comment.isOwn ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {comment.author.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{comment.author.name}</p>
                  <p className="text-xs text-muted-foreground">{comment.author.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {format(new Date(comment.timestamp), "MMM d, h:mm a")}
                </span>
                {comment.isOwn && (
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
                      <DropdownMenuItem className="text-destructive">
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
                {comment.attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-background border border-border text-sm hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <Paperclip className="h-3 w-3 text-muted-foreground" />
                    <span>{file.name}</span>
                    <span className="text-xs text-muted-foreground">({file.size})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
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
            disabled={!newComment.trim()}
            className="gradient-primary"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Comment
          </Button>
        </div>
      </div>
    </div>
  );
}
