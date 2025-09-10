"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Settings,
  Users,
  Shield,
  Activity,
  UserPlus,
  Edit,
  Trash2,
  Search,
  Calendar,
  FolderOpen,
  Bell,
  TrendingUp,
  Menu,
  LogOut,
  Crown,
  User,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

// Mock users data - in a real app, this would come from a database
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "admin@company.com",
    role: "admin",
    avatar: "/professional-headshot.png",
    status: "active",
    lastLogin: "2024-12-10T14:30:00Z",
    createdAt: "2023-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "user@company.com",
    role: "user",
    avatar: "/ceo-headshot.png",
    status: "active",
    lastLogin: "2024-12-09T16:45:00Z",
    createdAt: "2023-03-20T14:30:00Z",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    role: "user",
    avatar: "/team-member-1.png",
    status: "active",
    lastLogin: "2024-12-08T09:15:00Z",
    createdAt: "2023-06-10T11:20:00Z",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    role: "user",
    avatar: "/team-member-2.png",
    status: "inactive",
    lastLogin: "2024-11-25T13:22:00Z",
    createdAt: "2023-08-05T16:45:00Z",
  },
]

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getRoleColor(role: string) {
  switch (role) {
    case "admin":
      return "bg-primary text-primary-foreground"
    case "user":
      return "bg-secondary text-secondary-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-chart-4 text-white"
    case "inactive":
      return "bg-muted text-muted-foreground"
    case "suspended":
      return "bg-destructive text-destructive-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export default function AdminPage() {
  const [users, setUsers] = useState(mockUsers)
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "user",
    status: "active",
  })

  const { user, logout, isAuthenticated, isAdmin } = useAuth()

  // Redirect if not authenticated or not admin
  if (!isAuthenticated() || !isAdmin()) {
    return (
      <div className="min-h-screen bg-green-100 flex items-center justify-center">
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
    )
  }

  const handleCreateUser = () => {
    const newUserData = {
      id: String(users.length + 1),
      ...newUser,
      avatar: "/placeholder.svg",
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }
    setUsers([...users, newUserData])
    setNewUser({ name: "", email: "", role: "user", status: "active" })
    setIsCreateUserOpen(false)
  }

  const handleUpdateUser = (userId: string, updates: any) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, ...updates } : u)))
    setEditingUser(null)
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((u) => u.id !== userId))
  }

  const adminUsers = users.filter((u) => u.role === "admin")
  const regularUsers = users.filter((u) => u.role === "user")
  const activeUsers = users.filter((u) => u.status === "active")

  return (
    <div className="min-h-screen bg-green-100">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white">
        <div className="flex h-20 items-center justify-between px-8">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">IH</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 font-serif">Intranet Hub</h1>
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
            <Button variant="ghost" size="sm" className="md:hidden text-gray-600 hover:text-primary">
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
              <Button variant="ghost" size="sm" onClick={logout} className="text-gray-600 hover:text-primary">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
              <p className="text-gray-600">Manage users, roles, and system settings</p>
            </div>
            <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                  <DialogDescription>
                    Add a new user to the system with specified role and permissions.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="john.doe@company.com"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={newUser.status}
                        onValueChange={(value) => setNewUser({ ...newUser, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateUserOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateUser}>Create User</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-gray-700">Total Users</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{users.length}</p>
                <p className="text-sm text-gray-500">{activeUsers.length} active</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Crown className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-gray-700">Admin Users</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{adminUsers.length}</p>
                <p className="text-sm text-gray-500">System administrators</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <User className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-gray-700">Regular Users</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{regularUsers.length}</p>
                <p className="text-sm text-gray-500">Standard access</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Activity className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-gray-700">Active Sessions</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{activeUsers.length}</p>
                <p className="text-sm text-gray-500">Currently online</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
              <TabsTrigger value="settings">System Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search users..." className="pl-10" />
                </div>
                <Select>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Users Table */}
              <Card>
                <CardHeader>
                  <CardTitle>User Accounts</CardTitle>
                  <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.map((userData) => (
                      <div
                        key={userData.id}
                        className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-primary/20 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={userData.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {userData.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-gray-900">{userData.name}</h4>
                            <p className="text-sm text-gray-600">{userData.email}</p>
                            <p className="text-xs text-gray-500">Last login: {formatDate(userData.lastLogin)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getRoleColor(userData.role)}>
                            {userData.role === "admin" && <Crown className="h-3 w-3 mr-1" />}
                            {userData.role}
                          </Badge>
                          <Badge className={getStatusColor(userData.status)}>{userData.status}</Badge>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit User</DialogTitle>
                                  <DialogDescription>Update user information and permissions.</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input defaultValue={userData.name} />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Email Address</Label>
                                    <Input defaultValue={userData.email} />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Role</Label>
                                      <Select
                                        defaultValue={userData.role}
                                        onValueChange={(value) => handleUpdateUser(userData.id, { role: value })}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="user">User</SelectItem>
                                          <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Status</Label>
                                      <Select
                                        defaultValue={userData.status}
                                        onValueChange={(value) => handleUpdateUser(userData.id, { status: value })}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="active">Active</SelectItem>
                                          <SelectItem value="inactive">Inactive</SelectItem>
                                          <SelectItem value="suspended">Suspended</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline">Cancel</Button>
                                  <Button>Save Changes</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-destructive hover:text-destructive bg-transparent"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete User</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {userData.name}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteUser(userData.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete User
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="roles" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-primary" />
                      Admin Role
                    </CardTitle>
                    <CardDescription>Full system access and user management</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-chart-4" />
                        <span className="text-sm">Create, edit, and delete projects</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-chart-4" />
                        <span className="text-sm">Manage events and calendar</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-chart-4" />
                        <span className="text-sm">Create and manage announcements</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-chart-4" />
                        <span className="text-sm">Add and manage team members</span>
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
                      <User className="h-5 w-5 text-secondary" />
                      User Role
                    </CardTitle>
                    <CardDescription>Standard access to view and interact with content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">View projects and progress</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">View calendar and events</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Read announcements</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">View team directory</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Request time off</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>System activity and user actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl">
                      <div className="h-10 w-10 rounded-full bg-chart-4/10 flex items-center justify-center">
                        <UserPlus className="h-5 w-5 text-chart-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">New user registered</p>
                        <p className="text-sm text-gray-600">Jane Smith joined the system</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Settings className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">User role updated</p>
                        <p className="text-sm text-gray-600">Mike Johnson promoted to admin</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl">
                      <div className="h-10 w-10 rounded-full bg-chart-3/10 flex items-center justify-center">
                        <Activity className="h-5 w-5 text-chart-3" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">System backup completed</p>
                        <p className="text-sm text-gray-600">Automated daily backup successful</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Configure system security and access controls</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Require 2FA for admins</p>
                        <p className="text-sm text-gray-600">Force two-factor authentication for admin users</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Session timeout</p>
                        <p className="text-sm text-gray-600">Automatically log out inactive users</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Password policy</p>
                        <p className="text-sm text-gray-600">Set minimum password requirements</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Maintenance</CardTitle>
                    <CardDescription>System health and maintenance tools</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Database backup</p>
                        <p className="text-sm text-gray-600">Last backup: 2 hours ago</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Backup Now
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Clear cache</p>
                        <p className="text-sm text-gray-600">Improve system performance</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Clear Cache
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">System logs</p>
                        <p className="text-sm text-gray-600">View detailed system logs</p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Logs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
