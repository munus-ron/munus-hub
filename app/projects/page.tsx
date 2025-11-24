"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Calendar,
  Users,
  Clock,
  Search,
  Plus,
  FolderOpen,
  TrendingUp,
  Bell,
  Menu,
  LogOut,
  Edit,
  Trash2,
  Settings,
} from "lucide-react"
import { usePermissions } from "@/hooks/use-permissions"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { getProjects, createProject, updateProject, deleteProject } from "@/app/actions/projects"

function getStatusColor(status: string) {
  switch (status) {
    case "Active":
      return "bg-chart-4 text-white"
    case "In Progress":
      return "bg-chart-3 text-white"
    case "Planning":
      return "bg-muted text-muted-foreground"
    case "Completed":
      return "bg-chart-4 text-white"
    default:
      return "bg-muted text-muted-foreground"
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "Critical":
      return "bg-destructive text-destructive-foreground"
    case "High":
      return "bg-chart-3 text-white"
    case "Medium":
      return "bg-accent text-accent-foreground"
    case "Low":
      return "bg-muted text-muted-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export default function ProjectsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [deletingProject, setDeletingProject] = useState(null)
  const [selectedMember, setSelectedMember] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [projects, setProjects] = useState([])
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    status: "Planning",
    priority: "Medium",
    department: "",
    startDate: "",
    endDate: "",
    budget: "",
    teamMembers: "",
  })
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const { user, logout, isAuthenticated } = useAuth()
  const { isAdministrator, canEditProject, loading: permissionsLoading } = usePermissions()

  useEffect(() => {
    async function loadProjects() {
      const projectsData = await getProjects()
      console.log("[v0] Projects loaded from database:", projectsData)
      setProjects(projectsData)
    }
    loadProjects()
  }, [])

  const getAllTeamMembers = () => {
    const allMembers = projects.flatMap((project) => project.team.map((member) => member.name))
    return [...new Set(allMembers)].sort()
  }

  const uniqueTeamMembers = getAllTeamMembers()

  const filteredProjects = projects.filter((project) => {
    const memberMatch =
      selectedMember === "all" ||
      project.team.some((member) => member.name.toLowerCase().replace(/\s+/g, "-") === selectedMember)

    const statusMatch = selectedStatus === "all" || project.status.toLowerCase().replace(/\s+/g, "-") === selectedStatus

    const searchMatch =
      searchTerm === "" ||
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())

    return memberMatch && statusMatch && searchMatch
  })

  const handleDeleteProject = (project) => {
    setDeletingProject(project)
    setIsDeleteModalOpen(true)
  }

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <Card className="border-gray-100 shadow-lg">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-serif">Access Required</CardTitle>
              <CardDescription>Please sign in to view projects</CardDescription>
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

  const handleCreateProject = async () => {
    if (!newProject.title || !newProject.description) {
      alert("Please fill in at least the title and description")
      return
    }

    try {
      await createProject(newProject)

      // Reload projects from database
      const updatedProjects = await getProjects()
      console.log("[v0] Projects after creation:", updatedProjects)
      setProjects(updatedProjects)

      // Reset form and close modal
      setNewProject({
        title: "",
        description: "",
        status: "Planning",
        priority: "Medium",
        department: "",
        startDate: "",
        endDate: "",
        budget: "",
        teamMembers: "",
      })
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error("[v0] Error creating project:", error)
      alert("Failed to create project. Please try again.")
    }
  }

  const handleEditProject = (project) => {
    setEditingProject({
      ...project,
      title: project.title || "",
      description: project.description || "",
      status: project.status || "Planning",
      priority: project.priority || "Medium",
      progress: project.progress || 0,
      budget: project.budget || "",
      department: project.department || "",
      startDate: project.startDate || "",
      endDate: project.endDate || "",
      teamMembers: project.team?.map((member) => member.name).join(", ") || "",
    })
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingProject.title || !editingProject.description) {
      alert("Please fill in at least the title and description")
      return
    }

    try {
      await updateProject(editingProject.id, editingProject)

      // Reload projects from database
      const updatedProjects = await getProjects()
      console.log("[v0] Projects after update:", updatedProjects)
      setProjects(updatedProjects)

      setIsEditModalOpen(false)
      setEditingProject(null)
    } catch (error) {
      console.error("[v0] Error updating project:", error)
      alert("Failed to update project. Please try again.")
    }
  }

  const handleConfirmDelete = async () => {
    if (deletingProject) {
      try {
        await deleteProject(deletingProject.id)

        // Reload projects from database
        const updatedProjects = await getProjects()
        console.log("[v0] Projects after deletion:", updatedProjects)
        setProjects(updatedProjects)

        setDeletingProject(null)
        setIsDeleteModalOpen(false)
      } catch (error) {
        console.error("[v0] Error deleting project:", error)
        alert("Failed to delete project. Please try again.")
      }
    }
  }

  return (
    <div className="min-h-screen bg-green-50">
      <header className="border-b border-gray-100 bg-white">
        <div className="flex h-20 items-center justify-between px-8">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <img src="/munus-logo.jpg" alt="Munus Logo" className="h-8 w-auto" />
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
              <Button
                variant="ghost"
                className="gap-2 bg-primary/5 text-primary hover:bg-primary/10 h-10 px-4 font-medium"
              >
                <FolderOpen className="h-4 w-4" />
                Projects
              </Button>
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
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={logout} className="text-gray-600 hover:text-primary">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <nav className="px-4 py-2 space-y-1">
              <Link href="/" onClick={() => setShowMobileMenu(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-50 hover:text-primary h-12 px-4 font-medium"
                >
                  <TrendingUp className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 bg-primary/5 text-primary hover:bg-primary/10 h-12 px-4 font-medium"
              >
                <FolderOpen className="h-4 w-4" />
                Projects
              </Button>
              <Link href="/calendar" onClick={() => setShowMobileMenu(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-50 hover:text-primary h-12 px-4 font-medium"
                >
                  <Calendar className="h-4 w-4" />
                  Calendar
                </Button>
              </Link>
              <Link href="/announcements" onClick={() => setShowMobileMenu(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-50 hover:text-primary h-12 px-4 font-medium"
                >
                  <Bell className="h-4 w-4" />
                  Announcements
                </Button>
              </Link>
              <Link href="/team" onClick={() => setShowMobileMenu(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-50 hover:text-primary h-12 px-4 font-medium"
                >
                  <Users className="h-4 w-4" />
                  Team
                </Button>
              </Link>
              {isAdministrator && (
                <Link href="/admin" onClick={() => setShowMobileMenu(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-50 hover:text-primary h-12 px-4 font-medium"
                  >
                    <Settings className="h-4 w-4" />
                    Admin
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Projects</h2>
              <p className="text-gray-600">Manage and track all company projects</p>
            </div>
            {isAdministrator && (
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedMember} onValueChange={setSelectedMember}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Members</SelectItem>
                {uniqueTeamMembers.map((member) => (
                  <SelectItem key={member} value={member.toLowerCase().replace(/\s+/g, "-")}>
                    {member}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{project.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                    </div>
                    {(isAdministrator || canEditProject(project.id)) && (
                      <div className="flex gap-2 ml-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault()
                            handleEditProject(project)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {isAdministrator && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault()
                              handleDeleteProject(project)
                            }}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                    <Badge variant="outline" className={getPriorityColor(project.priority)}>
                      {project.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <Link href={`/projects/${project.id}`}>
                  <CardContent className="space-y-4 cursor-pointer">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Team ({project.team.length})</span>
                      </div>
                      <div className="flex -space-x-2">
                        {project.team.slice(0, 3).map((member, index) => (
                          <Avatar key={index} className="h-8 w-8 border-2 border-background">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {project.team.length > 3 && (
                          <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">+{project.team.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(project.startDate).toLocaleDateString()}</span>
                      </div>
                      <span>→</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(project.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-border">
                      <div></div>
                      <span className="text-sm font-medium">
                        {project.budget
                          ? new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(project.budget)
                          : ""}
                      </span>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>Fill in the details below to create a new project for your team.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                className="col-span-3"
                placeholder="Enter project title"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <Textarea
                id="description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="col-span-3"
                placeholder="Enter project description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={newProject.status}
                onValueChange={(value) => setNewProject({ ...newProject, status: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select
                value={newProject.priority}
                onValueChange={(value) => setNewProject({ ...newProject, priority: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Department
              </Label>
              <Select
                value={newProject.department}
                onValueChange={(value) => setNewProject({ ...newProject, department: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="Strategy">Strategy</SelectItem>
                  <SelectItem value="Customer Success">Customer Success</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="IT Security">IT Security</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={newProject.startDate}
                onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date
              </Label>
              <Input
                id="endDate"
                type="date"
                value={newProject.endDate}
                onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="budget" className="text-right">
                Budget
              </Label>
              <Input
                id="budget"
                value={newProject.budget}
                onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                className="col-span-3"
                placeholder="e.g., $50,000"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="teamMembers" className="text-right">
                Team Members
              </Label>
              <Input
                id="teamMembers"
                value={newProject.teamMembers}
                onChange={(e) => setNewProject({ ...newProject, teamMembers: e.target.value })}
                className="col-span-3"
                placeholder="Enter team member names (comma separated)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject}>Create Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update the project details below.</DialogDescription>
          </DialogHeader>
          {editingProject && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">
                  Title
                </Label>
                <Input
                  id="edit-title"
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Status
                </Label>
                <Select
                  value={editingProject.status}
                  onValueChange={(value) => setEditingProject({ ...editingProject, status: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-priority" className="text-right">
                  Priority
                </Label>
                <Select
                  value={editingProject.priority}
                  onValueChange={(value) => setEditingProject({ ...editingProject, priority: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-progress" className="text-right">
                  Progress (%)
                </Label>
                <Input
                  id="edit-progress"
                  type="number"
                  min="0"
                  max="100"
                  value={editingProject.progress || 0}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, progress: Number.parseInt(e.target.value) || 0 })
                  }
                  className="col-span-3"
                  placeholder="Enter progress percentage (0-100)"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-budget" className="text-right">
                  Budget
                </Label>
                <Input
                  id="edit-budget"
                  value={editingProject.budget}
                  onChange={(e) => setEditingProject({ ...editingProject, budget: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-teamMembers" className="text-right">
                  Team Members
                </Label>
                <Input
                  id="edit-teamMembers"
                  value={editingProject.teamMembers}
                  onChange={(e) => setEditingProject({ ...editingProject, teamMembers: e.target.value })}
                  className="col-span-3"
                  placeholder="Enter team member names (comma separated)"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingProject?.title}"? This action cannot be undone and will remove
              all project data including team members and progress.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
