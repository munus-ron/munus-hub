"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  TrendingUp,
  FolderOpen,
  Bell,
  MessageSquare,
  Building,
  Menu,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Camera,
  Upload,
  MessageCircle,
  Pencil,
  Settings,
} from "lucide-react"
import Link from "next/link"
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
import { useState } from "react"
import { AdminOnly } from "@/components/admin-only"
import { useAuth } from "@/contexts/auth-context"
import { loadTeamDataFromStorage, saveTeamDataToStorage } from "@/lib/utils"

interface TeamMember {
  id: number
  name: string
  role: string
  department: string
  email: string
  phone: string
  location: string
  avatar: string
  equity?: string
  foundedDate?: string
  joinDate?: string
  contractStart?: string
  contractEnd?: string
}

const departments = [
  {
    name: "Executive",
    color: "bg-primary text-primary-foreground",
    count: 3,
    head: "Sarah Miller",
  },
  {
    name: "Marketing",
    color: "bg-secondary text-secondary-foreground",
    count: 8,
    head: "Jennifer Lee",
  },
  {
    name: "Development",
    color: "bg-accent text-accent-foreground",
    count: 12,
    head: "Alex Johnson",
  },
  {
    name: "Design",
    color: "bg-chart-1 text-white",
    count: 6,
    head: "John Doe",
  },
  {
    name: "Customer Success",
    color: "bg-chart-4 text-white",
    count: 9,
    head: "Lisa Wang",
  },
  {
    name: "HR & Operations",
    color: "bg-chart-3 text-white",
    count: 5,
    head: "Robert Johnson",
  },
  {
    name: "Data Science",
    color: "bg-chart-2 text-white",
    count: 4,
    head: "Kevin Park",
  },
  {
    name: "IT Security",
    color: "bg-destructive text-destructive-foreground",
    count: 3,
    head: "Michael Davis",
  },
]

const employees = [
  {
    id: 1,
    name: "Sarah Miller",
    role: "Chief Executive Officer",
    department: "Executive",
    email: "sarah.miller@company.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    avatar: "/ceo-headshot.png",
    startDate: "2019-01-15",
    status: "active",
    skills: ["Leadership", "Strategy", "Business Development"],
    reportsTo: null,
    directReports: 8,
  },
  {
    id: 2,
    name: "John Doe",
    role: "Senior UI/UX Designer",
    department: "Design",
    email: "john.doe@company.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    avatar: "/team-john.png",
    startDate: "2021-03-10",
    status: "active",
    skills: ["UI Design", "UX Research", "Prototyping", "Figma"],
    reportsTo: "Jennifer Lee",
    directReports: 2,
  },
  {
    id: 3,
    name: "Mike Chen",
    role: "Frontend Developer",
    department: "Development",
    email: "mike.chen@company.com",
    phone: "+1 (555) 345-6789",
    location: "Austin, TX",
    avatar: "/team-mike.png",
    startDate: "2020-07-22",
    status: "active",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    reportsTo: "Alex Johnson",
    directReports: 0,
  },
  {
    id: 4,
    name: "Jennifer Lee",
    role: "Marketing Director",
    department: "Marketing",
    email: "jennifer.lee@company.com",
    phone: "+1 (555) 456-7890",
    location: "Los Angeles, CA",
    avatar: "/team-member-1.png",
    startDate: "2020-02-14",
    status: "active",
    skills: ["Digital Marketing", "Content Strategy", "SEO", "Analytics"],
    reportsTo: "Sarah Miller",
    directReports: 7,
  },
  {
    id: 5,
    name: "Alex Johnson",
    role: "Head of Engineering",
    department: "Development",
    email: "alex.johnson@company.com",
    phone: "+1 (555) 567-8901",
    location: "Seattle, WA",
    avatar: "/team-member-2.png",
    startDate: "2019-08-05",
    status: "active",
    skills: ["Full Stack Development", "System Architecture", "Team Leadership"],
    reportsTo: "Sarah Miller",
    directReports: 11,
  },
  {
    id: 6,
    name: "Lisa Wang",
    role: "Customer Success Manager",
    department: "Customer Success",
    email: "lisa.wang@company.com",
    phone: "+1 (555) 678-9012",
    location: "Chicago, IL",
    avatar: "/team-member-3.png",
    startDate: "2021-11-08",
    status: "active",
    skills: ["Customer Relations", "Account Management", "Data Analysis"],
    reportsTo: "Sarah Miller",
    directReports: 8,
  },
  {
    id: 7,
    name: "Robert Johnson",
    role: "HR Director",
    department: "HR & Operations",
    email: "robert.johnson@company.com",
    phone: "+1 (555) 789-0123",
    location: "New York, NY",
    avatar: "/placeholder-wb2g6.png",
    startDate: "2018-05-20",
    status: "active",
    skills: ["Human Resources", "Recruitment", "Employee Relations"],
    reportsTo: "Sarah Miller",
    directReports: 4,
  },
  {
    id: 8,
    name: "Kevin Park",
    role: "Data Science Lead",
    department: "Data Science",
    email: "kevin.park@company.com",
    phone: "+1 (555) 890-1234",
    location: "Boston, MA",
    avatar: "/professional-headshot.png",
    startDate: "2020-09-12",
    status: "active",
    skills: ["Machine Learning", "Python", "SQL", "Data Visualization"],
    reportsTo: "Sarah Miller",
    directReports: 3,
  },
]

