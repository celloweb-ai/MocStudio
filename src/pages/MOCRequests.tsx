import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Filter, FileText, MoreVertical, Eye, Edit, Clock, CheckCircle, XCircle, AlertTriangle, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { MOCFormWizard, type MOCFormData } from "@/components/moc/MOCFormWizard";
import { useMOCRequests, type CreateMOCData } from "@/hooks/useMOCRequests";
import { useFacilities } from "@/hooks/useFacilities";
import { generateMOCExportData, downloadCSV } from "@/hooks/useMOCReporting";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Database } from "@/integrations/supabase/types";

type MOCStatus = Database["public"]["Enums"]["moc_status"];
type MOCPriority = Database["public"]["Enums"]["moc_priority"];

export default function MOCRequests() {
  const navigate = useNavigate();
  const { t } = useLanguage();
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

    const createData: CreateMOCData & { approverIds?: string[] } = {
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
      approverIds: data.requiredApprovers,
    };

    createMOC.mutate(createData);
    setIsFormOpen(false);
  };

  const handleViewDetails = (mocId: string) => navigate(`/moc-requests/${mocId}`);
  const handleEditRequest = (mocId: string) => navigate(`/moc-requests/${mocId}`);

  const getStatusInfo = (status: MOCStatus | null) => {
    switch (status) {
      case "draft": return { icon: FileText, color: "status-draft", label: t("moc.draft") };
      case "submitted": return { icon: Clock, color: "status-submitted", label: t("moc.submitted") };
      case "under_review": return { icon: AlertTriangle, color: "status-review", label: t("moc.inReview") };
      case "approved": return { icon: CheckCircle, color: "status-approved", label: t("moc.approved") };
      case "rejected": return { icon: XCircle, color: "status-rejected", label: t("moc.rejected") };
      case "implemented": return { icon: CheckCircle, color: "status-implemented", label: t("moc.implemented") };
      default: return { icon: FileText, color: "status-draft", label: status || t("moc.unknown") };
    }
  };

  const getPriorityColor = (priority: MOCPriority | null) => {
    switch (priority) {
      case "critical": return "bg-destructive/20 text-destructive";
      case "high": return "bg-warning/20 text-warning";
      case "medium": return "bg-accent/20 text-accent";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getChangeTypeLabel = (type: Database["public"]["Enums"]["moc_change_type"] | null) => {
    const key = `moc.changeType.${type}` as any;
    return type ? t(key) || type : type;
  };

  const filteredMocs = (mocRequests || []).filter((moc) => {
    const matchesSearch = moc.title.toLowerCase().includes(searchQuery.toLowerCase()) || moc.request_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || moc.status === statusFilter;
    const matchesTab = activeTab === "all" || (activeTab === "pending" && ["submitted", "under_review"].includes(moc.status || "")) || (activeTab === "approved" && moc.status === "approved") || (activeTab === "draft" && moc.status === "draft");
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

  const handleExportAll = () => {
    if (filteredMocs.length > 0) {
      const { headers, rows } = generateMOCExportData(filteredMocs);
      downloadCSV(headers, rows, `moc-requests-${format(new Date(), "yyyy-MM-dd")}.csv`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("moc.title")}</h1>
          <p className="text-muted-foreground">{t("moc.managementDesc")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportAll} disabled={filteredMocs.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            {t("moc.exportCSV")}
          </Button>
          <Button className="gradient-primary text-primary-foreground" onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t("moc.newMOCRequest")}
          </Button>
        </div>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle className="text-xl font-semibold">{t("moc.newMOCRequest")}</DialogTitle>
          </DialogHeader>
          <MOCFormWizard onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} />
        </DialogContent>
      </Dialog>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all" className="data-[state=active]:bg-background">{t("moc.all")} ({counts.all})</TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-background">{t("moc.pending")} ({counts.pending})</TabsTrigger>
          <TabsTrigger value="approved" className="data-[state=active]:bg-background">{t("moc.approved")} ({counts.approved})</TabsTrigger>
          <TabsTrigger value="draft" className="data-[state=active]:bg-background">{t("moc.drafts")} ({counts.draft})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="flex gap-4 flex-wrap mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder={t("moc.searchByTitleOrId")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t("moc.filterByStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("moc.allStatuses")}</SelectItem>
                <SelectItem value="draft">{t("moc.draft")}</SelectItem>
                <SelectItem value="submitted">{t("moc.submitted")}</SelectItem>
                <SelectItem value="under_review">{t("moc.inReview")}</SelectItem>
                <SelectItem value="approved">{t("moc.approved")}</SelectItem>
                <SelectItem value="rejected">{t("moc.rejected")}</SelectItem>
                <SelectItem value="implemented">{t("moc.implemented")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="glass-card rounded-xl overflow-hidden animate-slide-up">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">{t("moc.mocId")}</TableHead>
                  <TableHead className="text-muted-foreground">{t("moc.fieldTitle")}</TableHead>
                  <TableHead className="text-muted-foreground">{t("moc.facility")}</TableHead>
                  <TableHead className="text-muted-foreground">{t("mocDetail.changeType")}</TableHead>
                  <TableHead className="text-muted-foreground">{t("moc.priority")}</TableHead>
                  <TableHead className="text-muted-foreground">{t("moc.status")}</TableHead>
                  <TableHead className="text-muted-foreground">{t("moc.created")}</TableHead>
                  <TableHead className="text-muted-foreground text-right">{t("moc.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMocs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {mocRequests?.length === 0 ? t("moc.noMOCYet") : t("moc.noMatchFilters")}
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
                        <TableCell className="font-mono text-sm text-primary">{moc.request_number}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{moc.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {t("moc.by")} {creator?.full_name || creator?.email || t("moc.unknown")}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{facility?.name || "-"}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{getChangeTypeLabel(moc.change_type)}</TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(moc.priority)}>{moc.priority || "medium"}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusInfo.label}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">{format(new Date(moc.created_at), "MMM d, yyyy")}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onSelect={() => handleViewDetails(moc.id)}>
                                <Eye className="h-4 w-4 mr-2" />{t("moc.viewDetails")}
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleEditRequest(moc.id)}>
                                <Edit className="h-4 w-4 mr-2" />{t("moc.edit")}
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
