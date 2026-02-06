import { useState } from "react";
import { Plus, Search, Filter, FileText, MoreVertical, Eye, Edit, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mocRequests = [
  {
    id: "MOC-2024-045",
    title: "Fire Detection System Upgrade",
    facility: "Platform Beta",
    type: "Equipment Modification",
    status: "Submitted",
    priority: "High",
    submittedBy: "Maria Santos",
    submittedDate: "2024-02-08",
    dueDate: "2024-02-22",
  },
  {
    id: "MOC-2024-044",
    title: "Process Control Logic Change",
    facility: "FPSO Gamma",
    type: "Procedure Change",
    status: "In Review",
    priority: "Medium",
    submittedBy: "João Oliveira",
    submittedDate: "2024-02-07",
    dueDate: "2024-02-21",
  },
  {
    id: "MOC-2024-043",
    title: "Wellhead Platform Integration",
    facility: "Platform Alpha",
    type: "Major Change",
    status: "In Review",
    priority: "Critical",
    submittedBy: "Carlos Silva",
    submittedDate: "2024-02-05",
    dueDate: "2024-02-19",
  },
  {
    id: "MOC-2024-042",
    title: "Compressor Replacement",
    facility: "Platform Alpha",
    type: "Equipment Replacement",
    status: "Approved",
    priority: "High",
    submittedBy: "Ana Costa",
    submittedDate: "2024-02-01",
    dueDate: "2024-02-15",
  },
  {
    id: "MOC-2024-041",
    title: "Emergency Procedure Update",
    facility: "Platform Delta",
    type: "Procedure Change",
    status: "Draft",
    priority: "Medium",
    submittedBy: "Pedro Almeida",
    submittedDate: "2024-01-30",
    dueDate: "2024-02-13",
  },
  {
    id: "MOC-2024-040",
    title: "Gas Detection Sensor Addition",
    facility: "FPSO Gamma",
    type: "Equipment Addition",
    status: "Implemented",
    priority: "High",
    submittedBy: "João Oliveira",
    submittedDate: "2024-01-25",
    dueDate: "2024-02-08",
  },
  {
    id: "MOC-2024-039",
    title: "Valve Configuration Change",
    facility: "Platform Beta",
    type: "Equipment Modification",
    status: "Rejected",
    priority: "Low",
    submittedBy: "Maria Santos",
    submittedDate: "2024-01-22",
    dueDate: "2024-02-05",
  },
];

export default function MOCRequests() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "Draft":
        return { icon: FileText, color: "status-draft", label: "Draft" };
      case "Submitted":
        return { icon: Clock, color: "status-submitted", label: "Submitted" };
      case "In Review":
        return { icon: AlertTriangle, color: "status-review", label: "In Review" };
      case "Approved":
        return { icon: CheckCircle, color: "status-approved", label: "Approved" };
      case "Rejected":
        return { icon: XCircle, color: "status-rejected", label: "Rejected" };
      case "Implemented":
        return { icon: CheckCircle, color: "status-implemented", label: "Implemented" };
      default:
        return { icon: FileText, color: "status-draft", label: status };
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

  const filteredMocs = mocRequests.filter((moc) => {
    const matchesSearch =
      moc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      moc.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || moc.status === statusFilter;
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && ["Submitted", "In Review"].includes(moc.status)) ||
      (activeTab === "approved" && moc.status === "Approved") ||
      (activeTab === "draft" && moc.status === "Draft");
    return matchesSearch && matchesStatus && matchesTab;
  });

  const counts = {
    all: mocRequests.length,
    pending: mocRequests.filter((m) => ["Submitted", "In Review"].includes(m.status)).length,
    approved: mocRequests.filter((m) => m.status === "Approved").length,
    draft: mocRequests.filter((m) => m.status === "Draft").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">MOC Requests</h1>
          <p className="text-muted-foreground">
            Management of Change requests and approvals
          </p>
        </div>
        <Button className="gradient-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          New MOC Request
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all" className="data-[state=active]:bg-background">
            All ({counts.all})
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-background">
            Pending ({counts.pending})
          </TabsTrigger>
          <TabsTrigger value="approved" className="data-[state=active]:bg-background">
            Approved ({counts.approved})
          </TabsTrigger>
          <TabsTrigger value="draft" className="data-[state=active]:bg-background">
            Drafts ({counts.draft})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {/* Filters */}
          <div className="flex gap-4 flex-wrap mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or MOC ID..."
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
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Submitted">Submitted</SelectItem>
                <SelectItem value="In Review">In Review</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Implemented">Implemented</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="glass-card rounded-xl overflow-hidden animate-slide-up">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">MOC ID</TableHead>
                  <TableHead className="text-muted-foreground">Title</TableHead>
                  <TableHead className="text-muted-foreground">Facility</TableHead>
                  <TableHead className="text-muted-foreground">Type</TableHead>
                  <TableHead className="text-muted-foreground">Priority</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Due Date</TableHead>
                  <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMocs.map((moc) => {
                  const statusInfo = getStatusInfo(moc.status);
                  const StatusIcon = statusInfo.icon;
                  return (
                    <TableRow key={moc.id} className="border-border hover:bg-muted/30">
                      <TableCell className="font-mono text-sm text-primary">
                        {moc.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{moc.title}</p>
                          <p className="text-xs text-muted-foreground">
                            by {moc.submittedBy}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{moc.facility}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {moc.type}
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(moc.priority)}>
                          {moc.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusInfo.label}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(moc.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
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
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
