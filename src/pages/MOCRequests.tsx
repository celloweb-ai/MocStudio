import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Filter, FileText, MoreVertical, Eye, Edit, Clock, CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MOCFormWizard, type MOCFormData } from "@/components/moc/MOCFormWizard";
import { useMOCRequests, type CreateMOCData } from "@/hooks/useMOCRequests";
import { useFacilities } from "@/hooks/useFacilities";
import { format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type MOCStatus = Database["public"]["Enums"]["moc_status"];
type MOCPriority = Database["public"]["Enums"]["moc_priority"];

export default function MOCRequests() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { mocRequests, isLoading, createMOC } = useMOCRequests();
  const { facilities } = useFacilities();

  const handleFormSubmit = (data: MOCFormData) => {
    const facilityId = facilities?.find(f => f.code === data.facility || f.name.toLowerCase().includes(data.facility.toLowerCase()))?.id;
    
    const changeTypeMap: Record<string, Database["public"]["Enums"]["moc_change_type"]> = {
      "equipment-modification": "equipment_modification",
      "equipment-replacement": "equipment_replacement",
      "equipment-addition": "equipment_addition",
      "procedure-change": "procedure_change",
      "software-change": "software_change",
      "major-change": "major_change",
    };

    const createData: CreateMOCData = {
      title: data.title,
      description: data.description,
      justification: data.justification,
      facility_id: facilityId || null,
      change_type: changeTypeMap[data.changeType] || null,
      priority: data.priority as MOCPriority,
      is_temporary: data.temporaryOrPermanent === "temporary",
      estimated_duration: data.estimatedDuration,
      affected_systems: data.affectedSystems,
      affected_areas: data.affectedAreas,
      risk_probability: data.probability,
      risk_severity: data.severity,
      risk_category: data.riskCategory,
      mitigation_measures: data.mitigationMeasures,
      requires_hazop: data.requiresHazop,
      target_implementation_date: data.targetImplementationDate?.toISOString().split('T')[0],
      review_deadline: data.reviewDeadline?.toISOString().split('T')[0],
    };

    createMOC.mutate(createData);
    setIsFormOpen(false);
  };

  const handleViewDetails = (mocId: string) => {
    navigate(`/moc-requests/${mocId}`);
  };

  const getStatusInfo = (status: MOCStatus | null) => {
    switch (status) {
      case "draft":
        return { icon: FileText, color: "status-draft", label: "Draft" };
      case "submitted":
        return { icon: Clock, color: "status-submitted", label: "Submitted" };
      case "under_review":
        return { icon: AlertTriangle, color: "status-review", label: "In Review" };
      case "approved":
        return { icon: CheckCircle, color: "status-approved", label: "Approved" };
      case "rejected":
        return { icon: XCircle, color: "status-rejected", label: "Rejected" };
      case "implemented":
        return { icon: CheckCircle, color: "status-implemented", label: "Implemented" };
      default:
        return { icon: FileText, color: "status-draft", label: status || "Unknown" };
    }
  };

  const getPriorityColor = (priority: MOCPriority | null) => {
    switch (priority) {
      case "critical":
        return "bg-destructive/20 text-destructive";
      case "high":
        return "bg-warning/20 text-warning";
      case "medium":
        return "bg-accent/20 text-accent";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getChangeTypeLabel = (type: Database["public"]["Enums"]["moc_change_type"] | null) => {
    const labels: Record<string, string> = {
      equipment_modification: "Equipment Modification",
      equipment_replacement: "Equipment Replacement",
      equipment_addition: "Equipment Addition",
      procedure_change: "Procedure Change",
      software_change: "Software Change",
      major_change: "Major Change",
    };
    return labels[type || ""] || type;
  };

  const filteredMocs = (mocRequests || []).filter((moc) => {
    const matchesSearch =
      moc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      moc.request_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || moc.status === statusFilter;
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && ["submitted", "under_review"].includes(moc.status || "")) ||
      (activeTab === "approved" && moc.status === "approved") ||
      (activeTab === "draft" && moc.status === "draft");
    return matchesSearch && matchesStatus && matchesTab;
  });

  const counts = {
    all: mocRequests?.length || 0,
    pending: mocRequests?.filter((m) => ["submitted", "under_review"].includes(m.status || "")).length || 0,
    approved: mocRequests?.filter((m) => m.status === "approved").length || 0,
    draft: mocRequests?.filter((m) => m.status === "draft").length || 0,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
        <Button 
          className="gradient-primary text-primary-foreground"
          onClick={() => setIsFormOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          New MOC Request
        </Button>
      </div>

      {/* MOC Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle className="text-xl font-semibold">
              New MOC Request
            </DialogTitle>
          </DialogHeader>
          <MOCFormWizard 
            onClose={() => setIsFormOpen(false)} 
            onSubmit={handleFormSubmit}
          />
        </DialogContent>
      </Dialog>

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
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under_review">In Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="implemented">Implemented</SelectItem>
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
                  <TableHead className="text-muted-foreground">Created</TableHead>
                  <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMocs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {mocRequests?.length === 0 
                        ? "No MOC requests yet. Click 'New MOC Request' to create one."
                        : "No MOC requests match your filters."
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMocs.map((moc) => {
                    const statusInfo = getStatusInfo(moc.status);
                    const StatusIcon = statusInfo.icon;
                    const facility = moc.facility as { name: string } | null;
                    const creator = moc.creator as { full_name: string | null; email: string } | null;
                    return (
                      <TableRow key={moc.id} className="border-border hover:bg-muted/30">
                        <TableCell className="font-mono text-sm text-primary">
                          {moc.request_number}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{moc.title}</p>
                            <p className="text-xs text-muted-foreground">
                              by {creator?.full_name || creator?.email || "Unknown"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {facility?.name || "-"}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {getChangeTypeLabel(moc.change_type)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(moc.priority)}>
                            {moc.priority || "medium"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusInfo.label}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {format(new Date(moc.created_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(moc.id)}>
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
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
