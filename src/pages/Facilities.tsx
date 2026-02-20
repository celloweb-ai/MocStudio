import { useState } from "react";
import { Plus, Search, Building2, MapPin, Users, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

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
  { id: 1, name: "Platform Alpha", type: "Fixed Platform", location: "Block 15, Santos Basin", status: "Operational", assets: 156, activeMocs: 12, manager: "Carlos Silva" },
  { id: 2, name: "Platform Beta", type: "Semi-submersible", location: "Block 23, Campos Basin", status: "Operational", assets: 203, activeMocs: 8, manager: "Maria Santos" },
  { id: 3, name: "FPSO Gamma", type: "FPSO", location: "Block 31, Pre-salt", status: "Maintenance", assets: 312, activeMocs: 15, manager: "Joao Oliveira" },
  { id: 4, name: "Platform Delta", type: "Jack-up", location: "Block 8, Espirito Santo", status: "Operational", assets: 89, activeMocs: 6, manager: "Ana Costa" },
  { id: 5, name: "FPSO Epsilon", type: "FPSO", location: "Block 42, Pre-salt", status: "Commissioning", assets: 278, activeMocs: 22, manager: "Pedro Almeida" },
];

export default function Facilities() {
  const { toast } = useToast();
  const { t } = useLanguage();
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
        title: t("facilities.facilityDeleted"),
        description: `${selectedFacility.name} ${t("facilities.removedSuccess")}`,
      });
      setIsDeleteDialogOpen(false);
      setSelectedFacility(null);
    }
  };

  const handleSave = () => {
    if (!formName || !formType || !formLocation || !formManager) {
      toast({
        title: t("facilities.validationError"),
        description: t("facilities.fillAllFields"),
        variant: "destructive",
      });
      return;
    }

    if (isEditMode && selectedFacility) {
      setFacilities(prev => prev.map(f => 
        f.id === selectedFacility.id 
          ? { ...f, name: formName, type: formType, location: formLocation, manager: formManager, status: formStatus }
          : f
      ));
      toast({
        title: t("facilities.facilityUpdated"),
        description: `${formName} ${t("facilities.updatedSuccess")}`,
      });
    } else {
      const newFacility: Facility = {
        id: Math.max(...facilities.map(f => f.id)) + 1,
        name: formName, type: formType, location: formLocation, manager: formManager,
        status: formStatus, assets: 0, activeMocs: 0,
      };
      setFacilities(prev => [...prev, newFacility]);
      toast({
        title: t("facilities.facilityCreated"),
        description: `${formName} ${t("facilities.addedSuccess")}`,
      });
    }

    setIsDialogOpen(false);
    setSelectedFacility(null);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t("facilities.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("facilities.manageDesc")}</p>
        </div>
        <Button onClick={handleAddNew} className="btn-3d">
          <Plus className="h-4 w-4 mr-2" />
          {t("facilities.addFacility")}
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("facilities.search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 input-modern"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFacilities.map((facility) => (
          <div key={facility.id} className="glass-card rounded-xl p-6 hover:border-primary/50 transition-all card-floating">
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
                    {t("common.edit")}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(facility)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t("common.delete")}
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
                  <span className="text-muted-foreground">{t("facilities.assetsCount")}:</span>{" "}
                  <span className="font-medium text-foreground">{facility.assets}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">{t("facilities.mocsCount")}:</span>{" "}
                  <span className="font-medium text-foreground">{facility.activeMocs}</span>
                </div>
              </div>
              <Badge className={
                facility.status === "Operational" ? "status-approved"
                  : facility.status === "Maintenance" ? "status-review"
                  : "status-submitted"
              }>
                {facility.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] glass-card">
          <DialogHeader>
            <DialogTitle className="text-gradient-cyber">
              {isEditMode ? t("facilities.editFacility") : t("facilities.addNewFacilityTitle")}
            </DialogTitle>
            <DialogDescription>
              {isEditMode ? t("facilities.editDesc") : t("facilities.addDesc")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t("facilities.facilityName")}</Label>
              <Input id="name" placeholder={t("facilities.enterFacilityName")} value={formName} onChange={(e) => setFormName(e.target.value)} className="input-modern" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">{t("facilities.type")}</Label>
              <Select value={formType} onValueChange={setFormType}>
                <SelectTrigger className="input-modern">
                  <SelectValue placeholder={t("facilities.selectType")} />
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
              <Label htmlFor="location">{t("facilities.location")}</Label>
              <Input id="location" placeholder="Block, Basin" value={formLocation} onChange={(e) => setFormLocation(e.target.value)} className="input-modern" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="manager">{t("facilities.installationManager")}</Label>
              <Input id="manager" placeholder={t("facilities.managerName")} value={formManager} onChange={(e) => setFormManager(e.target.value)} className="input-modern" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">{t("facilities.status")}</Label>
              <Select value={formStatus} onValueChange={setFormStatus}>
                <SelectTrigger className="input-modern">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card">
                  <SelectItem value="Operational">{t("facilities.operational")}</SelectItem>
                  <SelectItem value="Maintenance">{t("facilities.maintenance")}</SelectItem>
                  <SelectItem value="Commissioning">{t("facilities.commissioning")}</SelectItem>
                  <SelectItem value="Decommissioned">{t("facilities.decommissioned")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="btn-glass">
              {t("common.cancel")}
            </Button>
            <Button onClick={handleSave} className="btn-3d">
              {isEditMode ? t("facilities.updateFacility") : t("facilities.createFacility")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="glass-card">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("facilities.deleteConfirm")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("facilities.deleteDesc")} <strong>{selectedFacility?.name}</strong>.
              {" "}{t("facilities.cannotUndo")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn-glass">{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="btn-3d bg-destructive hover:bg-destructive/90">
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
