import { useState } from "react";
import { Plus, Search, Building2, MapPin, Users, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const facilities = [
  {
    id: 1,
    name: "Platform Alpha",
    type: "Fixed Platform",
    location: "Block 15, Santos Basin",
    status: "Operational",
    assets: 156,
    activeMocs: 12,
    manager: "Carlos Silva",
  },
  {
    id: 2,
    name: "Platform Beta",
    type: "Semi-submersible",
    location: "Block 23, Campos Basin",
    status: "Operational",
    assets: 203,
    activeMocs: 8,
    manager: "Maria Santos",
  },
  {
    id: 3,
    name: "FPSO Gamma",
    type: "FPSO",
    location: "Block 31, Pre-salt",
    status: "Maintenance",
    assets: 312,
    activeMocs: 15,
    manager: "João Oliveira",
  },
  {
    id: 4,
    name: "Platform Delta",
    type: "Jack-up",
    location: "Block 8, Espírito Santo",
    status: "Operational",
    assets: 89,
    activeMocs: 6,
    manager: "Ana Costa",
  },
  {
    id: 5,
    name: "FPSO Epsilon",
    type: "FPSO",
    location: "Block 42, Pre-salt",
    status: "Commissioning",
    assets: 278,
    activeMocs: 22,
    manager: "Pedro Almeida",
  },
];

export default function Facilities() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredFacilities = facilities.filter(
    (facility) =>
      facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Facilities</h1>
          <p className="text-muted-foreground">
            Manage offshore platforms and installations
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Add Facility
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Facility</DialogTitle>
              <DialogDescription>
                Create a new offshore facility or installation.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Facility Name</Label>
                <Input id="name" placeholder="Enter facility name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Platform</SelectItem>
                    <SelectItem value="semi">Semi-submersible</SelectItem>
                    <SelectItem value="fpso">FPSO</SelectItem>
                    <SelectItem value="jackup">Jack-up</SelectItem>
                    <SelectItem value="drill">Drillship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Block, Basin" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="manager">Installation Manager</Label>
                <Input id="manager" placeholder="Manager name" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="gradient-primary text-primary-foreground">
                Create Facility
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search facilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFacilities.map((facility) => (
          <div
            key={facility.id}
            className="glass-card rounded-xl p-6 hover:border-primary/50 transition-all animate-slide-up"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{facility.name}</h3>
                  <p className="text-sm text-muted-foreground">{facility.type}</p>
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
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{facility.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{facility.manager}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Assets:</span>{" "}
                  <span className="font-medium text-foreground">{facility.assets}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">MOCs:</span>{" "}
                  <span className="font-medium text-foreground">{facility.activeMocs}</span>
                </div>
              </div>
              <Badge
                className={
                  facility.status === "Operational"
                    ? "bg-success/20 text-success hover:bg-success/30"
                    : facility.status === "Maintenance"
                    ? "bg-warning/20 text-warning hover:bg-warning/30"
                    : "bg-accent/20 text-accent hover:bg-accent/30"
                }
              >
                {facility.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
