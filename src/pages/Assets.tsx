import { useState } from "react";
import { Plus, Search, Filter, Cog, MoreVertical, Edit, Trash2, History } from "lucide-react";
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

const assets = [
  {
    id: "AST-001",
    name: "Main Gas Compressor",
    type: "Rotating Equipment",
    facility: "Platform Alpha",
    location: "Module A - Deck 2",
    status: "Active",
    criticality: "High",
    lastMaintenance: "2024-01-15",
  },
  {
    id: "AST-002",
    name: "Fire Water Pump #1",
    type: "Safety System",
    facility: "Platform Alpha",
    location: "Module B - Deck 1",
    status: "Active",
    criticality: "Critical",
    lastMaintenance: "2024-02-01",
  },
  {
    id: "AST-003",
    name: "Separator V-101",
    type: "Static Equipment",
    facility: "Platform Beta",
    location: "Process Area",
    status: "Under Review",
    criticality: "High",
    lastMaintenance: "2023-12-20",
  },
  {
    id: "AST-004",
    name: "Gas Detection System",
    type: "F&G System",
    facility: "FPSO Gamma",
    location: "Multiple Locations",
    status: "Active",
    criticality: "Critical",
    lastMaintenance: "2024-01-28",
  },
  {
    id: "AST-005",
    name: "Crude Oil Heater",
    type: "Heat Exchange",
    facility: "Platform Delta",
    location: "Module C - Deck 3",
    status: "Maintenance",
    criticality: "Medium",
    lastMaintenance: "2024-02-10",
  },
  {
    id: "AST-006",
    name: "Emergency Shutdown Valve",
    type: "Safety System",
    facility: "FPSO Gamma",
    location: "Wellhead Area",
    status: "Active",
    criticality: "Critical",
    lastMaintenance: "2024-02-05",
  },
];

export default function Assets() {
  const [searchQuery, setSearchQuery] = useState("");
  const [facilityFilter, setFacilityFilter] = useState("all");

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFacility =
      facilityFilter === "all" || asset.facility === facilityFilter;
    return matchesSearch && matchesFacility;
  });

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success/20 text-success";
      case "Maintenance":
        return "bg-warning/20 text-warning";
      case "Under Review":
        return "bg-accent/20 text-accent";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Assets</h1>
          <p className="text-muted-foreground">
            Equipment and systems registry
          </p>
        </div>
        <Button className="gradient-primary text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Add Asset
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={facilityFilter} onValueChange={setFacilityFilter}>
          <SelectTrigger className="w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by facility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Facilities</SelectItem>
            <SelectItem value="Platform Alpha">Platform Alpha</SelectItem>
            <SelectItem value="Platform Beta">Platform Beta</SelectItem>
            <SelectItem value="FPSO Gamma">FPSO Gamma</SelectItem>
            <SelectItem value="Platform Delta">Platform Delta</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Assets Table */}
      <div className="glass-card rounded-xl overflow-hidden animate-slide-up">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Asset ID</TableHead>
              <TableHead className="text-muted-foreground">Name</TableHead>
              <TableHead className="text-muted-foreground">Type</TableHead>
              <TableHead className="text-muted-foreground">Facility</TableHead>
              <TableHead className="text-muted-foreground">Location</TableHead>
              <TableHead className="text-muted-foreground">Criticality</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssets.map((asset) => (
              <TableRow key={asset.id} className="border-border hover:bg-muted/30">
                <TableCell className="font-mono text-sm text-primary">
                  {asset.id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Cog className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{asset.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{asset.type}</TableCell>
                <TableCell className="text-muted-foreground">{asset.facility}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {asset.location}
                </TableCell>
                <TableCell>
                  <Badge className={getCriticalityColor(asset.criticality)}>
                    {asset.criticality}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(asset.status)}>
                    {asset.status}
                  </Badge>
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
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <History className="h-4 w-4 mr-2" />
                        View History
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
