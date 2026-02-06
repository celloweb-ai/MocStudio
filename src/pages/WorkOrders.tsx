import { useState } from "react";
import { Plus, Search, Filter, ClipboardList, Calendar, User, MoreVertical, Eye, Edit, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const workOrders = [
  {
    id: "WO-1852",
    title: "Valve Replacement - V-105",
    moc: "MOC-2024-042",
    facility: "Platform Alpha",
    type: "Corrective",
    status: "In Progress",
    priority: "High",
    assignee: "Team Alpha",
    dueDate: "2024-02-15",
    progress: 65,
  },
  {
    id: "WO-1851",
    title: "Fire Detection Calibration",
    moc: "MOC-2024-045",
    facility: "Platform Beta",
    type: "Preventive",
    status: "Scheduled",
    priority: "Medium",
    assignee: "HSE Team",
    dueDate: "2024-02-18",
    progress: 0,
  },
  {
    id: "WO-1850",
    title: "Compressor Overhaul",
    moc: "MOC-2024-042",
    facility: "Platform Alpha",
    type: "Corrective",
    status: "In Progress",
    priority: "Critical",
    assignee: "Maintenance Crew A",
    dueDate: "2024-02-12",
    progress: 80,
  },
  {
    id: "WO-1849",
    title: "Gas Detector Installation",
    moc: "MOC-2024-040",
    facility: "FPSO Gamma",
    type: "Installation",
    status: "Completed",
    priority: "High",
    assignee: "F&G Team",
    dueDate: "2024-02-08",
    progress: 100,
  },
  {
    id: "WO-1848",
    title: "Control System Update",
    moc: "MOC-2024-044",
    facility: "FPSO Gamma",
    type: "Modification",
    status: "On Hold",
    priority: "Medium",
    assignee: "Automation Team",
    dueDate: "2024-02-20",
    progress: 30,
  },
  {
    id: "WO-1847",
    title: "Safety Valve Testing",
    moc: null,
    facility: "Platform Delta",
    type: "Preventive",
    status: "Completed",
    priority: "Low",
    assignee: "QA Team",
    dueDate: "2024-02-05",
    progress: 100,
  },
];

export default function WorkOrders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-success/20 text-success";
      case "In Progress":
        return "bg-accent/20 text-accent";
      case "Scheduled":
        return "bg-primary/20 text-primary";
      case "On Hold":
        return "bg-warning/20 text-warning";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-destructive/20 text-destructive";
      case "High":
        return "bg-warning/20 text-warning";
      case "Medium":
        return "bg-accent/20 text-accent";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const filteredOrders = workOrders.filter((order) => {
    const matchesSearch =
      order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Work Orders</h1>
          <p className="text-muted-foreground">
            Maintenance and implementation tasks
          </p>
        </div>
        <Button className="gradient-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Create Work Order
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Open", value: 23, color: "text-foreground" },
          { label: "In Progress", value: 8, color: "text-accent" },
          { label: "Due This Week", value: 5, color: "text-warning" },
          { label: "Completed (MTD)", value: 47, color: "text-success" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-4">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search work orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
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

      {/* Work Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="glass-card rounded-xl p-5 hover:border-primary/50 transition-all animate-slide-up"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <ClipboardList className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-primary">{order.id}</span>
                    <Badge className={getPriorityColor(order.priority)}>
                      {order.priority}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-foreground mt-1">{order.title}</h3>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Complete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{order.facility}</span>
                <Badge variant="outline" className="text-xs">
                  {order.type}
                </Badge>
              </div>

              {order.moc && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Related MOC: </span>
                  <span className="text-primary font-mono">{order.moc}</span>
                </div>
              )}

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{order.assignee}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(order.dueDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                  <span className="text-sm font-medium text-foreground">
                    {order.progress}%
                  </span>
                </div>
                <Progress value={order.progress} className="h-2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
