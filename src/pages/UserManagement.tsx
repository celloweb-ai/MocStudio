import { useState } from "react";
import { Plus, Search, Users, MoreVertical, Edit, Trash2, Shield, Mail, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserManagement, type ManagedUser } from "@/hooks/useUserManagement";
import { useFacilities } from "@/hooks/useFacilities";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

const roleTranslationKeys: Record<AppRole, string> = {
  administrator: "roles.administrator",
  facility_manager: "roles.facility_manager",
  process_engineer: "roles.process_engineer",
  maintenance_technician: "roles.maintenance_technician",
  hse_coordinator: "roles.hse_coordinator",
  approval_committee: "roles.approval_committee",
};

const allRoles: AppRole[] = [
  "administrator", "facility_manager", "process_engineer",
  "maintenance_technician", "hse_coordinator", "approval_committee",
];

const getRoleColor = (role: string) => {
  switch (role) {
    case "administrator": return "bg-destructive/20 text-destructive";
    case "facility_manager": return "bg-primary/20 text-primary";
    case "process_engineer": return "bg-accent/20 text-accent";
    case "hse_coordinator": return "bg-warning/20 text-warning";
    case "approval_committee": return "bg-success/20 text-success";
    default: return "bg-muted text-muted-foreground";
  }
};

const getInitials = (name: string | null) => {
  if (!name) return "??";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
};

