import { useState } from "react";
import { Plus, Search, Users, MoreVertical, Edit, Trash2, Shield, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

type UserStatus = "Active" | "Inactive";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  facility: string;
  status: UserStatus;
  lastLogin: string;
};

const initialUsers: User[] = [
  {
    id: 1,
    name: "Carlos Silva",
    email: "carlos.silva@company.com",
    role: "Administrator",
    facility: "All",
    status: "Active",
    lastLogin: "2024-02-08 14:32",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria.santos@company.com",
    role: "Installation Manager",
    facility: "Platform Beta",
    status: "Active",
    lastLogin: "2024-02-08 10:15",
  },
  {
    id: 3,
    name: "João Oliveira",
    email: "joao.oliveira@company.com",
    role: "Process Engineer",
    facility: "FPSO Gamma",
    status: "Active",
    lastLogin: "2024-02-07 16:45",
  },
  {
    id: 4,
    name: "Ana Costa",
    email: "ana.costa@company.com",
    role: "Maintenance Technician",
    facility: "Platform Alpha",
    status: "Active",
    lastLogin: "2024-02-08 09:00",
  },
  {
    id: 5,
    name: "Pedro Almeida",
    email: "pedro.almeida@company.com",
    role: "HSE Coordinator",
    facility: "Platform Delta",
    status: "Inactive",
    lastLogin: "2024-01-25 11:30",
  },
  {
    id: 6,
    name: "Fernanda Lima",
    email: "fernanda.lima@company.com",
    role: "Approval Committee",
    facility: "All",
    status: "Active",
    lastLogin: "2024-02-08 08:00",
  },
];

const roles = [
  "Administrator",
  "Installation Manager",
  "Process Engineer",
  "Maintenance Technician",
  "HSE Coordinator",
  "Approval Committee",
];

const facilities = ["All", "Platform Alpha", "Platform Beta", "FPSO Gamma", "Platform Delta"];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);

  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editFacility, setEditFacility] = useState("");
  const [editStatus, setEditStatus] = useState<UserStatus>("Active");
  const [selectedRole, setSelectedRole] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Administrator":
        return "bg-destructive/20 text-destructive";
      case "Installation Manager":
        return "bg-primary/20 text-primary";
      case "Process Engineer":
        return "bg-accent/20 text-accent";
      case "HSE Coordinator":
        return "bg-warning/20 text-warning";
      case "Approval Committee":
        return "bg-success/20 text-success";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditFacility(user.facility);
    setEditStatus(user.status);
    setIsEditDialogOpen(true);
  };

  const saveEditedUser = () => {
    if (!selectedUser) {
      return;
    }

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              name: editName,
              email: editEmail,
              facility: editFacility,
              status: editStatus,
            }
          : user
      )
    );

    setIsEditDialogOpen(false);
    setSelectedUser(null);
  };

  const openRoleDialog = (user: User) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setIsRoleDialogOpen(true);
  };

  const saveRoleChange = () => {
    if (!selectedUser || !selectedRole) {
      return;
    }

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              role: selectedRole,
            }
          : user
      )
    );

    setIsRoleDialogOpen(false);
    setSelectedUser(null);
  };

  const toggleUserStatus = (user: User) => {
    const nextStatus: UserStatus = user.status === "Active" ? "Inactive" : "Active";

    setUsers((currentUsers) =>
      currentUsers.map((currentUser) =>
        currentUser.id === user.id
          ? {
              ...currentUser,
              status: nextStatus,
            }
          : currentUser
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts and access permissions
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account with specified role and permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter full name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="user@company.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role.toLowerCase()}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="facility">Assigned Facility</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select facility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Facilities</SelectItem>
                    <SelectItem value="alpha">Platform Alpha</SelectItem>
                    <SelectItem value="beta">Platform Beta</SelectItem>
                    <SelectItem value="gamma">FPSO Gamma</SelectItem>
                    <SelectItem value="delta">Platform Delta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="gradient-primary text-primary-foreground">
                Create User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user details and access status.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input id="edit-name" value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-facility">Assigned Facility</Label>
              <Select value={editFacility} onValueChange={setEditFacility}>
                <SelectTrigger>
                  <SelectValue placeholder="Select facility" />
                </SelectTrigger>
                <SelectContent>
                  {facilities.map((facility) => (
                    <SelectItem key={facility} value={facility}>
                      {facility}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={editStatus} onValueChange={(value) => setEditStatus(value as UserStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="gradient-primary text-primary-foreground" onClick={saveEditedUser}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Change Role</DialogTitle>
            <DialogDescription>
              Select a new role for {selectedUser?.name ?? "the selected user"}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            <Label htmlFor="change-role">Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="gradient-primary text-primary-foreground" onClick={saveRoleChange}>
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
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
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-foreground">
                {users.filter((u) => u.status === "Active").length}
              </p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Shield className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Admins</p>
              <p className="text-2xl font-bold text-foreground">
                {users.filter((u) => u.role === "Administrator").length}
              </p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Inactive</p>
              <p className="text-2xl font-bold text-foreground">
                {users.filter((u) => u.status === "Inactive").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
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
              <TableHead className="text-muted-foreground">User</TableHead>
              <TableHead className="text-muted-foreground">Role</TableHead>
              <TableHead className="text-muted-foreground">Facility</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Last Login</TableHead>
              <TableHead className="text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="border-border hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/20 text-primary text-sm font-medium">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.facility}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      user.status === "Active"
                        ? "bg-success/20 text-success"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {user.lastLogin}
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
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => openRoleDialog(user)}>
                        <Shield className="h-4 w-4 mr-2" />
                        Change Role
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={user.status === "Active" ? "text-destructive" : "text-success"}
                        onSelect={() => toggleUserStatus(user)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {user.status === "Active" ? "Deactivate" : "Activate"}
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
