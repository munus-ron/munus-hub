"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  Users,
  Bell,
  FolderOpen,
  Clock,
  TrendingUp,
  Menu,
  LogOut,
  UserPlus,
  Edit,
  Trash2,
  Settings,
} from "lucide-react"
import { LoginModal } from "@/components/login-modal"
import { useAuth } from "@/contexts/auth-context"
import { AdminOnly } from "@/components/admin-only"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Dashboard() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showManageUsersModal, setShowManageUsersModal] = useState(false)
  const [showUserForm, setShowUserForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    department: "",
    position: "",
  })

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Admin",
      email: "admin@company.com",
      role: "admin",
      department: "IT",
      position: "System Administrator",
      status: "active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@company.com",
      role: "user",
      department: "Marketing",
      position: "Marketing Manager",
      status: "active",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@company.com",
      role: "user",
      department: "Sales",
      position: "Sales Representative",
      status: "active",
    },
    {
      id: 4,
      name: "Alice Brown",
      email: "alice@company.com",
      role: "user",
      department: "HR",
      position: "HR Specialist",
      status: "inactive",
    },
  ])

  const { user, logout, isAuthenticated } = useAuth()

  const handleSaveUser = () => {
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...newUser, id: editingUser.id } : u)))
      console.log("[v0] Updated user:", newUser)
      alert(`User ${newUser.name} has been updated successfully!`)
    } else {
      const newId = Math.max(...users.map((u) => u.id)) + 1
      setUsers([...users, { ...newUser, id: newId, status: "active" }])
      console.log("[v0] Added new user:", newUser)
      alert(`User ${newUser.name} has been added successfully!`)
    }

    setNewUser({
      name: "",
      email: "",
      password: "",
      role: "user",
      department: "",
      position: "",
    })
    setEditingUser(null)
    setShowUserForm(false)
  }

  const handleEditUser = (userToEdit) => {
    setEditingUser(userToEdit)
    setNewUser({
      name: userToEdit.name,
      email: userToEdit.email,
      password: "", // Don't pre-fill password for security
      role: userToEdit.role,
      department: userToEdit.department,
      position: userToEdit.position,
    })
    setShowUserForm(true)
  }

  const handleDeleteUser = (userId) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((u) => u.id !== userId))
      console.log("[v0] Deleted user with ID:", userId)
      alert("User has been deleted successfully!")
    }
  }

  const resetUserForm = () => {
    setNewUser({
      name: "",
      email: "",
      password: "",
      role: "user",
      department: "",
      position: "",
    })
    setEditingUser(null)
    setShowUserForm(false)
  }

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-green-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <Card className="border-gray-100 shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <img src="/munus-logo.jpg" alt="Munus Logo" className="h-12 w-auto" />
                <span className="text-3xl font-bold text-gray-900 font-serif">Munus Hub</span>
              </div>
              <CardDescription className="text-lg">Please sign in to access your workspace</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setShowLoginModal(true)} className="w-full text-lg py-6">
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
        <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-green-100">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white">
        <div className="flex h-20 items-center justify-between px-8">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <img src="/munus-logo.jpg" alt="Munus Logo" className="h-8 w-auto" />
                <span className="text-3xl font-bold text-gray-900 font-serif">Munus Hub</span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-1 ml-8">
              <Button variant="ghost" className="gap-2 bg-primary text-white hover:bg-primary/90 h-10 px-4 font-medium">
                <TrendingUp className="h-4 w-4" />
                Dashboard
              </Button>
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
              <AdminOnly>
                <Dialog open={showManageUsersModal} onOpenChange={setShowManageUsersModal}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="gap-2 text-gray-700 hover:bg-gray-50 hover:text-primary h-10 px-4 font-medium"
                    >
                      <Settings className="h-4 w-4" />
                      Manage Users
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold">User Management</DialogTitle>
                    </DialogHeader>

                    {!showUserForm ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <p className="text-gray-600">Manage user accounts and permissions</p>
                          <Button onClick={() => setShowUserForm(true)} className="gap-2">
                            <UserPlus className="h-4 w-4" />
                            Add New User
                          </Button>
                        </div>

                        <div className="border rounded-lg">
                          <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 font-medium text-sm text-gray-700 border-b">
                            <div>Name</div>
                            <div>Email</div>
                            <div>Role</div>
                            <div>Department</div>
                            <div>Status</div>
                            <div>Actions</div>
                          </div>
                          {users.map((userData) => (
                            <div
                              key={userData.id}
                              className="grid grid-cols-6 gap-4 p-4 border-b last:border-b-0 items-center"
                            >
                              <div className="font-medium">{userData.name}</div>
                              <div className="text-gray-600">{userData.email}</div>
                              <div>
                                <Badge variant={userData.role === "admin" ? "default" : "secondary"}>
                                  {userData.role === "admin" ? "Administrator" : "User"}
                                </Badge>
                              </div>
                              <div className="text-gray-600">{userData.department}</div>
                              <div>
                                <Badge variant={userData.status === "active" ? "default" : "outline"}>
                                  {userData.status}
                                </Badge>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditUser(userData)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteUser(userData.id)}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 py-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">{editingUser ? "Edit User" : "Add New User"}</h3>
                          <Button variant="outline" onClick={resetUserForm}>
                            Back to List
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              value={newUser.name}
                              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                              placeholder="Enter full name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address (Login)</Label>
                            <Input
                              id="email"
                              type="email"
                              value={newUser.email}
                              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                              placeholder="Enter email address"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                              id="password"
                              type="password"
                              value={newUser.password}
                              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                              placeholder={editingUser ? "Leave blank to keep current password" : "Enter password"}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="role">User Role</Label>
                            <Select
                              value={newUser.role}
                              onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select user role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">Regular User</SelectItem>
                                <SelectItem value="admin">Administrator</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Select
                              value={newUser.department}
                              onValueChange={(value) => setNewUser({ ...newUser, department: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="engineering">Engineering</SelectItem>
                                <SelectItem value="marketing">Marketing</SelectItem>
                                <SelectItem value="sales">Sales</SelectItem>
                                <SelectItem value="hr">Human Resources</SelectItem>
                                <SelectItem value="finance">Finance</SelectItem>
                                <SelectItem value="operations">Operations</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="position">Position</Label>
                            <Input
                              id="position"
                              value={newUser.position}
                              onChange={(e) => setNewUser({ ...newUser, position: e.target.value })}
                              placeholder="Enter job position"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                          <Button variant="outline" onClick={resetUserForm}>
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSaveUser}
                            disabled={
                              !newUser.name || !newUser.email || !newUser.role || (!editingUser && !newUser.password)
                            }
                          >
                            {editingUser ? "Update User" : "Add User"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </AdminOnly>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <Button variant="ghost" size="sm" className="md:hidden text-gray-600 hover:text-primary">
              <Menu className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary">
              <Bell className="h-5 w-5" />
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
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={logout} className="text-gray-600 hover:text-primary">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Welcome Section */}
          <div className="mb-12">
            <h2 className="text-5xl font-bold text-gray-900 mb-4 font-serif">
              Welcome back, {user?.name?.split(" ")[0]}!
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Our Munus Hub brings together all your essential tools and information in one centralized location, making
              collaboration seamless and productivity effortless.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-base font-semibold text-gray-700">Active Projects</CardTitle>
                <FolderOpen className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-1">12</div>
                <p className="text-sm text-gray-500">+2 from last month</p>
              </CardContent>
            </Card>
            <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-base font-semibold text-gray-700">Team Members</CardTitle>
                <Users className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-1">48</div>
                <p className="text-sm text-gray-500">Across 6 departments</p>
              </CardContent>
            </Card>
            <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-base font-semibold text-gray-700">Upcoming Events</CardTitle>
                <Calendar className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-1">5</div>
                <p className="text-sm text-gray-500">This week</p>
              </CardContent>
            </Card>
            <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-base font-semibold text-gray-700">Pending Tasks</CardTitle>
                <Clock className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-1">23</div>
                <p className="text-sm text-gray-500">Due this week</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-green-100 rounded-3xl p-12 mb-16">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-4xl font-bold text-gray-900 mb-6 font-serif">Streamline Your Workflow</h3>
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Our Munus Hub brings together all your essential tools and information in one centralized location,
                making collaboration seamless and productivity effortless.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/projects">
                  <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg">
                    Explore Projects
                  </Button>
                </Link>
                <Link href="/calendar">
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-white px-8 py-3 text-lg bg-transparent"
                  >
                    View Calendar
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Recent Projects */}
            <Card className="border-gray-100 shadow-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-semibold text-gray-900 font-serif">Recent Projects</CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Latest project updates and milestones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-6 border border-gray-100 rounded-xl hover:border-primary/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <FolderOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">Website Redesign</h4>
                      <p className="text-gray-600">Marketing Team</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    In Progress
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-6 border border-gray-100 rounded-xl hover:border-primary/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <FolderOpen className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">Mobile App Launch</h4>
                      <p className="text-gray-600">Development Team</p>
                    </div>
                  </div>
                  <Badge className="bg-primary text-white">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-6 border border-gray-100 rounded-xl hover:border-primary/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-chart-4/10 flex items-center justify-center">
                      <FolderOpen className="h-6 w-6 text-chart-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">Q4 Planning</h4>
                      <p className="text-gray-600">Strategy Team</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-gray-300 text-gray-700">
                    Planning
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Recent Announcements */}
            <Card className="border-gray-100 shadow-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-semibold text-gray-900 font-serif">Recent Announcements</CardTitle>
                <CardDescription className="text-gray-600 text-base">Latest company news and updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 border border-gray-100 rounded-xl hover:border-primary/20 transition-colors">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/ceo-headshot.png" />
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-lg mb-2">New Office Opening</h4>
                      <p className="text-gray-600 mb-3 leading-relaxed">
                        We're excited to announce our new branch office in Austin, Texas...
                      </p>
                      <p className="text-sm text-gray-500">Sarah Miller • 2 hours ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 border border-gray-100 rounded-xl hover:border-primary/20 transition-colors">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder-wb2g6.png" />
                      <AvatarFallback>RJ</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-lg mb-2">Holiday Schedule Update</h4>
                      <p className="text-gray-600 mb-3 leading-relaxed">
                        Please note the updated holiday schedule for the remainder of the year...
                      </p>
                      <p className="text-sm text-gray-500">Robert Johnson • 1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Events */}
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-8">
              <CardTitle className="text-2xl font-semibold text-gray-900 font-serif">
                Upcoming Events & Deadlines
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Important dates and milestones to keep track of
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="p-6 border border-gray-100 rounded-xl hover:border-primary/20 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="text-sm font-semibold text-gray-700">Dec 15, 2024</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 text-lg mb-2">All Hands Meeting</h4>
                  <p className="text-gray-600 leading-relaxed">Quarterly review and planning session</p>
                </div>
                <div className="p-6 border border-gray-100 rounded-xl hover:border-primary/20 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="text-sm font-semibold text-gray-700">Dec 18, 2024</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 text-lg mb-2">Project Deadline</h4>
                  <p className="text-gray-600 leading-relaxed">Website redesign final delivery</p>
                </div>
                <div className="p-6 border border-gray-100 rounded-xl hover:border-primary/20 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="text-sm font-semibold text-gray-700">Dec 20, 2024</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 text-lg mb-2">Team Building Event</h4>
                  <p className="text-gray-600 leading-relaxed">Annual holiday celebration</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
