import { useState } from "react";
import { Plus, Search, Building2, MapPin, Users, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Facility = {
  id: number;
  name: string;
  type: string;
  location: string;
  status: string;
  assets: number;
  activeMocs: number;
  manager: string;
};

const initialFacilities: Facility[] = [
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
    manager: "Joao Oliveira",
  },
  {
    id: 4,
    name: "Platform Delta",
    type: "Jack-up",
    location: "Block 8, Espirito Santo",
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
  const { toast } = useToast();
  const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formManager, setFormManager] = useState("");
  const [formStatus, setFormStatus] = useState("Operational");

  const filteredFacilities = facilities.filter(
    (facility) =>
      facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNew = () => {
    setIsEditMode(false);
    setSelectedFacility(null);
    setFormName("");
    setFormType("");
    setFormLocation("");
    setFormManager("");
    setFormStatus("Operational");
    setIsDialogOpen(true);
  };

  const handleEdit = (facility: Facility) => {
    setIsEditMode(true);
    setSelectedFacility(facility);
    setFormName(facility.name);
    setFormType(facility.type);
    setFormLocation(facility.location);
    setFormManager(facility.manager);
    setFormStatus(facility.status);
    setIsDialogOpen(true);
  };

  const handleDelete = (facility: Facility) => {
    setSelectedFacility(facility);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedFacility) {
      setFacilities(prev => prev.filter(f => f.id !== selectedFacility.id));
      toast({
        title: "Facility deleted",
        description: `${selectedFacility.name} has been removed successfully.`,
      });
      setIsDeleteDialogOpen(false);
      setSelectedFacility(null);
    }
  };

  const handleSave = () => {
    if (!formName || !formType || !formLocation || !formManager) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (isEditMode && selectedFacility) {
      setFacilities(prev => prev.map(f => 
        f.id === selectedFacility.id 
          ? {
              ...f,
              name: formName,
              type: formType,
              location: formLocation,
              manager: formManager,
              status: formStatus,
            }
          : f
      ));
      toast({
        title: "Facility updated",
        description: `${formName} has been updated successfully.`,
      });
    } else {
      const newFacility: Facility = {
        id: Math.max(...facilities.map(f => f.id)) + 1,
        name: formName,
        type: formType,
        location: formLocation,
        manager: formManager,
        status: formStatus,
        assets: 0,
        activeMocs: 0,
      };
      setFacilities(prev => [...prev, newFacility]);
      toast({
        title: "Facility created",
        description: `${formName} has been added successfully.`,
      });
    }

    setIsDialogOpen(false);
    setSelectedFacility(null);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-cyber">Facilities</h1>
          <p className="text-muted-foreground mt-2">
            Manage offshore platforms and installations
          </p>
        </div>
        <Button onClick={handleAddNew} className="btn-3d">
          <Plus className="h-4 w-4 mr-2" />
          Add Facility
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search facilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 input-modern"
          />
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFacilities.map((facility) => (
          <div
            key={facility.id}
            className="glass-card rounded-xl p-6 hover:border-primary/50 transition-all card-floating"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg gradient-cyber">
                  <Building2 className="h-5 w-5 text-white" />
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
                <DropdownMenuContent align="end" className="glass-card">
                  <DropdownMenuItem onClick={() => handleEdit(facility)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => handleDelete(facility)}
                  >
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

            <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
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
                    ? "status-approved"
                    : facility.status === "Maintenance"
                    ? "status-review"
                    : "status-submitted"
                }
              >
                {facility.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] glass-card">
          <DialogHeader>
            <DialogTitle className="text-gradient-cyber">
              {isEditMode ? "Edit Facility" : "Add New Facility"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the facility information below."
                : "Create a new offshore facility or installation."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Facility Name</Label>
              <Input
                id="name"
                placeholder="Enter facility name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="input-modern"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formType} onValueChange={setFormType}>
                <SelectTrigger className="input-modern">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="glass-card">
                  <SelectItem value="Fixed Platform">Fixed Platform</SelectItem>
                  <SelectItem value="Semi-submersible">Semi-submersible</SelectItem>
                  <SelectItem value="FPSO">FPSO</SelectItem>
                  <SelectItem value="Jack-up">Jack-up</SelectItem>
                  <SelectItem value="Drillship">Drillship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Block, Basin"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                className="input-modern"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="manager">Installation Manager</Label>
              <Input
                id="manager"
                placeholder="Manager name"
                value={formManager}
                onChange={(e) => setFormManager(e.target.value)}
                className="input-modern"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formStatus} onValueChange={setFormStatus}>
                <SelectTrigger className="input-modern">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card">
                  <SelectItem value="Operational">Operational</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Commissioning">Commissioning</SelectItem>
                  <SelectItem value="Decommissioned">Decommissioned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="btn-glass">
              Cancel
            </Button>
            <Button onClick={handleSave} className="btn-3d">
              {isEditMode ? "Update Facility" : "Create Facility"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="glass-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{selectedFacility?.name}</strong>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn-glass">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="btn-3d bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
