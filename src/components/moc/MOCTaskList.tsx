import { useState } from "react";
import { format } from "date-fns";
import {
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  MoreVertical,
  Calendar,
  User,
  Loader2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useMOCTasks, type MOCTask, type CreateTaskData } from "@/hooks/useMOCTasks";
import { useApproverCandidates } from "@/hooks/useProfiles";

interface MOCTaskListProps {
  mocId: string;
}

const statusConfig = {
  pending: { icon: Circle, color: "text-muted-foreground", label: "Pending" },
  in_progress: { icon: Clock, color: "text-blue-400", label: "In Progress" },
  completed: { icon: CheckCircle2, color: "text-primary", label: "Completed" },
  cancelled: { icon: XCircle, color: "text-destructive", label: "Cancelled" },
};

const priorityConfig = {
  low: { color: "bg-muted text-muted-foreground", label: "Low" },
  medium: { color: "bg-accent/20 text-accent-foreground", label: "Medium" },
  high: { color: "bg-warning/20 text-warning", label: "High" },
  critical: { color: "bg-destructive/20 text-destructive", label: "Critical" },
};

export function MOCTaskList({ mocId }: MOCTaskListProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<CreateTaskData>>({
    title: "",
    description: "",
    priority: "medium",
  });

  const { tasks, isLoading, taskStats, createTask, updateTask, deleteTask } = useMOCTasks(mocId);
  const { data: users } = useApproverCandidates();

  const handleCreateTask = () => {
    if (!newTask.title) return;

    createTask.mutate({
      moc_request_id: mocId,
      title: newTask.title,
      description: newTask.description,
      assigned_to: newTask.assigned_to,
      priority: newTask.priority as "low" | "medium" | "high" | "critical",
      due_date: newTask.due_date,
    }, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        setNewTask({ title: "", description: "", priority: "medium" });
      },
    });
  };

  const handleStatusToggle = (task: MOCTask) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    updateTask.mutate({ id: task.id, status: newStatus });
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  const isOverdue = (task: MOCTask) => {
    return task.status !== "completed" && 
           task.status !== "cancelled" && 
           task.due_date && 
           new Date(task.due_date) < new Date();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold">Action Items</h3>
          <p className="text-sm text-muted-foreground">
            {taskStats.completed}/{taskStats.total} completed
            {taskStats.overdue > 0 && (
              <span className="text-destructive ml-2">
                • {taskStats.overdue} overdue
              </span>
            )}
          </p>
        </div>
        <Button size="sm" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Task
        </Button>
      </div>

      {/* Progress Bar */}
      {taskStats.total > 0 && (
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300"
            style={{ width: `${(taskStats.completed / taskStats.total) * 100}%` }}
          />
        </div>
      )}

      {/* Task List */}
      <div className="space-y-2">
        {!tasks || tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No action items yet</p>
            <p className="text-sm">Create tasks to track follow-up actions</p>
          </div>
        ) : (
          tasks.map((task) => {
            const StatusIcon = statusConfig[task.status].icon;
            const overdue = isOverdue(task);

            return (
              <div
                key={task.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors",
                  task.status === "completed" && "opacity-60",
                  overdue && "border-destructive/50 bg-destructive/5"
                )}
              >
                <Checkbox
                  checked={task.status === "completed"}
                  onCheckedChange={() => handleStatusToggle(task)}
                  className="mt-1"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={cn(
                        "font-medium text-sm",
                        task.status === "completed" && "line-through text-muted-foreground"
                      )}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => updateTask.mutate({ id: task.id, status: "in_progress" })}
                        >
                          Mark In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => updateTask.mutate({ id: task.id, status: "completed" })}
                        >
                          Mark Complete
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deleteTask.mutate(task.id)}
                          className="text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge className={cn("text-xs", priorityConfig[task.priority].color)}>
                      {priorityConfig[task.priority].label}
                    </Badge>
                    
                    <div className={cn(
                      "flex items-center gap-1 text-xs",
                      statusConfig[task.status].color
                    )}>
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig[task.status].label}
                    </div>

                    {task.due_date && (
                      <div className={cn(
                        "flex items-center gap-1 text-xs",
                        overdue ? "text-destructive" : "text-muted-foreground"
                      )}>
                        {overdue && <AlertCircle className="h-3 w-3" />}
                        <Calendar className="h-3 w-3" />
                        {format(new Date(task.due_date), "MMM d")}
                      </div>
                    )}

                    {task.assignee && (
                      <div className="flex items-center gap-1">
                        <Avatar className="h-4 w-4">
                          <AvatarFallback className="text-[8px] bg-primary/20 text-primary">
                            {getInitials(task.assignee.full_name, task.assignee.email)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">
                          {task.assignee.full_name || task.assignee.email}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Task Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Action Item</DialogTitle>
            <DialogDescription>
              Add a follow-up task for this MOC request.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Enter task title..."
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Describe the task..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Priority</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask({ ...newTask, priority: value as CreateTaskData["priority"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={newTask.due_date || ""}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Assign To</Label>
              <Select
                value={newTask.assigned_to || ""}
                onValueChange={(value) => setNewTask({ ...newTask, assigned_to: value || undefined })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee..." />
                </SelectTrigger>
                <SelectContent>
                  {users?.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {user.full_name || user.email}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateTask} 
              disabled={!newTask.title || createTask.isPending}
            >
              {createTask.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