export default function UserManagement() {
  const { users, isLoading, updateProfile, updateRole, toggleStatus, deleteUser } = useUserManagement();
  const { facilities } = useFacilities();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editFacility, setEditFacility] = useState<string>("");
  const [editStatus, setEditStatus] = useState("active");
  const [selectedRole, setSelectedRole] = useState<AppRole>("administrator");

  // Invite form state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteFullName, setInviteFullName] = useState("");
  const [inviteRole, setInviteRole] = useState<AppRole>("process_engineer");
  const [inviteFacility, setInviteFacility] = useState<string>("none");
  const [isInviting, setIsInviting] = useState(false);

  const filteredUsers = users.filter(
    (u) =>
      (u.full_name ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.roles.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const openEditDialog = (user: ManagedUser) => {
    setSelectedUser(user);
    setEditName(user.full_name ?? "");
    setEditEmail(user.email);
    setEditFacility(user.facility_id ?? "none");
    setEditStatus(user.status);
    setIsEditDialogOpen(true);
  };

  const saveEditedUser = () => {
    if (!selectedUser) return;
    updateProfile.mutate({
      userId: selectedUser.id,
      full_name: editName,
      email: editEmail,
      facility_id: editFacility === "none" ? null : editFacility,
      status: editStatus,
    });
    setIsEditDialogOpen(false);
  };

  const openRoleDialog = (user: ManagedUser) => {
    setSelectedUser(user);
    setSelectedRole(user.roles[0] ?? "administrator");
    setIsRoleDialogOpen(true);
  };

  const saveRoleChange = () => {
    if (!selectedUser) return;
    updateRole.mutate({ userId: selectedUser.id, newRole: selectedRole });
    setIsRoleDialogOpen(false);
  };

  const resetInviteForm = () => {
    setInviteEmail("");
    setInviteFullName("");
    setInviteRole("process_engineer");
    setInviteFacility("none");
  };

  const handleInviteUser = async () => {
    if (!inviteEmail.trim()) return;

    setIsInviting(true);
    try {
      const { data, error } = await supabase.functions.invoke("invite-user", {
        body: {
          email: inviteEmail.trim(),
          full_name: inviteFullName.trim() || undefined,
          role: inviteRole,
          facility_id: inviteFacility === "none" ? undefined : inviteFacility,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({
        title: t("users.inviteSent"),
        description: `${t("users.inviteSentDesc")} ${inviteEmail}.`,
      });

      resetInviteForm();
      setIsInviteDialogOpen(false);
    } catch (err: any) {
      toast({
        title: t("common.error"),
        description: err.message || t("users.inviteError"),
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
  };

  const activeCount = users.filter((u) => u.status === "active").length;
  const adminCount = users.filter((u) => u.roles.includes("administrator")).length;
  const inactiveCount = users.filter((u) => u.status === "inactive").length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("users.title")}</h1>
          <p className="text-muted-foreground">{t("users.manageAccess")}</p>
        </div>
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground">
              <UserPlus className="h-4 w-4 mr-2" />
              {t("users.inviteUser")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{t("users.inviteNewUser")}</DialogTitle>
              <DialogDescription>
                {t("users.inviteDesc")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="invite-email">{t("users.email")} *</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="user@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="invite-name">{t("users.fullName")}</Label>
                <Input
                  id="invite-name"
                  placeholder={t("users.enterFullName")}
                  value={inviteFullName}
                  onChange={(e) => setInviteFullName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="invite-role">{t("users.role")}</Label>
                <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as AppRole)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("users.selectRole")} />
                  </SelectTrigger>
                  <SelectContent>
                    {allRoles.map((role) => (
                      <SelectItem key={role} value={role}>{t(roleTranslationKeys[role] as any)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="invite-facility">{t("users.assignedFacility")}</Label>
                <Select value={inviteFacility} onValueChange={setInviteFacility}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("users.selectFacility")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t("users.allNone")}</SelectItem>
                    {facilities?.map((f) => (
                      <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { resetInviteForm(); setIsInviteDialogOpen(false); }}>
                {t("common.cancel")}
              </Button>
              <Button
                className="gradient-primary text-primary-foreground"
                onClick={handleInviteUser}
                disabled={isInviting || !inviteEmail.trim()}
              >
                {isInviting ? t("users.sending") : t("users.sendInvitation")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("users.editUserTitle")}</DialogTitle>
            <DialogDescription>{t("users.editUserDesc")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">{t("users.fullName")}</Label>
              <Input id="edit-name" value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">{t("users.email")}</Label>
              <Input id="edit-email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-facility">{t("users.assignedFacility")}</Label>
              <Select value={editFacility} onValueChange={setEditFacility}>
                <SelectTrigger>
                  <SelectValue placeholder={t("users.selectFacility")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("users.allNone")}</SelectItem>
                  {facilities?.map((f) => (
                    <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">{t("users.status")}</Label>
              <Select value={editStatus} onValueChange={setEditStatus}>
                <SelectTrigger>
                  <SelectValue placeholder={t("users.selectStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t("users.active")}</SelectItem>
                  <SelectItem value="inactive">{t("users.inactive")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>{t("common.cancel")}</Button>
            <Button className="gradient-primary text-primary-foreground" onClick={saveEditedUser} disabled={updateProfile.isPending}>
              {t("users.saveChanges")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{t("users.changeRole")}</DialogTitle>
            <DialogDescription>
              {t("users.changeRoleDesc")} {selectedUser?.full_name ?? t("users.theSelectedUser")}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            <Label htmlFor="change-role">{t("users.role")}</Label>
            <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as AppRole)}>
              <SelectTrigger>
                <SelectValue placeholder={t("users.selectRole")} />
              </SelectTrigger>
              <SelectContent>
                {allRoles.map((role) => (
                  <SelectItem key={role} value={role}>{t(roleTranslationKeys[role] as any)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>{t("common.cancel")}</Button>
            <Button className="gradient-primary text-primary-foreground" onClick={saveRoleChange} disabled={updateRole.isPending}>
              {t("users.updateRole")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("users.deleteUser") || "Delete User"}</AlertDialogTitle>
            <AlertDialogDescription>
              {"This action cannot be undone. This will permanently delete the user account, profile, and all associated roles."}
              {selectedUser && (
                <span className="block mt-2 font-medium text-foreground">
                  {selectedUser.full_name || selectedUser.email}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (selectedUser) {
                  deleteUser.mutate(selectedUser.id);
                }
                setIsDeleteDialogOpen(false);
              }}
            >
              {t("users.deleteUser") || "Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("users.totalUsers")}</p>
              <p className="text-2xl font-bold text-foreground">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Shield className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("users.active")}</p>
              <p className="text-2xl font-bold text-foreground">{activeCount}</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Shield className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("users.admins")}</p>
              <p className="text-2xl font-bold text-foreground">{adminCount}</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("users.inactive")}</p>
              <p className="text-2xl font-bold text-foreground">{inactiveCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("users.searchUsers")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-xl overflow-hidden animate-slide-up">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">{t("users.user")}</TableHead>
              <TableHead className="text-muted-foreground">{t("users.role")}</TableHead>
              <TableHead className="text-muted-foreground">{t("users.facility")}</TableHead>
              <TableHead className="text-muted-foreground">{t("users.status")}</TableHead>
              <TableHead className="text-muted-foreground text-right">{t("moc.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  {t("users.noUsersFound")}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-border hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/20 text-primary text-sm font-medium">
                          {getInitials(user.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{user.full_name ?? "—"}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.length > 0 ? (
                        user.roles.map((role) => (
                          <Badge key={role} className={getRoleColor(role)}>
                            {t(roleTranslationKeys[role] as any) ?? role}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">{t("users.noRole")}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.facility_name ?? t("users.all")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        user.status === "active"
                          ? "bg-success/20 text-success"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {user.status === "active" ? t("users.active") : t("users.inactive")}
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
                        <DropdownMenuItem onSelect={() => openEditDialog(user)}>
                          <Edit className="h-4 w-4 mr-2" />
                          {t("users.editUser")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => openRoleDialog(user)}>
                          <Shield className="h-4 w-4 mr-2" />
                          {t("users.changeRole")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className={user.status === "active" ? "text-destructive" : "text-success"}
                          onSelect={() => toggleStatus.mutate({ userId: user.id, currentStatus: user.status })}
                        >
                          {user.status === "active" ? t("users.deactivate") : t("users.activate")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onSelect={() => {
                            setSelectedUser(user);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t("users.deleteUser") || "Delete User"}
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
