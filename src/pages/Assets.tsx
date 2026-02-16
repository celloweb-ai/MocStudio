import { useState } from "react";
import { Search, Filter, Cog, MoreVertical, Edit, Trash2, History } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAssets } from "@/hooks/useAssets";
import { useFacilities } from "@/hooks/useFacilities";
import { AddAssetDialog } from "@/components/assets/AddAssetDialog";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Assets() {
  const [searchQuery, setSearchQuery] = useState("");
  const [facilityFilter, setFacilityFilter] = useState("all");
  const { assets, isLoading } = useAssets();
  const { facilities } = useFacilities();
  const { t } = useLanguage();

  const filteredAssets = (assets ?? []).filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (asset.asset_code ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFacility =
      facilityFilter === "all" || asset.facility_id === facilityFilter;
    return matchesSearch && matchesFacility;
  });

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case "Critical": return "bg-destructive/20 text-destructive";
      case "High": return "bg-warning/20 text-warning";
      case "Medium": return "bg-accent/20 text-accent";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-success/20 text-success";
      case "Maintenance": return "bg-warning/20 text-warning";
      case "Under Review": return "bg-accent/20 text-accent";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("assets.title")}</h1>
          <p className="text-muted-foreground">{t("assets.equipmentRegistry")}</p>
        </div>
        <AddAssetDialog />
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("assets.searchByNameCode")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={facilityFilter} onValueChange={setFacilityFilter}>
          <SelectTrigger className="w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder={t("assets.filterByFacility")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("assets.allFacilities")}</SelectItem>
            {facilities?.map((f) => (
              <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="glass-card rounded-xl overflow-hidden animate-slide-up">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">{t("assets.code")}</TableHead>
              <TableHead className="text-muted-foreground">{t("assets.name")}</TableHead>
              <TableHead className="text-muted-foreground">{t("assets.type")}</TableHead>
              <TableHead className="text-muted-foreground">{t("assets.facility")}</TableHead>
              <TableHead className="text-muted-foreground">{t("assets.location")}</TableHead>
              <TableHead className="text-muted-foreground">{t("assets.criticality")}</TableHead>
              <TableHead className="text-muted-foreground">{t("assets.status")}</TableHead>
              <TableHead className="text-muted-foreground text-right">{t("moc.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : filteredAssets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  {t("assets.noAssetsClickAdd")}
                </TableCell>
              </TableRow>
            ) : (
              filteredAssets.map((asset) => (
                <TableRow key={asset.id} className="border-border hover:bg-muted/30">
                  <TableCell className="font-mono text-sm text-primary">
                    {asset.asset_code}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Cog className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{asset.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{asset.asset_type}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {asset.facilities?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {asset.location ?? "—"}
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
                          <Edit className="h-4 w-4 mr-2" /> {t("common.edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <History className="h-4 w-4 mr-2" /> {t("assets.viewHistory")}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" /> {t("common.delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