const founders = [
  {
    id: 1,
    name: "David Chen",
    role: "Co-Founder & Chairman",
    department: "Executive",
    email: "david.chen@company.com",
    phone: "+1 (555) 111-2222",
    location: "San Francisco, CA",
    avatar: "/professional-headshot.png",
    equity: "35%",
    skills: ["Entrepreneurship", "Product Vision", "Fundraising", "Strategic Planning"],
  },
  {
    id: 2,
    name: "Maria Rodriguez",
    role: "Co-Founder & CTO",
    department: "Technology",
    email: "maria.rodriguez@company.com",
    phone: "+1 (555) 333-4444",
    location: "Austin, TX",
    avatar: "/team-member-1.png",
    equity: "30%",
    skills: ["Software Architecture", "AI/ML", "Team Building", "Innovation"],
  },
  {
    id: 3,
    name: "James Wilson",
    role: "Co-Founder & COO",
    department: "Operations",
    email: "james.wilson@company.com",
    phone: "+1 (555) 555-6666",
    location: "New York, NY",
    avatar: "/team-member-2.png",
    equity: "25%",
    skills: ["Operations", "Business Development", "Finance", "Scaling"],
  },
]

const advisors = [
  {
    id: 1,
    name: "Dr. Patricia Kim",
    role: "Strategic Advisor - Go-to-Market Strategy",
    department: "Advisory Board",
    email: "patricia.kim@advisor.com",
    phone: "+1 (555) 777-8888",
    location: "Boston, MA",
    avatar: "/team-member-3.png",
  },
  {
    id: 2,
    name: "Robert Thompson",
    role: "Technology Advisor - AI & Machine Learning",
    department: "Advisory Board",
    email: "robert.thompson@advisor.com",
    phone: "+1 (555) 999-0000",
    location: "Seattle, WA",
    avatar: "/team-john.png",
  },
  {
    id: 3,
    name: "Lisa Chang",
    role: "Financial Advisor - Finance & Investment",
    department: "Advisory Board",
    email: "lisa.chang@advisor.com",
    phone: "+1 (555) 222-3333",
    location: "San Francisco, CA",
    avatar: "/placeholder-wb2g6.png",
  },
]

const consultants = [
  {
    id: 1,
    name: "Michael Foster",
    role: "Management Consultant - Organizational Development",
    department: "External Consulting",
    email: "michael.foster@consulting.com",
    phone: "+1 (555) 444-5555",
    location: "Chicago, IL",
    avatar: "/team-mike.png",
  },
  {
    id: 2,
    name: "Jennifer Park",
    role: "Marketing Consultant - Digital Marketing Strategy",
    department: "External Consulting",
    email: "jennifer.park@consulting.com",
    phone: "+1 (555) 666-7777",
    location: "Los Angeles, CA",
    avatar: "/ceo-headshot.png",
  },
  {
    id: 3,
    name: "Alex Kumar",
    role: "Technology Consultant - Cloud Migration & DevOps",
    department: "External Consulting",
    email: "alex.kumar@consulting.com",
    phone: "+1 (555) 888-9999",
    location: "Austin, TX",
    avatar: "/professional-headshot.png",
  },
]

function getDepartmentColor(department: string) {
  const dept = departments.find((d) => d.name === department)
  return dept?.color || "bg-muted text-muted-foreground"
}

function formatStartDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const years = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 365))
  return `${years} year${years !== 1 ? "s" : ""}`
}

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState("founders")
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
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

  const [foundersState, setFounders] = useState(() => {
    const data = loadTeamDataFromStorage()
    return data.founders?.founders || []
  })
  const [advisorsState, setAdvisors] = useState(() => {
    const data = loadTeamDataFromStorage()
    return data.founders?.advisors || []
  })
  const [consultantsState, setConsultants] = useState(() => {
    const data = loadTeamDataFromStorage()
    return data.founders?.consultants || []
  })

  const getDistinctLocationsCount = () => {
    const allLocations = [
      ...foundersState.map((person: TeamMember) => person.location),
      ...advisorsState.map((person: TeamMember) => person.location),
      ...consultantsState.map((person: TeamMember) => person.location),
    ]

    const uniqueLocations = new Set(allLocations)
    return uniqueLocations.size
  }

  const filteredFounders = foundersState.filter((person: TeamMember) => {
    const matchesSearch =
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLocation =
      selectedLocation === "all" || person.location.toLowerCase().includes(selectedLocation.replace("-", " "))

    return matchesSearch && matchesLocation
  })

  const filteredAdvisors = advisorsState.filter((person: TeamMember) => {
    const matchesSearch =
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLocation =
      selectedLocation === "all" || person.location.toLowerCase().includes(selectedLocation.replace("-", " "))

    return matchesSearch && matchesLocation
  })

  const filteredConsultants = consultantsState.filter((person: TeamMember) => {
    const matchesSearch =
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLocation =
      selectedLocation === "all" || person.location.toLowerCase().includes(selectedLocation.replace("-", " "))

    return matchesSearch && matchesLocation
  })

  const handleAddEmployee = () => {
    // console.log("Adding new team member:", newEmployee)

    if (newEmployee.name && newEmployee.category && newEmployee.email) {
      const newMember = {
        id: Date.now(), // Generate unique ID
        name: newEmployee.name,
        role: newEmployee.role,
        department: newEmployee.department,
        email: newEmployee.email,
        phone: newEmployee.phone,
        location: newEmployee.location,
        avatar: "/placeholder.svg", // Default avatar
      }

      // Add to appropriate array based on category
      if (newEmployee.category === "founder") {
        setFounders([...foundersState, { ...newMember, equity: "0%" }])
      } else if (newEmployee.category === "advisor") {
        setAdvisors([...advisorsState, newMember])
      } else if (newEmployee.category === "consultant") {
        setConsultants([...consultantsState, newMember])
      }

      // Save to localStorage for persistence
      const updatedFounders = newEmployee.category === "founder" ? [...foundersState, { ...newMember, equity: "0%" }] : foundersState
      const updatedAdvisors = newEmployee.category === "advisor" ? [...advisorsState, newMember] : advisorsState
      const updatedConsultants = newEmployee.category === "consultant" ? [...consultantsState, newMember] : consultantsState
      saveTeamDataToStorage(updatedFounders, updatedAdvisors, updatedConsultants)

      // console.log(`[v0] Added new ${newEmployee.category}:`, newMember)
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
    setEditingPerson({ ...person, category })
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
      const reader = new FileReader()
      reader.onload = (e) => {
        setEditingPersonImage({
          ...editingPersonImage,
          avatar: e.target?.result as string,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveEdit = () => {
    if (!editingPerson) return

    // console.log("Saving edited person:", editingPerson)

    if (editingPerson.category === "founder") {
      const updatedFounders = foundersState.map((founder: TeamMember) =>
        founder.id === editingPerson.id ? { ...founder, ...editingPerson } : founder,
      )
      setFounders(updatedFounders)
      saveTeamDataToStorage(updatedFounders, advisorsState, consultantsState)
    } else if (editingPerson.category === "advisor") {
      const updatedAdvisors = advisorsState.map((advisor: TeamMember) =>
        advisor.id === editingPerson.id ? { ...advisor, ...editingPerson } : advisor,
      )
      setAdvisors(updatedAdvisors)
      saveTeamDataToStorage(foundersState, updatedAdvisors, consultantsState)
    } else if (editingPerson.category === "consultant") {
      const updatedConsultants = consultantsState.map((consultant: TeamMember) =>
        consultant.id === editingPerson.id ? { ...consultant, ...editingPerson } : consultant,
      )
      setConsultants(updatedConsultants)
      saveTeamDataToStorage(foundersState, advisorsState, updatedConsultants)
    }

    setIsEditModalOpen(false)
    setEditingPerson(null)
  }

  const handleConfirmDelete = () => {
    if (!deletingPerson) return

    // console.log("Deleting person:", deletingPerson)

    // Remove from the appropriate array based on category
    if (deletingPerson.category === "founder") {
      const updatedFounders = foundersState.filter((founder: TeamMember) => founder.id !== deletingPerson.id)
      setFounders(updatedFounders)
      saveTeamDataToStorage(updatedFounders, advisorsState, consultantsState)
    } else if (deletingPerson.category === "advisor") {
      const updatedAdvisors = advisorsState.filter((advisor: TeamMember) => advisor.id !== deletingPerson.id)
      setAdvisors(updatedAdvisors)
      saveTeamDataToStorage(foundersState, updatedAdvisors, consultantsState)
    } else if (deletingPerson.category === "consultant") {
      const updatedConsultants = consultantsState.filter((consultant: TeamMember) => consultant.id !== deletingPerson.id)
      setConsultants(updatedConsultants)
      saveTeamDataToStorage(foundersState, advisorsState, updatedConsultants)
    }

    setIsDeleteDialogOpen(false)
    setDeletingPerson(null)
  }

  const handleSaveImage = () => {
    if (!editingPersonImage) return

    // console.log("Saving new image for:", editingPersonImage)

    // Update the avatar in the appropriate array based on category
    if (editingPersonImage.category === "founder") {
      const updatedFounders = foundersState.map((founder: TeamMember) =>
        founder.id === editingPersonImage.id ? { ...founder, avatar: editingPersonImage.avatar } : founder,
      )
      setFounders(updatedFounders)
      saveTeamDataToStorage(updatedFounders, advisorsState, consultantsState)
    } else if (editingPersonImage.category === "advisor") {
      const updatedAdvisors = advisorsState.map((advisor: TeamMember) =>
        advisor.id === editingPersonImage.id ? { ...advisor, avatar: editingPersonImage.avatar } : advisor,
      )
      setAdvisors(updatedAdvisors)
      saveTeamDataToStorage(foundersState, updatedAdvisors, consultantsState)
    } else if (editingPersonImage.category === "consultant") {
      const updatedConsultants = consultantsState.map((consultant: TeamMember) =>
        consultant.id === editingPersonImage.id ? { ...consultant, avatar: editingPersonImage.avatar } : consultant,
      )
      setConsultants(updatedConsultants)
      saveTeamDataToStorage(foundersState, advisorsState, updatedConsultants)
    }

    setIsImageEditModalOpen(false)
    setEditingPersonImage(null)
  }

  const handleMessage = (person: any, category: string) => {
    // console.log("[v0] Message button clicked for:", person.name, "Email:", person.email, "Category:", category)

    if (!person.email) {
      alert(`No email address found for ${person.name}`)
      return
    }

    setSelectedPerson(person)
    setIsMessageModalOpen(true)
  }

  const handleOutlookSelection = () => {
    if (!selectedPerson) return

    try {
      const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(selectedPerson.email)}`
      // console.log("[v0] Opening Outlook URL:", outlookUrl)
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
      // console.log("[v0] Opening Teams URL:", teamsUrl)
      window.open(teamsUrl, "_blank")
    } catch (error) {
      console.error("[v0] Error opening Teams:", error)
      alert(`Failed to open Microsoft Teams for ${selectedPerson.email}`)
    }

    setIsMessageModalOpen(false)
    setSelectedPerson(null)
  }

  return (
    <div className="min-h-screen bg-green-100">
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
                <SelectItem value="new-york">New York</SelectItem>
                <SelectItem value="san-francisco">San Francisco</SelectItem>
                <SelectItem value="austin">Austin</SelectItem>
                <SelectItem value="seattle">Seattle</SelectItem>
                <SelectItem value="chicago">Chicago</SelectItem>
                <SelectItem value="boston">Boston</SelectItem>
                <SelectItem value="los-angeles">Los Angeles</SelectItem>
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
                {filteredFounders.map((founder: TeamMember) => (
                  <Card key={founder.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={founder.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-lg">
                            {founder.name
                              .split(" ")
                              .map((n: string) => n[0])
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
                      <AdminOnly>
                        <div className="flex justify-center space-x-2 pt-2 border-t border-gray-200">
                          <Button size="sm" variant="outline" onClick={() => handleMessage(founder, "founder")}>
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEditImage(founder, "founder")}>
                            <Camera className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEditPerson(founder, "founder")}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDeletePerson(founder, "founder")}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </AdminOnly>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="advisors" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAdvisors.map((advisor: TeamMember) => (
                  <Card key={advisor.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={advisor.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-lg">
                            {advisor.name
                              .split(" ")
                              .map((n: string) => n[0])
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
                {filteredConsultants.map((consultant: TeamMember) => (
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
                      value={editingPerson.name}
                      onChange={(e) => setEditingPerson({ ...editingPerson, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-role">Role/Title</Label>
                    <Input
                      id="edit-role"
                      value={editingPerson.role}
                      onChange={(e) => setEditingPerson({ ...editingPerson, role: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-department">Department</Label>
                    <Input
                      id="edit-department"
                      value={editingPerson.department}
                      onChange={(e) => setEditingPerson({ ...editingPerson, department: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email Address</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editingPerson.email}
                      onChange={(e) => setEditingPerson({ ...editingPerson, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">Phone Number</Label>
                    <Input
                      id="edit-phone"
                      value={editingPerson.phone}
                      onChange={(e) => setEditingPerson({ ...editingPerson, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-location">Location</Label>
                    <Input
                      id="edit-location"
                      value={editingPerson.location}
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
                    <AvatarImage src={editingPersonImage.avatar || "/placeholder.svg"} />
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
