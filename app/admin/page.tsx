"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Users, Shield, Calendar, FolderOpen, Bell, TrendingUp, Menu, LogOut, Crown, User, Plus, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getAllUsers, addUser, updateUser, deleteUser } from "@/app/actions/auth";
import { getProjects } from "@/app/actions/projects";
import { Checkbox } from "@/components/ui/checkbox";

export default function AdminPage() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  const [users, setUsers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newUser, setNewUser] = useState({
    email: "",
    name: "", // Added name field
    password: "", // Added password field
    role: "user" as "administrator" | "lead" | "user",
    projects: [] as number[],
  });
  const [editForm, setEditForm] = useState({
    email: "",
    name: "", // Added name field
    password: "", // Added password field (optional for edit)
    role: "user" as "administrator" | "lead" | "user",
    projects: [] as number[],
  });
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersData, projectsData] = await Promise.all([getAllUsers(), getProjects()]);
        setUsers(usersData);
        setProjects(projectsData);
        console.log("[v0] Loaded users:", usersData);
        console.log("[v0] Loaded projects:", projectsData);
      } catch (error) {
        console.error("[v0] Error loading data:", error);
      }
    };
    loadData();
  }, []);

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.name || !newUser.password) {
      alert("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const result = await addUser(newUser.email, newUser.name, newUser.password, newUser.role, newUser.projects);

      if (result.success) {
        // Reload users
        const usersData = await getAllUsers();
        setUsers(usersData);

        setNewUser({ email: "", name: "", password: "", role: "user", projects: [] });
        setIsAddUserOpen(false);

        console.log("[v0] Added new user:", newUser.email);
      } else {
        console.error("[v0] Failed to add user:", result.error);
        alert(`Failed to add user: ${result.error}`);
      }
    } catch (error) {
      console.error("[v0] Error adding user:", error);
      alert("Failed to add user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (userToEdit: any) => {
    setEditingUser(userToEdit);
    setEditForm({
      email: userToEdit.email,
      name: userToEdit.name || "", // Load name
      password: "", // Leave password empty (optional for edit)
      role: userToEdit.role,
      projects: userToEdit.projects || [],
    });
    setIsEditUserOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!editForm.email || !editForm.name) {
      alert("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateUser(
        editForm.email,
        editForm.name,
        editForm.password || null, // Pass null if password is empty
        editForm.role,
        editForm.projects
      );

      if (result.success) {
        // Reload users
        const usersData = await getAllUsers();
        setUsers(usersData);

        setIsEditUserOpen(false);
        setEditingUser(null);

        console.log("[v0] Updated user:", editForm.email);
      } else {
        console.error("[v0] Failed to update user:", result.error);
        alert(`Failed to update user: ${result.error}`);
      }
    } catch (error) {
      console.error("[v0] Error updating user:", error);
      alert("Failed to update user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userEmail: string) => {
    if (!confirm(`Are you sure you want to delete user ${userEmail}?`)) return;

    setIsLoading(true);
    try {
      const result = await deleteUser(userEmail);

      if (result.success) {
        // Reload users
        const usersData = await getAllUsers();
        setUsers(usersData);

        console.log("[v0] Deleted user:", userEmail);
      } else {
        console.error("[v0] Failed to delete user:", result.error);
        alert(`Failed to delete user: ${result.error}`);
      }
    } catch (error) {
      console.error("[v0] Error deleting user:", error);
      alert("Failed to delete user");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleProject = (projectId: number, isNewUser: boolean) => {
    if (isNewUser) {
      setNewUser((prev) => ({
        ...prev,
        projects: prev.projects.includes(projectId) ? prev.projects.filter((id) => id !== projectId) : [...prev.projects, projectId],
      }));
    } else {
      setEditForm((prev) => ({
        ...prev,
        projects: prev.projects.includes(projectId) ? prev.projects.filter((id) => id !== projectId) : [...prev.projects, projectId],
      }));
    }
  };

  const adminUsers = users.filter((u) => u.role === "administrator");
  const leadUsers = users.filter((u) => u.role === "lead");
  const regularUsers = users.filter((u) => u.role === "user");

  if (!isAuthenticated() || !isAdmin()) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <Card className="border-gray-100 shadow-lg">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-serif">Access Denied</CardTitle>
              <CardDescription>You need admin privileges to access this page</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/">
                <Button className="w-full">Return to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white">
        <div className="flex h-20 items-center justify-between px-8">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <img
                src="/munus-logo.jpg"
                alt="Munus Logo"
                className="h-8 w-auto"
              />
              <span className="text-3xl font-bold text-gray-900 font-serif">Munus Hub</span>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              <Link href="/">
                <Button
                  variant="ghost"
                  className="gap-2 text-gray-700 hover:bg-gray-50 hover:text-primary h-10 px-4 font-medium"
                >
                  <TrendingUp className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/projects">
                <Button
                  variant="ghost"
                  className="gap-2 text-gray-700 hover:bg-gray-50 hover:text-primary h-10 px-4 font-medium"
                >
                  <FolderOpen className="h-4 w-4" />
                  Projects
                </Button>
              </Link>
              <Link href="/calendar">
                <Button
                  variant="ghost"
                  className="gap-2 text-gray-700 hover:bg-gray-50 hover:text-primary h-10 px-4 font-medium"
                >
                  <Calendar className="h-4 w-4" />
                  Calendar
                </Button>
              </Link>
              <Link href="/announcements">
                <Button
                  variant="ghost"
                  className="gap-2 text-gray-700 hover:bg-gray-50 hover:text-primary h-10 px-4 font-medium"
                >
                  <Bell className="h-4 w-4" />
                  Announcements
                </Button>
              </Link>
              <Link href="/team">
                <Button
                  variant="ghost"
                  className="gap-2 text-gray-700 hover:bg-gray-50 hover:text-primary h-10 px-4 font-medium"
                >
                  <Users className="h-4 w-4" />
                  Team
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="gap-2 bg-primary/5 text-primary hover:bg-primary/10 h-10 px-4 font-medium"
              >
                <Settings className="h-4 w-4" />
                Admin
              </Button>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-600 hover:text-primary"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  {user?.role}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-gray-600"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <nav className="px-4 py-2 space-y-1">
              <Link
                href="/"
                onClick={() => setShowMobileMenu(false)}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-50 hover:text-primary h-12 px-4 font-medium"
                >
                  <TrendingUp className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link
                href="/projects"
                onClick={() => setShowMobileMenu(false)}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-50 hover:text-primary h-12 px-4 font-medium"
                >
                  <FolderOpen className="h-4 w-4" />
                  Projects
                </Button>
              </Link>
              <Link
                href="/calendar"
                onClick={() => setShowMobileMenu(false)}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-50 hover:text-primary h-12 px-4 font-medium"
                >
                  <Calendar className="h-4 w-4" />
                  Calendar
                </Button>
              </Link>
              <Link
                href="/announcements"
                onClick={() => setShowMobileMenu(false)}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-50 hover:text-primary h-12 px-4 font-medium"
                >
                  <Bell className="h-4 w-4" />
                  Announcements
                </Button>
              </Link>
              <Link
                href="/team"
                onClick={() => setShowMobileMenu(false)}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-50 hover:text-primary h-12 px-4 font-medium"
                >
                  <Users className="h-4 w-4" />
                  Team
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 bg-primary/5 text-primary hover:bg-primary/10 h-12 px-4 font-medium"
              >
                <Settings className="h-4 w-4" />
                Admin
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
              <p className="text-gray-600">Manage users, roles, and permissions</p>
            </div>
          </div>

          <Tabs
            defaultValue="users"
            className="space-y-6"
          >
            <TabsList>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
            </TabsList>

            <TabsContent
              value="users"
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">User Management</h3>
                  <p className="text-gray-600">Manage system users and their access levels</p>
                </div>
                <Dialog
                  open={isAddUserOpen}
                  onOpenChange={setIsAddUserOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>Create a new user account with appropriate access level</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          type="text"
                          value={newUser.name}
                          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                          placeholder="Enter full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                          placeholder="Enter email address"
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Temporary Password *</Label>
                        <Input
                          id="password"
                          type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                          placeholder="Enter temporary password"
                        />
                        <p className="text-xs text-gray-600 mt-1">User should change this password after first login</p>
                      </div>
                      <div>
                        <Label htmlFor="role">Role *</Label>
                        <Select
                          value={newUser.role}
                          onValueChange={(value: any) => setNewUser({ ...newUser, role: value, projects: [] })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="administrator">Administrator</SelectItem>
                            <SelectItem value="lead">Lead</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {newUser.role === "lead" && (
                        <div>
                          <Label>Assigned Projects</Label>
                          <p className="text-sm text-gray-600 mb-2">Select projects this lead can manage</p>
                          <div className="border border-gray-200 rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                            {projects.map((project) => (
                              <div
                                key={project.id}
                                className="flex items-center gap-2"
                              >
                                <Checkbox
                                  id={`new-project-${project.id}`}
                                  checked={newUser.projects.includes(project.id)}
                                  onCheckedChange={() => toggleProject(project.id, true)}
                                />
                                <Label
                                  htmlFor={`new-project-${project.id}`}
                                  className="cursor-pointer"
                                >
                                  {project.name}
                                </Label>
                              </div>
                            ))}
                            {projects.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No projects available</p>}
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={handleAddUser}
                          className="flex-1"
                          disabled={isLoading}
                        >
                          {isLoading ? "Adding..." : "Add User"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsAddUserOpen(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Administrator Group */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-primary" />
                        Administrators ({adminUsers.length})
                      </div>
                    </CardTitle>
                    <CardDescription>Full system access</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {adminUsers.map((user) => (
                        <div
                          key={user.email}
                          className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/20 text-primary-foreground">{user.email.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{user.email}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.email)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {adminUsers.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No administrators found</p>}
                    </div>
                  </CardContent>
                </Card>

                {/* Lead Group */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-chart-3" />
                        Leads ({leadUsers.length})
                      </div>
                    </CardTitle>
                    <CardDescription>Project owners & tech leads</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {leadUsers.map((user) => (
                        <div
                          key={user.email}
                          className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-chart-3/20 text-chart-3">{user.email.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{user.email}</p>
                              <p className="text-xs text-gray-600">
                                {user.projects.length} project{user.projects.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.email)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {leadUsers.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No leads found</p>}
                    </div>
                  </CardContent>
                </Card>

                {/* User Group */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-secondary" />
                        Users ({regularUsers.length})
                      </div>
                    </CardTitle>
                    <CardDescription>Standard access</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {regularUsers.map((user) => (
                        <div
                          key={user.email}
                          className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-secondary/20 text-secondary-foreground">{user.email.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{user.email}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.email)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {regularUsers.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No users found</p>}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Edit User Dialog */}
              <Dialog
                open={isEditUserOpen}
                onOpenChange={setIsEditUserOpen}
              >
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>Update user information, role and project assignments</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-name">Full Name *</Label>
                      <Input
                        id="edit-name"
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-email">Email Address</Label>
                      <Input
                        id="edit-email"
                        type="email"
                        value={editForm.email}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-password">New Password (optional)</Label>
                      <Input
                        id="edit-password"
                        type="password"
                        value={editForm.password}
                        onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                        placeholder="Leave blank to keep current password"
                      />
                      <p className="text-xs text-gray-600 mt-1">Only fill this if you want to change the password</p>
                    </div>
                    <div>
                      <Label htmlFor="edit-role">Role *</Label>
                      <Select
                        value={editForm.role}
                        onValueChange={(value: any) => setEditForm({ ...editForm, role: value, projects: [] })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="administrator">Administrator</SelectItem>
                          <SelectItem value="lead">Lead</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {editForm.role === "lead" && (
                      <div>
                        <Label>Assigned Projects</Label>
                        <p className="text-sm text-gray-600 mb-2">Select projects this lead can manage</p>
                        <div className="border border-gray-200 rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                          {projects.map((project) => (
                            <div
                              key={project.id}
                              className="flex items-center gap-2"
                            >
                              <Checkbox
                                id={`edit-project-${project.id}`}
                                checked={editForm.projects.includes(project.id)}
                                onCheckedChange={() => toggleProject(project.id, false)}
                              />
                              <Label
                                htmlFor={`edit-project-${project.id}`}
                                className="cursor-pointer"
                              >
                                {project.name}
                              </Label>
                            </div>
                          ))}
                          {projects.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No projects available</p>}
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={handleUpdateUser}
                        className="flex-1"
                        disabled={isLoading}
                      >
                        {isLoading ? "Updating..." : "Update User"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditUserOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent
              value="roles"
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-primary" />
                      Administrator
                    </CardTitle>
                    <CardDescription>Full system access</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-chart-4" />
                        <span className="text-sm">Full access to all projects</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-chart-4" />
                        <span className="text-sm">Manage all announcements</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-chart-4" />
                        <span className="text-sm">Manage calendar & vacations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-chart-4" />
                        <span className="text-sm">Manage team members</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-chart-4" />
                        <span className="text-sm">Access admin dashboard</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-chart-3" />
                      Lead
                    </CardTitle>
                    <CardDescription>Project owners & tech leads</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-chart-3" />
                        <span className="text-sm">Full access to assigned projects</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-chart-3" />
                        <span className="text-sm">Read-only for other projects</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-chart-3" />
                        <span className="text-sm">Add/edit announcements</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-chart-3" />
                        <span className="text-sm">Add/edit calendar events</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-chart-3" />
                        <span className="text-sm">View team directory</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-secondary" />
                      User
                    </CardTitle>
                    <CardDescription>Standard access</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Read-only access to projects</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Add/edit announcements</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Add/edit calendar events</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">View team directory</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Request vacations</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
