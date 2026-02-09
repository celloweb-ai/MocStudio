import { useState } from "react";
import { Search, Filter, ClipboardList, Calendar, User, MoreVertical, Eye, Edit, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useWorkOrders } from "@/hooks/useWorkOrders";
import { AddWorkOrderDialog } from "@/components/workorders/AddWorkOrderDialog";

export default function WorkOrders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { workOrders, isLoading } = useWorkOrders();

  const orders = workOrders ?? [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-success/20 text-success";
      case "In Progress": return "bg-accent/20 text-accent";
      case "Scheduled": return "bg-primary/20 text-primary";
      case "On Hold": return "bg-warning/20 text-warning";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "bg-destructive/20 text-destructive";
      case "High": return "bg-warning/20 text-warning";
      case "Medium": return "bg-accent/20 text-accent";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.order_number ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { label: "Total Open", value: orders.filter((o) => o.status !== "Completed").length, color: "text-foreground" },
    { label: "In Progress", value: orders.filter((o) => o.status === "In Progress").length, color: "text-accent" },
    { label: "On Hold", value: orders.filter((o) => o.status === "On Hold").length, color: "text-warning" },
    { label: "Completed", value: orders.filter((o) => o.status === "Completed").length, color: "text-success" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Work Orders</h1>
          <p className="text-muted-foreground">Maintenance and implementation tasks</p>
        </div>
        <AddWorkOrderDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-4">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search work orders..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Scheduled">Scheduled</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="On Hold">On Hold</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-5 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))
        ) : filteredOrders.length === 0 ? (
          <div className="col-span-2 text-center text-muted-foreground py-12">
            No work orders found. Click "Create Work Order" to add one.
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="glass-card rounded-xl p-5 hover:border-primary/50 transition-all animate-slide-up">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <ClipboardList className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-primary">{order.order_number}</span>
                      <Badge className={getPriorityColor(order.priority)}>{order.priority}</Badge>
                    </div>
                    <h3 className="font-semibold text-foreground mt-1">{order.title}</h3>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />View Details</DropdownMenuItem>
                    <DropdownMenuItem><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                    <DropdownMenuItem><CheckCircle className="h-4 w-4 mr-2" />Mark Complete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{order.facilities?.name ?? "—"}</span>
                  <Badge variant="outline" className="text-xs">{order.work_type}</Badge>
                </div>

                {order.moc_requests && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Related MOC: </span>
                    <span className="text-primary font-mono">{order.moc_requests.request_number}</span>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {order.assignee && (
                    <div className="flex items-center gap-1"><User className="h-4 w-4" /><span>{order.assignee}</span></div>
                  )}
                  {order.due_date && (
                    <div className="flex items-center gap-1"><Calendar className="h-4 w-4" /><span>{new Date(order.due_date).toLocaleDateString()}</span></div>
                  )}
                </div>

                <div className="pt-3 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    <span className="text-sm font-medium text-foreground">{order.progress}%</span>
                  </div>
                  <Progress value={order.progress} className="h-2" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
