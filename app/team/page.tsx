"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Edit, Trash2, MessageCircle, Camera, Menu, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { AdminOnly } from "@/components/admin-only"
import {
  TrendingUp,
  FolderOpen,
  Bell,
  MessageSquare,
  Pencil,
  Settings,
  Users,
  Building,
  MapPin,
  Mail,
  Phone,
  Upload,
  Calendar,
} from "lucide-react"
import {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  updateTeamMemberImage,
} from "@/app/actions/team"

import type React from "react"

// Removed: import { loadTeamDataFromStorage, saveTeamDataToStorage } from "@/lib/utils"

// Removed: hard-coded departments array - department info will come from database
// Removed: hard-coded founders, advisors, and consultants arrays - all data now comes from database

function getDepartmentColor(department: string) {
  return "bg-muted text-muted-foreground"
}

function formatStartDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const years = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 365))
  return `${years} year${years !== 1 ? "s" : ""}`
}

export default function TeamPage() {
  const [selectedMember, setSelectedMember] = useState<any>(null)
  const [messageContent, setMessageContent] = useState("")
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const { user, logout, isAuthenticated } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingPerson, setEditingPerson] = useState<any>(null)
  const [deletingPerson, setDeletingPerson] = useState<any>(null)
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    role: "",
    department: "",
    email: "",
    phone: "",
    location: "",
    category: "", // New field for category selection
  })
  const [isImageEditModalOpen, setIsImageEditModalOpen] = useState(false)
  const [editingPersonImage, setEditingPersonImage] = useState<any>(null)
  const [selectedPerson, setSelectedPerson] = useState<any>(null)
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)

  const [foundersState, setFounders] = useState([])
  const [advisorsState, setAdvisors] = useState([])
  const [consultantsState, setConsultants] = useState([])

  useEffect(() => {
    async function loadTeamData() {
      const teamData = await getTeamMembers()
      console.log("[v0] Team data loaded from database:", teamData)
      setFounders(teamData.founders.map((f: any) => ({ ...f, avatar: f.image || f.avatar })))
      setAdvisors(teamData.advisors.map((a: any) => ({ ...a, avatar: a.image || a.avatar })))
      setConsultants(teamData.consultants.map((c: any) => ({ ...c, avatar: c.image || c.avatar })))
    }
    loadTeamData()
  }, [])

  const getDistinctLocationsCount = () => {
    const allLocations = [
      ...foundersState.map((person) => person.location),
      ...advisorsState.map((person) => person.location),
      ...consultantsState.map((person) => person.location),
    ]

    const uniqueLocations = new Set(allLocations)
    return uniqueLocations.size
  }

  const getUniqueLocations = () => {
    const allLocations = [
      ...foundersState.map((person) => person.location),
      ...advisorsState.map((person) => person.location),
      ...consultantsState.map((person) => person.location),
    ]

    // Filter out empty/null locations and get unique values
    const uniqueLocations = Array.from(new Set(allLocations.filter((loc) => loc && loc.trim() !== "")))
    return uniqueLocations.sort() // Sort alphabetically
  }

  const filteredFounders = Array.isArray(foundersState)
    ? foundersState.filter((person) => {
        const matchesSearch =
          person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          person.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          person.email.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesLocation =
          selectedLocation === "all" ||
          person.location
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, "")
            .replace(/\s+/g, " ")
            .includes(
              selectedLocation
                .replace(/-/g, " ")
                .replace(/[^a-z0-9\s]/g, "")
                .replace(/\s+/g, " "),
            )

        return matchesSearch && matchesLocation
      })
    : []

  const filteredAdvisors = advisorsState.filter((person) => {
    const matchesSearch =
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLocation =
      selectedLocation === "all" ||
      person.location
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, " ")
        .includes(
          selectedLocation
            .replace(/-/g, " ")
            .replace(/[^a-z0-9\s]/g, "")
            .replace(/\s+/g, " "),
        )

    return matchesSearch && matchesLocation
  })

  const filteredConsultants = consultantsState.filter((person) => {
    const matchesSearch =
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLocation =
      selectedLocation === "all" ||
      person.location
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, " ")
        .includes(
          selectedLocation
            .replace(/-/g, " ")
            .replace(/[^a-z0-9\s]/g, "")
            .replace(/\s+/g, " "),
        )

    return matchesSearch && matchesLocation
  })

  const handleAddEmployee = async () => {
    console.log("Adding new team member:", newEmployee)

    if (newEmployee.name && newEmployee.category && newEmployee.email) {
      try {
        await createTeamMember({
          ...newEmployee,
          avatar: "/placeholder.svg",
        })

        // Reload team data from database
        const teamData = await getTeamMembers()
        setFounders(teamData.founders.map((f: any) => ({ ...f, avatar: f.image || f.avatar })))
        setAdvisors(teamData.advisors.map((a: any) => ({ ...a, avatar: a.image || a.avatar })))
        setConsultants(teamData.consultants.map((c: any) => ({ ...c, avatar: c.image || c.avatar })))

        console.log(`[v0] Added new ${newEmployee.category}`)
      } catch (error) {
        console.error("[v0] Error adding team member:", error)
        alert("Failed to add team member. Please try again.")
      }
    }

    setIsAddEmployeeModalOpen(false)
    setNewEmployee({
      name: "",
      role: "",
      department: "",
      email: "",
      phone: "",
      location: "",
      category: "",
    })
  }

  const handleEditPerson = (person: any, category: string) => {
    setEditingPerson({
      ...person,
      category,
      name: person.name || "",
      role: person.role || "",
      department: person.department || "",
      email: person.email || "",
      phone: person.phone || "",
      location: person.location || "",
      avatar: person.avatar || person.image || "",
    })
    setIsEditModalOpen(true)
  }

  const handleDeletePerson = (person: any, category: string) => {
    setDeletingPerson({ ...person, category })
    setIsDeleteDialogOpen(true)
  }

  const handleEditImage = (person: any, category: string) => {
    setEditingPersonImage({ ...person, category })
    setIsImageEditModalOpen(true)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }

      console.log("[v0] Uploading image file:", file.name, "Size:", file.size)
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        console.log("[v0] Image converted to base64, length:", imageData.length)
        setEditingPersonImage({
          ...editingPersonImage,
          image: imageData, // Store in 'image' field to match database
          avatar: imageData, // Also update avatar for immediate preview
        })
      }
      reader.onerror = (error) => {
        console.error("[v0] Error reading file:", error)
        alert("Failed to read image file. Please try again.")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveEdit = async () => {
    if (!editingPerson) return

    console.log("Saving edited person:", editingPerson)

    try {
      await updateTeamMember(editingPerson.id, editingPerson)

      // Reload team data from database
      const teamData = await getTeamMembers()
      setFounders(teamData.founders.map((f: any) => ({ ...f, avatar: f.image || f.avatar })))
      setAdvisors(teamData.advisors.map((a: any) => ({ ...a, avatar: a.image || a.avatar })))
      setConsultants(teamData.consultants.map((c: any) => ({ ...c, avatar: c.image || c.avatar })))

      setIsEditModalOpen(false)
      setEditingPerson(null)
    } catch (error) {
      console.error("[v0] Error updating team member:", error)
      alert("Failed to update team member. Please try again.")
    }
  }

  const handleConfirmDelete = async () => {
    if (!deletingPerson) return

    console.log("Deleting person:", deletingPerson)

    try {
      await deleteTeamMember(deletingPerson.id)

      // Reload team data from database
      const teamData = await getTeamMembers()
      setFounders(teamData.founders.map((f: any) => ({ ...f, avatar: f.image || f.avatar })))
      setAdvisors(teamData.advisors.map((a: any) => ({ ...a, avatar: a.image || a.avatar })))
      setConsultants(teamData.consultants.map((c: any) => ({ ...c, avatar: c.image || c.avatar })))

      setIsDeleteDialogOpen(false)
      setDeletingPerson(null)
    } catch (error) {
      console.error("[v0] Error deleting team member:", error)
      alert("Failed to delete team member. Please try again.")
    }
  }

  const handleSaveImage = async () => {
    if (!editingPersonImage) return

    console.log("[v0] Saving new image for:", editingPersonImage.name)
    console.log("[v0] Image data length:", editingPersonImage.image?.length || 0)

    if (!editingPersonImage.image) {
      alert("Please select an image first")
      return
    }

    try {
      await updateTeamMemberImage(editingPersonImage.id, editingPersonImage.image)
      console.log("[v0] Image saved successfully to database")

      // Reload team data from database
      const teamData = await getTeamMembers()
      console.log("[v0] Reloaded team data after image update")
      setFounders(teamData.founders.map((f: any) => ({ ...f, avatar: f.image || f.avatar })))
      setAdvisors(teamData.advisors.map((a: any) => ({ ...a, avatar: a.image || a.avatar })))
      setConsultants(teamData.consultants.map((c: any) => ({ ...c, avatar: c.image || c.avatar })))

      setIsImageEditModalOpen(false)
      setEditingPersonImage(null)
    } catch (error) {
      console.error("[v0] Error updating team member image:", error)
      alert("Failed to update team member image. Please try again.")
    }
  }

  const handleMessage = (person: any, category: string) => {
    setSelectedPerson(person)
    setSelectedMember(person)
    setIsMessageModalOpen(true)
  }

  const handleOutlookSelection = () => {
    if (!selectedPerson) return

    try {
      const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(selectedPerson.email)}`
      console.log("[v0] Opening Outlook URL:", outlookUrl)
      window.open(outlookUrl, "_blank")
    } catch (error) {
      console.error("[v0] Error opening Outlook:", error)
      try {
        const mailtoUrl = `mailto:${selectedPerson.email}`
        window.location.href = mailtoUrl
      } catch (fallbackError) {
        alert(`Failed to open email client for ${selectedPerson.email}`)
      }
    }

    setIsMessageModalOpen(false)
    setSelectedPerson(null)
  }

  const handleTeamsSelection = () => {
    if (!selectedPerson) return

    try {
      const teamsUrl = `https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(selectedPerson.email)}`
      console.log("[v0] Opening Teams URL:", teamsUrl)
      window.open(teamsUrl, "_blank")
    } catch (error) {
      console.error("[v0] Error opening Teams:", error)
      alert(`Failed to open Microsoft Teams for ${selectedPerson.email}`)
    }

    setIsMessageModalOpen(false)
    setSelectedPerson(null)
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
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
              <Button
                variant="ghost"
                className="gap-2 bg-primary/5 text-primary hover:bg-primary/10 h-10 px-4 font-medium"
              >
                <Users className="h-4 w-4" />
                Team
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
              <Link href="/projects" onClick={() => setShowMobileMenu(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-50 hover:text-primary h-12 px-4 font-medium"
                >
                  <FolderOpen className="h-4 w-4" />
                  Projects
                </Button>
              </Link>
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
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 bg-primary/5 text-primary hover:bg-primary/10 h-12 px-4 font-medium"
              >
                <Users className="h-4 w-4" />
                Team
              </Button>
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

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Team Management</h2>
              <p className="text-gray-600">Manage team members, departments, and organizational structure</p>
            </div>
            <AdminOnly>
              <Button onClick={() => setIsAddEmployeeModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
            </AdminOnly>
          </div>

          {/* Team Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Total Advisors</span>
                </div>
                <p className="text-2xl font-bold mt-1">{advisorsState.length}</p>
                <p className="text-xs text-muted-foreground">Strategic guidance</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Total Consultants</span>
                </div>
                <p className="text-2xl font-bold mt-1">{consultantsState.length}</p>
                <p className="text-xs text-muted-foreground">External expertise</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Locations</span>
                </div>
                <p className="text-2xl font-bold mt-1">{getDistinctLocationsCount()}</p>
                <p className="text-xs text-muted-foreground">Cities worldwide</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search person..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {getUniqueLocations().map((location) => (
                  <SelectItem key={location} value={location.toLowerCase().replace(/\s+/g, "-")}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="founders" className="w-full space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200">
              <TabsTrigger
                value="founders"
                className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm font-medium"
              >
                Founders
              </TabsTrigger>
              <TabsTrigger
                value="advisors"
                className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm font-medium"
              >
                Advisors
              </TabsTrigger>
              <TabsTrigger
                value="consultants"
                className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm font-medium"
              >
                Consultants
              </TabsTrigger>
            </TabsList>

            <TabsContent value="founders" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFounders.map((founder) => (
                  <Card key={founder.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={founder.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-lg">
                            {founder.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{founder.name}</CardTitle>
                          <CardDescription className="mb-2">{founder.role}</CardDescription>
                          <Badge className="bg-primary text-primary-foreground">Founder</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{founder.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        <Phone className="h-4 w-4" />
                        <span>{founder.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                        <MapPin className="h-4 w-4" />
                        <span>{founder.location}</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => handleMessage(founder, "founder")}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                        <AdminOnly>
                          <Button size="sm" variant="outline" onClick={() => handleEditImage(founder, "founder")}>
                            <Camera className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEditPerson(founder, "founder")}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeletePerson(founder, "founder")}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AdminOnly>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="advisors" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAdvisors.map((advisor) => (
                  <Card key={advisor.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={advisor.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-lg">
                            {advisor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{advisor.name}</CardTitle>
                          <CardDescription className="mb-2">{advisor.role}</CardDescription>
                          <Badge className="bg-red-500 text-white">Advisor</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-green-200 rounded-lg p-3 mb-3">
                        <h4 className="font-semibold text-sm text-gray-800 mb-1">Advisory Role</h4>
                        <p className="text-sm font-medium text-gray-700">{advisor.role}</p>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{advisor.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{advisor.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{advisor.location}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => handleMessage(advisor, "advisor")}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                        <AdminOnly>
                          <Button variant="outline" size="sm" onClick={() => handleEditImage(advisor, "advisor")}>
                            <Camera className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEditPerson(advisor, "advisor")}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeletePerson(advisor, "advisor")}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AdminOnly>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="consultants" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredConsultants.map((consultant) => (
                  <Card key={consultant.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={consultant.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-lg">
                            {consultant.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{consultant.name}</CardTitle>
                          <CardDescription className="mb-2">{consultant.role}</CardDescription>
                          <Badge className="bg-accent text-accent-foreground">Consultant</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-green-200 rounded-lg p-3 mb-3">
                        <h4 className="font-semibold text-sm text-gray-800 mb-1">Consulting Role</h4>
                        <p className="text-sm font-medium text-gray-700">{consultant.role}</p>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{consultant.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{consultant.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{consultant.location}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => handleMessage(consultant, "consultant")}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                        <AdminOnly>
                          <Button variant="outline" size="sm" onClick={() => handleEditImage(consultant, "consultant")}>
                            <Camera className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPerson(consultant, "consultant")}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePerson(consultant, "consultant")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AdminOnly>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Add Employee Modal */}
      <AdminOnly>
        <Dialog open={isAddEmployeeModalOpen} onOpenChange={setIsAddEmployeeModalOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Team Member</DialogTitle>
              <DialogDescription>
                Add a new team member to the organization. Fill in their details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newEmployee.category}
                  onValueChange={(value) => setNewEmployee({ ...newEmployee, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="founder">Founder</SelectItem>
                    <SelectItem value="advisor">Advisor</SelectItem>
                    <SelectItem value="consultant">Consultant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role/Title</Label>
                  <Input
                    id="role"
                    value={newEmployee.role}
                    onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                    placeholder="Strategic Advisor - Marketing"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                    placeholder="Advisory Board, Executive, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    placeholder="john.doe@company.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newEmployee.location}
                    onChange={(e) => setNewEmployee({ ...newEmployee, location: e.target.value })}
                    placeholder="New York, NY"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddEmployeeModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEmployee}>Add Team Member</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AdminOnly>

      {/* Edit Person Modal */}
      <AdminOnly>
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Team Member</DialogTitle>
              <DialogDescription>Update the team member's information below.</DialogDescription>
            </DialogHeader>
            {editingPerson && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input
                      id="edit-name"
                      value={editingPerson.name || ""} // Added fallback to prevent uncontrolled input
                      onChange={(e) => setEditingPerson({ ...editingPerson, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-role">Role/Title</Label>
                    <Input
                      id="edit-role"
                      value={editingPerson.role || ""} // Added fallback
                      onChange={(e) => setEditingPerson({ ...editingPerson, role: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-department">Department</Label>
                    <Input
                      id="edit-department"
                      value={editingPerson.department || ""} // Added fallback
                      onChange={(e) => setEditingPerson({ ...editingPerson, department: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email Address</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editingPerson.email || ""} // Added fallback
                      onChange={(e) => setEditingPerson({ ...editingPerson, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">Phone Number</Label>
                    <Input
                      id="edit-phone"
                      value={editingPerson.phone || ""} // Added fallback
                      onChange={(e) => setEditingPerson({ ...editingPerson, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-location">Location</Label>
                    <Input
                      id="edit-location"
                      value={editingPerson.location || ""} // Added fallback to ensure location is saved
                      onChange={(e) => setEditingPerson({ ...editingPerson, location: e.target.value })}
                    />
                  </div>
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
      </AdminOnly>

      {/* Delete Confirmation Dialog */}
      <AdminOnly>
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Team Member</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {deletingPerson?.name}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </AdminOnly>

      {/* Image Edit Modal */}
      <AdminOnly>
        <Dialog open={isImageEditModalOpen} onOpenChange={setIsImageEditModalOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Edit Profile Photo
              </DialogTitle>
              <DialogDescription>Update the profile photo for {editingPersonImage?.name}</DialogDescription>
            </DialogHeader>
            {editingPersonImage && (
              <div className="space-y-4 py-4">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={editingPersonImage.image || editingPersonImage.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-2xl">
                      {editingPersonImage.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-2">
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                        <Upload className="h-4 w-4" />
                        Choose New Photo
                      </div>
                    </Label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      Supported formats: JPG, PNG, GIF (max 5MB)
                    </p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsImageEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveImage}>Save Photo</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AdminOnly>

      <Dialog open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Contact {selectedPerson?.name}
            </DialogTitle>
            <DialogDescription>Choose how you'd like to communicate with {selectedPerson?.name}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4">
            <Button
              onClick={handleOutlookSelection}
              className="flex items-center gap-3 h-12 justify-start bg-transparent"
              variant="outline"
            >
              <Mail className="h-5 w-5 text-blue-600" />
              <div className="text-left">
                <div className="font-medium">Send Email via Outlook</div>
                <div className="text-sm text-muted-foreground">{selectedPerson?.email}</div>
              </div>
            </Button>
            <Button
              onClick={handleTeamsSelection}
              className="flex items-center gap-3 h-12 justify-start bg-transparent"
              variant="outline"
            >
              <MessageSquare className="h-5 w-5 text-purple-600" />
              <div className="text-left">
                <div className="font-medium">Chat via Microsoft Teams</div>
                <div className="text-sm text-muted-foreground">Start a conversation</div>
              </div>
            </Button>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsMessageModalOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
