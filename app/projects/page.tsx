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
import { AdminOnly } from "@/components/admin-only"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

const getUpdatedProjects = () => {
  // console.log("[v0] Starting getUpdatedProjects...")
  const staticProjects = [
    {
      id: 1,
      title: "Website Redesign",
      description: "Complete overhaul of company website with modern design and improved UX",
      status: "In Progress",
      progress: 65,
      team: [
        { name: "Sarah Miller", role: "Project Manager", avatar: "/team-sarah.png" },
        { name: "John Davis", role: "UI/UX Designer", avatar: "/team-john.png" },
        { name: "Mike Johnson", role: "Developer", avatar: "/team-mike.png" },
      ],
      department: "Marketing",
      startDate: "2024-01-15",
      endDate: "2024-03-30",
      priority: "High",
      budget: "$45,000",
      spent: "$29,250",
    },
    {
      id: 2,
      title: "Mobile App Launch",
      description: "Development and launch of iOS and Android mobile applications",
      status: "Planning",
      progress: 25,
      team: [
        { name: "Emily Chen", role: "Mobile Developer", avatar: "/team-member-1.png" },
        { name: "David Wilson", role: "QA Engineer", avatar: "/team-member-2.png" },
        { name: "Lisa Anderson", role: "Product Manager", avatar: "/team-member-3.png" },
        { name: "Tom Rodriguez", role: "Backend Developer", avatar: "/professional-headshot.png" },
      ],
      department: "Technology",
      startDate: "2024-02-01",
      endDate: "2024-06-15",
      priority: "High",
      budget: "$75,000",
      spent: "$18,750",
    },
    {
      id: 3,
      title: "Q4 Planning Initiative",
      description: "Strategic planning and goal setting for the fourth quarter",
      status: "Complete",
      progress: 100,
      team: [
        { name: "Robert Johnson", role: "Strategy Lead", avatar: "/ceo-headshot.png" },
        { name: "Jennifer Smith", role: "Analyst", avatar: "/team-member-1.png" },
      ],
      department: "Operations",
      startDate: "2024-09-01",
      endDate: "2024-09-30",
      priority: "Medium",
      budget: "$25,000",
      spent: "$25,000",
    },
    {
      id: 4,
      title: "Customer Support Portal",
      description: "Implementation of new customer support ticketing system",
      status: "In Progress",
      progress: 40,
      team: [
        { name: "Alex Thompson", role: "System Admin", avatar: "/team-member-2.png" },
        { name: "Maria Garcia", role: "Support Lead", avatar: "/team-member-3.png" },
        { name: "Chris Lee", role: "Developer", avatar: "/team-member-1.png" },
      ],
      department: "Customer Service",
      startDate: "2024-01-20",
      endDate: "2024-04-10",
      priority: "Medium",
      budget: "$35,000",
      spent: "$14,000",
    },
    {
      id: 5,
      title: "Data Analytics Dashboard",
      description: "Business intelligence dashboard for real-time analytics",
      status: "Planning",
      progress: 15,
      team: [
        { name: "Kevin Park", role: "Data Analyst", avatar: "/professional-headshot.png" },
        { name: "Rachel Green", role: "BI Developer", avatar: "/team-member-2.png" },
      ],
      department: "Analytics",
      startDate: "2024-03-01",
      endDate: "2024-07-15",
      priority: "Low",
      budget: "$50,000",
      spent: "$7,500",
    },
    {
      id: 6,
      title: "Security Audit & Compliance",
      description: "Comprehensive security review and compliance implementation",
      status: "In Progress",
      progress: 30,
      team: [
        { name: "Daniel Kim", role: "Security Specialist", avatar: "/team-member-3.png" },
        { name: "Sophie Turner", role: "Compliance Officer", avatar: "/team-member-1.png" },
      ],
      department: "IT Security",
      startDate: "2024-02-15",
      endDate: "2024-05-30",
      priority: "High",
      budget: "$40,000",
      spent: "$12,000",
    },
  ]

  // console.log(
  //   "[v0] Static projects loaded:",
  //   staticProjects.map((p) => ({ id: p.id, title: p.title })),
  // )

  const activeProjects = []

  // Check each static project for deletion and updates
  for (const project of staticProjects) {
    // Check if project is deleted
    const deletionMarker = localStorage.getItem(`project_${project.id}_deleted`)
    // console.log(
    //   `[v0] Project ${project.id} (${project.title}) - Deletion marker: ${deletionMarker}, Is deleted: ${deletionMarker === "true"}`,
    // )

    if (deletionMarker === "true") {
      // console.log(`[v0] Skipping deleted project: ${project.title}`)
      continue // Skip deleted projects
    }

    // Load any updates from localStorage
    const storedProjectData = localStorage.getItem(`project_${project.id}`)
    if (storedProjectData) {
      try {
        const updatedProject = JSON.parse(storedProjectData)
        // console.log(`[v0] Found updates for project ${project.id}:`, {
        //   originalTitle: project.title,
        //   updatedTitle: updatedProject.title,
        // })

        // Merge all properties from stored data
        const mergedProject = {
          ...project,
          ...updatedProject,
          team: updatedProject.team || project.team || [],
        }
        activeProjects.push(mergedProject)
      } catch (error) {
        console.error(`[v0] Error parsing stored project ${project.id}:`, error)
        activeProjects.push(project)
      }
    } else {
      activeProjects.push(project)
    }
  }

  // console.log(
  //   "[v0] Active projects after deletion filter:",
  //   activeProjects.map((p) => ({ id: p.id, title: p.title })),
  // )

  const allKeys = Object.keys(localStorage)
  // console.log("[v0] All localStorage keys:", allKeys)

  const projectKeys = allKeys.filter((key) => key.startsWith("project_"))
  // console.log("[v0] All project keys in localStorage:", projectKeys)

  const staticProjectIds = staticProjects.map((p) => p.id)
  // console.log("[v0] Static project IDs:", staticProjectIds)

  const newProjectKeys = allKeys.filter((key) => {
    if (!key.startsWith("project_") || key.endsWith("_deleted")) {
      return false
    }

    // Extract project ID from key (e.g., "project_7" -> 7)
    const projectIdMatch = key.match(/^project_(\d+)$/)
    if (!projectIdMatch) {
      return false
    }

    const projectId = Number.parseInt(projectIdMatch[1])
    const isNewProject = !staticProjectIds.includes(projectId)

    // console.log(`[v0] Checking key ${key}: projectId=${projectId}, isNewProject=${isNewProject}`)
    return isNewProject
  })

  // console.log("[v0] New project keys found:", newProjectKeys)

  if (newProjectKeys.length === 0) {
    // console.log("[v0] No new projects found, checking localStorage again...")
    // Force a fresh read of localStorage
    const freshKeys = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith("project_") && !key.endsWith("_deleted")) {
        freshKeys.push(key)
      }
    }
    // console.log("[v0] Fresh localStorage scan found project keys:", freshKeys)

    // Check for new projects in fresh scan
    for (const key of freshKeys) {
      const projectIdMatch = key.match(/^project_(\d+)$/)
      if (projectIdMatch) {
        const projectId = Number.parseInt(projectIdMatch[1])
        if (!staticProjectIds.includes(projectId)) {
          newProjectKeys.push(key)
          // console.log(`[v0] Found new project in fresh scan: ${key}`)
        }
      }
    }
  }

  for (const key of newProjectKeys) {
    try {
      const projectData = JSON.parse(localStorage.getItem(key))
      if (projectData && projectData.id) {
        // console.log(`[v0] Adding new project from localStorage:`, { id: projectData.id, title: projectData.title })
        activeProjects.push(projectData)
      }
    } catch (error) {
      console.error(`[v0] Error parsing new project ${key}:`, error)
    }
  }

  // Calculate team counts for display
  const projectsWithCounts = activeProjects.map((project) => ({
    ...project,
    teamCount: project.team ? project.team.length : 0,
  }))

  // console.log(
  //   "[v0] Final project team counts:",
  //   projectsWithCounts.map((p) => ({ id: p.id, title: p.title, teamCount: p.teamCount })),
  // )

  return projectsWithCounts
}

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

  useEffect(() => {
    const updatedProjects = getUpdatedProjects()
    // console.log(
    //   "[v0] Projects loaded on mount:",
    //   updatedProjects.map((p) => ({ id: p.id, title: p.title, teamCount: p.team.length })),
    // )
    setProjects(updatedProjects)
  }, [])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const updatedProjects = getUpdatedProjects()
        // console.log(
        //   "[v0] Projects updated on visibility change:",
        //   updatedProjects.map((p) => ({ id: p.id, title: p.title, teamCount: p.team.length })),
        // )
        setProjects(updatedProjects)
      }
    }

    const handleFocus = () => {
      const updatedProjects = getUpdatedProjects()
      // console.log(
      //   "[v0] Projects updated on focus:",
      //   updatedProjects.map((p) => ({ id: p.id, title: p.title, teamCount: p.team.length })),
      // )
      setProjects(updatedProjects)
    }

    const handleStorageChange = (e) => {
      if (e.key && e.key.startsWith("project_")) {
        // console.log("[v0] Storage change detected:", e.key)
        setTimeout(() => {
          const updatedProjects = getUpdatedProjects()
          // console.log(
          //   "[v0] Projects updated on storage change:",
          //   updatedProjects.map((p) => ({ id: p.id, title: p.title, teamCount: p.team.length })),
          // )
          setProjects(updatedProjects)
        }, 100)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("focus", handleFocus)
    window.addEventListener("storage", handleStorageChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("storage", handleStorageChange)
    }
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
      <div className="min-h-screen bg-green-100 flex items-center justify-center">
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

  const handleCreateProject = () => {
    if (!newProject.title || !newProject.description) {
      alert("Please fill in at least the title and description")
      return
    }

    // Generate new project ID
    const newId = Math.max(...projects.map((p) => p.id), 0) + 1
    // console.log("[v0] Generated new project ID:", newId)

    // Create team array from comma-separated names
    const teamMembers = newProject.teamMembers
      ? newProject.teamMembers.split(",").map((name, index) => ({
          name: name.trim(),
          role: "Team Member",
          avatar: `/team-member-${(index % 3) + 1}.png`,
          email: `${name.trim().toLowerCase().replace(/\s+/g, ".")}@company.com`,
        }))
      : []

    const projectData = {
      id: newId,
      title: newProject.title,
      description: newProject.description,
      status: newProject.status,
      progress: 0,
      team: teamMembers,
      department: newProject.department,
      startDate: newProject.startDate,
      endDate: newProject.endDate,
      priority: newProject.priority,
      budget: newProject.budget,
      functionalities: [
        "Core functionality implementation",
        "User interface development",
        "Testing and quality assurance",
        "Documentation and deployment",
      ],
      milestones: [
        {
          name: "Project Kickoff",
          status: "Completed",
          startDate: newProject.startDate || new Date().toISOString().split("T")[0],
          endDate: newProject.startDate || new Date().toISOString().split("T")[0],
          description: "Initial project setup and planning",
        },
        {
          name: "Development Phase",
          status: "In Progress",
          startDate: newProject.startDate || new Date().toISOString().split("T")[0],
          endDate: newProject.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          description: "Core development and implementation",
        },
        {
          name: "Testing & Review",
          status: "Pending",
          startDate: newProject.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          endDate: newProject.endDate || new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          description: "Quality assurance and testing phase",
        },
        {
          name: "Project Completion",
          status: "Pending",
          startDate: newProject.endDate || new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          endDate: newProject.endDate || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          description: "Final delivery and project closure",
        },
      ],
      documents: [
        {
          id: 1,
          name: "Project Charter.pdf",
          size: "2.1 MB",
          category: "Planning",
          uploadedBy: "System",
          uploadedAt: new Date().toISOString(),
          sharepointUrl:
            "https://sharepoint.company.com/projects/" +
            newProject.title.toLowerCase().replace(/\s+/g, "-") +
            "/charter.pdf",
        },
        {
          id: 2,
          name: "Requirements Document.docx",
          size: "1.8 MB",
          category: "Documentation",
          uploadedBy: "System",
          uploadedAt: new Date().toISOString(),
          sharepointUrl:
            "https://sharepoint.company.com/projects/" +
            newProject.title.toLowerCase().replace(/\s+/g, "-") +
            "/requirements.docx",
        },
      ],
      spent: "$0",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "Current User",
    }

    // console.log("[v0] Creating new project:", projectData)

    localStorage.setItem(`project_${newId}`, JSON.stringify(projectData))
    // console.log("[v0] Saved project to localStorage with key:", `project_${newId}`)

    // Trigger storage event for immediate synchronization
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: `project_${newId}`,
        newValue: JSON.stringify(projectData),
      }),
    )

    const updatedProjects = getUpdatedProjects()
    // console.log(
    //   "[v0] Updated projects after creation:",
    //   updatedProjects.map((p) => ({ id: p.id, title: p.title })),
    // )
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
  }

  const handleEditProject = (project) => {
    setEditingProject({
      ...project,
      teamMembers: project.team.map((member) => member.name).join(", "),
    })
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = () => {
    if (!editingProject.title || !editingProject.description) {
      alert("Please fill in at least the title and description")
      return
    }

    // Create team array from comma-separated names
    const teamMembers = editingProject.teamMembers
      ? editingProject.teamMembers.split(",").map((name, index) => ({
          name: name.trim(),
          role: "Team Member",
          avatar: `/team-member-${(index % 3) + 1}.png`,
          email: `${name.trim().toLowerCase().replace(/\s+/g, ".")}@company.com`,
        }))
      : []

    const updatedProject = {
      ...editingProject,
      team: teamMembers,
    }

    // console.log("[v0] Updating project:", updatedProject)

    localStorage.setItem(`project_${editingProject.id}`, JSON.stringify(updatedProject))

    // Trigger storage event for immediate synchronization
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: `project_${editingProject.id}`,
        newValue: JSON.stringify(updatedProject),
      }),
    )

    setIsEditModalOpen(false)
    setEditingProject(null)

    // console.log("[v0] Project updated successfully")
  }

  const handleConfirmDelete = () => {
    if (deletingProject) {
      // console.log("[v0] Deleting project:", deletingProject)

      // Set deletion marker in localStorage
      localStorage.setItem(`project_${deletingProject.id}_deleted`, "true")

      // Remove project data from localStorage
      localStorage.removeItem(`project_${deletingProject.id}`)

      // Update local state immediately
      const updatedProjects = projects.filter((p) => p.id !== deletingProject.id)
      setProjects(updatedProjects)

      // Dispatch storage event for cross-tab sync
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: `project_${deletingProject.id}_deleted`,
          newValue: "true",
        }),
      )

      // console.log("[v0] Project deleted successfully")
      setDeletingProject(null)
      setIsDeleteModalOpen(false)

      // Force immediate re-sync
      setTimeout(() => {
        const refreshedProjects = getUpdatedProjects()
        setProjects(refreshedProjects)
        // console.log(
        //   "[v0] Projects refreshed after deletion:",
        //   refreshedProjects.map((p) => ({ id: p.id, title: p.title })),
        // )
      }, 100)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
              <AdminOnly>
                <Link href="/admin" onClick={() => setShowMobileMenu(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-50 hover:text-primary h-12 px-4 font-medium"
                  >
                    <Settings className="h-4 w-4" />
                    Admin
                  </Button>
                </Link>
              </AdminOnly>
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
            <AdminOnly>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </AdminOnly>
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
                    <AdminOnly>
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
                      </div>
                    </AdminOnly>
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
                      <span className="text-sm font-medium">{project.budget}</span>
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
