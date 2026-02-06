import { useState } from "react";
import { Plus, Search, ExternalLink, FileText, Link2, Edit, Trash2, MoreVertical, FolderOpen } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const standards = [
  {
    id: 1,
    title: "API RP 14C - Safety Analysis",
    description: "Recommended Practice for Analysis, Design, Installation, and Testing of Safety Systems for Offshore Production Facilities",
    category: "Safety",
    type: "Standard",
    url: "https://www.api.org",
  },
  {
    id: 2,
    title: "NORSOK S-001 - Technical Safety",
    description: "Technical safety standard covering design principles, risk assessment, and safety systems",
    category: "Safety",
    type: "Standard",
    url: "https://www.standard.no",
  },
  {
    id: 3,
    title: "IEC 61511 - Functional Safety",
    description: "Safety instrumented systems for the process industry sector",
    category: "Instrumentation",
    type: "Standard",
    url: "https://www.iec.ch",
  },
  {
    id: 4,
    title: "ISO 14224 - Reliability Data",
    description: "Petroleum, petrochemical and natural gas industries — Collection and exchange of reliability and maintenance data for equipment",
    category: "Reliability",
    type: "Standard",
    url: "https://www.iso.org",
  },
];

const links = [
  {
    id: 1,
    title: "Corporate HSE Portal",
    description: "Main HSE documentation and procedures",
    category: "Internal",
    url: "https://intranet.company.com/hse",
  },
  {
    id: 2,
    title: "MOC Training Materials",
    description: "Training documents and videos for MOC process",
    category: "Training",
    url: "https://sharepoint.company.com/training/moc",
  },
  {
    id: 3,
    title: "Risk Assessment Templates",
    description: "Standard templates for risk assessments",
    category: "Templates",
    url: "https://sharepoint.company.com/templates",
  },
  {
    id: 4,
    title: "Regulatory Compliance Dashboard",
    description: "Real-time compliance status and updates",
    category: "Compliance",
    url: "https://compliance.company.com",
  },
];

export default function Standards() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("standards");

  const filteredStandards = standards.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLinks = links.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Standards & Links</h1>
          <p className="text-muted-foreground">
            Reference documentation and external resources
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Resource</DialogTitle>
              <DialogDescription>
                Add a new standard or external link to the repository.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Resource Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="link">External Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Resource title" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description..."
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" placeholder="e.g., Safety, Training" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="url">URL</Label>
                <Input id="url" placeholder="https://..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="gradient-primary text-primary-foreground">
                Add Resource
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="standards" className="data-[state=active]:bg-background">
            <FileText className="h-4 w-4 mr-2" />
            Standards ({standards.length})
          </TabsTrigger>
          <TabsTrigger value="links" className="data-[state=active]:bg-background">
            <Link2 className="h-4 w-4 mr-2" />
            External Links ({links.length})
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {/* Search */}
          <div className="relative max-w-md mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <TabsContent value="standards" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStandards.map((standard) => (
                <div
                  key={standard.id}
                  className="glass-card rounded-xl p-5 hover:border-primary/50 transition-all animate-slide-up"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {standard.title}
                        </h3>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {standard.category}
                        </Badge>
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
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {standard.description}
                  </p>
                  <a
                    href={standard.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Standard
                  </a>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="links" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLinks.map((link) => (
                <div
                  key={link.id}
                  className="glass-card rounded-xl p-5 hover:border-primary/50 transition-all animate-slide-up"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-accent/10">
                        <FolderOpen className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {link.title}
                        </h3>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {link.category}
                        </Badge>
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
                  <p className="text-sm text-muted-foreground mb-4">
                    {link.description}
                  </p>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open Link
                  </a>
                </div>
              ))}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
