"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar, Users, Bell, FolderOpen, Clock, TrendingUp, Menu, LogOut, Settings } from "lucide-react"
import { LoginModal } from "@/components/login-modal"
import { AdminOnly } from "@/components/admin-only"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { loadTeamDataFromStorage } from "@/lib/utils"

export default function Dashboard() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showManageUsersModal, setShowManageUsersModal] = useState(false)
  const [showUserForm, setShowUserForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
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

  const [recentAnnouncements, setRecentAnnouncements] = useState([])
  const [recentProjects, setRecentProjects] = useState([])
  const [dashboardStats, setDashboardStats] = useState({
    activeProjects: 0,
    teamMembers: 0,
    upcomingEvents: 0,
    pendingTasks: 0,
  })

  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)

  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const loadAnnouncements = () => {
      try {
        const stored = localStorage.getItem("announcements")
        if (stored) {
          const announcements = JSON.parse(stored)
          const sortedAnnouncements = announcements.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 2)
          setRecentAnnouncements(sortedAnnouncements)
        } else {
          setRecentAnnouncements([
            {
              id: 1,
              title: "New Office Opening",
              content: "We're excited to announce our new branch office in Austin, Texas...",
              author: "Sarah Miller",
              date: new Date().toISOString(),
              avatar: "/ceo-headshot.png",
            },
            {
              id: 2,
              title: "Holiday Schedule Update",
              content: "Please note the updated holiday schedule for the remainder of the year...",
              author: "Robert Johnson",
              date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
              avatar: "/placeholder-wb2g6.png",
            },
          ])
        }
      } catch (error) {
        console.error("Error loading announcements:", error)
      }
    }

    loadAnnouncements()

    const handleStorageChange = (e) => {
      if (e.key === "announcements") {
        loadAnnouncements()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    const handleAnnouncementUpdate = () => {
      loadAnnouncements()
    }

    window.addEventListener("announcementUpdate", handleAnnouncementUpdate)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("announcementUpdate", handleAnnouncementUpdate)
    }
  }, [])

  useEffect(() => {
    const loadRecentProjects = () => {
      try {
        const staticProjects = [
          { id: 1, title: "Website Redesign", status: "In Progress", department: "Marketing Team" },
          { id: 2, title: "Mobile App Launch", status: "Active", department: "Development Team" },
          { id: 3, title: "Q4 Planning Initiative", status: "Planning", department: "Strategy Team" },
          { id: 4, title: "Customer Support Portal", status: "In Progress", department: "Support Team" },
          { id: 5, title: "Data Analytics Dashboard", status: "Active", department: "Analytics Team" },
          { id: 6, title: "Security Audit & Compliance", status: "Planning", department: "Security Team" },
        ]

        let projects = [...staticProjects]

        staticProjects.forEach((project) => {
          const storedProject = localStorage.getItem(`project_${project.id}`)
          if (storedProject) {
            try {
              const updatedProject = JSON.parse(storedProject)
              const projectIndex = projects.findIndex((p) => p.id === project.id)
              if (projectIndex !== -1) {
                projects[projectIndex] = {
                  ...projects[projectIndex],
                  title: updatedProject.title || project.title,
                  status: updatedProject.status || project.status,
                  progress: updatedProject.progress,
                  description: updatedProject.description,
                }
              }
            } catch (error) {
              console.error(`Error parsing project ${project.id}:`, error)
            }
          }
        })

        projects = projects.filter((project) => {
          const deletionMarker = localStorage.getItem(`project_${project.id}_deleted`)
          return !deletionMarker
        })

        const sortedProjects = projects.slice(0, 3)
        setRecentProjects(sortedProjects)
      } catch (error) {
        console.error("Error loading recent projects:", error)
        setRecentProjects([
          { id: 1, title: "Website Redesign", status: "In Progress", department: "Marketing Team" },
          { id: 2, title: "Mobile App Launch", status: "Active", department: "Development Team" },
          { id: 3, title: "Q4 Planning Initiative", status: "Planning", department: "Strategy Team" },
        ])
      }
    }

    loadRecentProjects()

    const handleStorageChange = (e) => {
      if (e.key?.startsWith("project_") && !e.key?.endsWith("_timeline") && !e.key?.endsWith("_team")) {
        loadRecentProjects()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  useEffect(() => {
    const calculateStats = () => {
      try {
        const storedProjects = localStorage.getItem("projects")
        let activeProjectsCount = 0
        if (storedProjects) {
          const projects = JSON.parse(storedProjects)
          activeProjectsCount = projects.filter(
            (project) => project.status && project.status !== "Complete" && project.status !== "Completed",
          ).length
        } else {
          const staticProjects = [
            { id: 1, title: "Website Redesign", status: "In Progress" },
            { id: 2, title: "Mobile App Launch", status: "Active" },
            { id: 3, title: "Q4 Planning Initiative", status: "Planning" },
            { id: 4, title: "Customer Support Portal", status: "In Progress" },
            { id: 5, title: "Data Analytics Dashboard", status: "Active" },
            { id: 6, title: "Security Audit & Compliance", status: "Planning" },
          ]
          activeProjectsCount = staticProjects.filter(
            (project) => project.status !== "Complete" && project.status !== "Completed",
          ).length
        }

        const teamData = loadTeamDataFromStorage()
        const totalTeamMembers = teamData.founders.length + teamData.advisors.length + teamData.consultants.length

        const now = new Date()
        now.setHours(0, 0, 0, 0)

        const storedEvents = localStorage.getItem("calendar_events")
        let upcomingEventsCount = 0
        if (storedEvents) {
          const events = JSON.parse(storedEvents)
          upcomingEventsCount = events.filter((event) => {
            const eventDate = new Date(event.date || event.start)
            eventDate.setHours(0, 0, 0, 0)
            return eventDate >= now
          }).length
        } else {
          upcomingEventsCount = 3
        }

        let pendingTasksCount = 0
        if (storedProjects) {
          const projects = JSON.parse(storedProjects)
          projects.forEach((project) => {
            const projectTimeline = localStorage.getItem(`project_${project.id}_timeline`)
            if (projectTimeline) {
              const milestones = JSON.parse(projectTimeline)
              milestones.forEach((milestone) => {
                if (milestone.dueDate || milestone.endDate) {
                  const dueDate = new Date(milestone.dueDate || milestone.endDate)
                  if (
                    dueDate >= now &&
                    dueDate <= now &&
                    milestone.status !== "completed" &&
                    milestone.status !== "done"
                  ) {
                    pendingTasksCount++
                  }
                }
              })
            }
          })
        } else {
          pendingTasksCount = 8
        }

        setDashboardStats({
          activeProjects: activeProjectsCount,
          teamMembers: totalTeamMembers,
          upcomingEvents: upcomingEventsCount,
          pendingTasks: pendingTasksCount,
        })
      } catch (error) {
        console.error("Error calculating dashboard stats:", error)
        setDashboardStats({
          activeProjects: 6,
          teamMembers: 15,
          upcomingEvents: 3,
          pendingTasks: 8,
        })
      }
    }

    calculateStats()

    const handleStorageChange = (e) => {
      if (
        e.key === "projects" ||
        e.key === "team_founders" ||
        e.key === "team_advisors" ||
        e.key === "team_consultants" ||
        e.key === "calendar_events" ||
        (e.key?.startsWith("project_") && e.key?.endsWith("_timeline"))
      ) {
        calculateStats()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  useEffect(() => {
    const generateNotifications = () => {
      const notificationsList = []
      const now = new Date()

      try {
        const storedAnnouncements = localStorage.getItem("announcements")
        if (storedAnnouncements) {
          const announcements = JSON.parse(storedAnnouncements)
          const recentAnnouncements = announcements.filter((announcement) => {
            const announcementDate = new Date(announcement.date)
            const daysDiff = (now - announcementDate) / (1000 * 60 * 60 * 24)
            return daysDiff <= 7
          })

          recentAnnouncements.forEach((announcement) => {
            notificationsList.push({
              id: `announcement-${announcement.id}`,
              type: "announcement",
              title: "New Announcement",
              message: announcement.title,
              time: announcement.date,
              icon: "bell",
              link: `/announcements?highlight=${announcement.id}`,
            })
          })
        }

        const storedEvents = localStorage.getItem("calendar_events")
        if (storedEvents) {
          const events = JSON.parse(storedEvents)
          const upcomingEvents = events.filter((event) => {
            const eventDate = new Date(event.date || event.start)
            const daysDiff = (eventDate - now) / (1000 * 60 * 60 * 24)
            return daysDiff >= 0 && daysDiff <= 7
          })

          upcomingEvents.forEach((event) => {
            notificationsList.push({
              id: `event-${event.id}`,
              type: "event",
              title: "Upcoming Event",
              message: event.title,
              time: event.date || event.start,
              icon: "calendar",
              link: "/calendar",
            })
          })
        }

        const storedProjects = localStorage.getItem("projects")
        if (storedProjects) {
          const projects = JSON.parse(storedProjects)
          projects.forEach((project) => {
            const projectTimeline = localStorage.getItem(`project_${project.id}_timeline`)
            if (projectTimeline) {
              const milestones = JSON.parse(projectTimeline)
              milestones.forEach((milestone) => {
                if (milestone.dueDate || milestone.endDate) {
                  const dueDate = new Date(milestone.dueDate || milestone.endDate)
                  const daysDiff = (dueDate - now) / (1000 * 60 * 60 * 24)
                  if (daysDiff >= 0 && daysDiff <= 7 && milestone.status !== "completed") {
                    notificationsList.push({
                      id: `milestone-${project.id}-${milestone.name}`,
                      type: "milestone",
                      title: "Milestone Due Soon",
                      message: `${milestone.name} in ${project.title}`,
                      time: milestone.dueDate || milestone.endDate,
                      icon: "clock",
                      link: `/projects/${project.id}`,
                    })
                  }
                }
              })
            }
          })
        }

        notificationsList.sort((a, b) => new Date(b.time) - new Date(a.time))

        const limitedNotifications = notificationsList.slice(0, 10)

        setNotifications(limitedNotifications)
        setUnreadCount(limitedNotifications.length)
      } catch (error) {
        console.error("Error generating notifications:", error)
        setNotifications([])
        setUnreadCount(0)
      }
    }

    generateNotifications()

    const handleStorageChange = (e) => {
      if (
        e.key === "announcements" ||
        e.key === "calendar_events" ||
        e.key === "projects" ||
        (e.key?.startsWith("project_") && e.key?.endsWith("_timeline"))
      ) {
        generateNotifications()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("announcementUpdate", generateNotifications)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("announcementUpdate", generateNotifications)
    }
  }, [])

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
      password: "",
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

  const getRelativeTime = (dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`

    return date.toLocaleDateString()
  }

  const getNotificationTime = (dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`

    return date.toLocaleDateString()
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "announcement":
        return <Bell className="h-4 w-4 text-blue-500" />
      case "event":
        return <Calendar className="h-4 w-4 text-green-500" />
      case "milestone":
        return <Clock className="h-4 w-4 text-orange-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const handleNotificationClick = (notification) => {
    setShowNotifications(false)
    router.push(notification.link)
  }

  const markAllAsRead = () => {
    setUnreadCount(0)
    setShowNotifications(false)
  }

  const handleAnnouncementClick = (announcementId) => {
    router.push(`/announcements?highlight=${announcementId}`)
  }

  const handleProjectClickById = (projectId) => {
    router.push(`/projects/${projectId}`)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-chart-3 text-white"
      case "Active":
        return "bg-primary text-white"
      case "Planning":
        return "border-gray-300 text-gray-700"
      case "Complete":
      case "Completed":
        return "bg-green-500 text-white"
      default:
        return "border-gray-300 text-gray-700"
    }
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
        <div className="flex h-20 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <img src="/munus-logo.jpg" alt="Munus Logo" className="h-8 w-auto" />
                <span className="text-2xl md:text-3xl font-bold text-gray-900 font-serif">Munus Hub</span>
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
                <Link href="/admin">
                  <Button
                    variant="ghost"
                    className="gap-2 text-gray-700 hover:bg-gray-50 hover:text-primary h-10 px-4 font-medium"
                  >
                    <Settings className="h-4 w-4" />
                    Admin
                  </Button>
                </Link>
              </AdminOnly>
            </nav>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-600 hover:text-primary"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <Popover open={showNotifications} onOpenChange={setShowNotifications}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs text-primary">
                        Mark all read
                      </Button>
                    )}
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{notification.title}</p>
                            <p className="text-sm text-gray-600 truncate">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{getNotificationTime(notification.time)}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No notifications</p>
                    </div>
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="p-3 border-t">
                    <Link href="/announcements">
                      <Button variant="ghost" size="sm" className="w-full text-xs text-primary">
                        View all announcements
                      </Button>
                    </Link>
                  </div>
                )}
              </PopoverContent>
            </Popover>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 md:h-10 md:w-10">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user?.name?.split(" ")[0]}!</p>
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
            <nav className="px-4 py-4 space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 bg-primary text-white hover:bg-primary/90 h-12 px-4 font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                <TrendingUp className="h-5 w-5" />
                Dashboard
              </Button>
              <Link href="/projects" onClick={() => setShowMobileMenu(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-50 hover:text-primary h-12 px-4 font-medium"
                >
                  <FolderOpen className="h-5 w-5" />
                  Projects
                </Button>
              </Link>
              <Link href="/calendar" onClick={() => setShowMobileMenu(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-50 hover:text-primary h-12 px-4 font-medium"
                >
                  <Calendar className="h-5 w-5" />
                  Calendar
                </Button>
              </Link>
              <Link href="/announcements" onClick={() => setShowMobileMenu(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-50 hover:text-primary h-12 px-4 font-medium"
                >
                  <Bell className="h-5 w-5" />
                  Announcements
                </Button>
              </Link>
              <Link href="/team" onClick={() => setShowMobileMenu(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-50 hover:text-primary h-12 px-4 font-medium"
                >
                  <Users className="h-5 w-5" />
                  Team
                </Button>
              </Link>
              <AdminOnly>
                <Link href="/admin" onClick={() => setShowMobileMenu(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-50 hover:text-primary h-12 px-4 font-medium"
                  >
                    <Settings className="h-5 w-5" />
                    Admin
                  </Button>
                </Link>
              </AdminOnly>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
          {/* Welcome Section */}
          <div className="mb-8 md:mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">
              Welcome back, {user?.name?.split(" ")[0]}!
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6 md:mb-8">
              Our Munus Hub brings together all your essential tools and information in one centralized location, making
              collaboration seamless and productivity effortless.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-12 md:mb-16">
            <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-base sm:text-sm font-semibold text-gray-700">Active Projects</CardTitle>
                <FolderOpen className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl sm:text-2xl font-bold text-gray-900 mb-1">{dashboardStats.activeProjects}</div>
                <p className="text-sm sm:text-xs text-gray-500">Not completed</p>
              </CardContent>
            </Card>
            <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-base sm:text-sm font-semibold text-gray-700">Team Members</CardTitle>
                <Users className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl sm:text-2xl font-bold text-gray-900 mb-1">{dashboardStats.teamMembers}</div>
                <p className="text-sm sm:text-xs text-gray-500">Founders, advisors & consultants</p>
              </CardContent>
            </Card>
            <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-base sm:text-sm font-semibold text-gray-700">Upcoming Events</CardTitle>
                <Calendar className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl sm:text-2xl font-bold text-gray-900 mb-1">{dashboardStats.upcomingEvents}</div>
                <p className="text-sm sm:text-xs text-gray-500">From today onwards</p>
              </CardContent>
            </Card>
            <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-base sm:text-sm font-semibold text-gray-700">Pending Tasks</CardTitle>
                <Clock className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl sm:text-2xl font-bold text-gray-900 mb-1">{dashboardStats.pendingTasks}</div>
                <p className="text-sm sm:text-xs text-gray-500">Due this week</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-green-100 rounded-3xl p-6 md:p-12 mb-12 md:mb-16">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6 font-serif">
                Streamline Your Workflow
              </h3>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6 md:mb-8">
                Our Munus Hub brings together all your essential tools and information in one centralized location,
                making collaboration seamless and productivity effortless.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
                <Link href="/projects">
                  <Button className="bg-primary hover:bg-primary/90 text-white px-6 md:px-8 py-3 text-base md:text-lg w-full sm:w-auto">
                    Explore Projects
                  </Button>
                </Link>
                <Link href="/calendar">
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-white px-6 md:px-8 py-3 text-base md:text-lg bg-transparent w-full sm:w-auto"
                  >
                    View Calendar
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Recent Projects */}
            <Card className="border-gray-100 shadow-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl lg:text-3xl font-semibold text-gray-900 font-serif">
                  Recent Projects
                </CardTitle>
                <CardDescription className="text-gray-600 text-base lg:text-sm">
                  Latest project updates and milestones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {recentProjects.length > 0 ? (
                  recentProjects.map((project, index) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-6 border border-gray-100 rounded-xl hover:border-primary/20 transition-colors cursor-pointer"
                      onClick={() => handleProjectClickById(project.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                            index === 0 ? "bg-primary/10" : index === 1 ? "bg-secondary/10" : "bg-chart-4/10"
                          }`}
                        >
                          <FolderOpen
                            className={`h-6 w-6 ${
                              index === 0 ? "text-primary" : index === 1 ? "text-secondary" : "text-chart-4"
                            }`}
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg lg:text-xl">{project.title}</h4>
                          <p className="text-gray-600">{project.department}</p>
                          {project.description && (
                            <p className="text-sm lg:text-xs text-gray-500 mt-1">
                              {project.description.length > 60
                                ? `${project.description.substring(0, 60)}...`
                                : project.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge
                        className={getStatusColor(project.status)}
                        variant={project.status === "Planning" ? "outline" : "default"}
                      >
                        {project.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <FolderOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No recent projects</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Announcements */}
            <Card className="border-gray-100 shadow-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl lg:text-3xl font-semibold text-gray-900 font-serif">
                  Recent Announcements
                </CardTitle>
                <CardDescription className="text-gray-600 text-base lg:text-sm">
                  Latest company news and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {recentAnnouncements.length > 0 ? (
                  recentAnnouncements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="p-6 border border-gray-100 rounded-xl hover:border-primary/20 transition-colors cursor-pointer"
                      onClick={() => handleAnnouncementClick(announcement.id)}
                    >
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={announcement.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {announcement.author
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "AN"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-lg lg:text-xl mb-2">{announcement.title}</h4>
                          <p className="text-gray-600 mb-3 leading-relaxed">
                            {announcement.content.length > 80
                              ? `${announcement.content.substring(0, 80)}...`
                              : announcement.content}
                          </p>
                          <p className="text-sm lg:text-xs text-gray-500">
                            {announcement.author} • {getRelativeTime(announcement.date)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No recent announcements</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Events */}
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-6 md:pb-8">
              <CardTitle className="text-xl lg:text-2xl font-semibold text-gray-900 font-serif">
                Upcoming Events & Deadlines
              </CardTitle>
              <CardDescription className="text-gray-600 text-sm md:text-base">
                Important dates and milestones to keep track of
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                <div className="p-6 border border-gray-100 rounded-xl hover:border-primary/20 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="text-sm md:text-base font-semibold text-gray-700">Dec 15, 2024</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 text-lg lg:text-xl mb-2">All Hands Meeting</h4>
                  <p className="text-gray-600 leading-relaxed">Quarterly review and planning session</p>
                </div>
                <div className="p-6 border border-gray-100 rounded-xl hover:border-primary/20 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="text-sm md:text-base font-semibold text-gray-700">Dec 18, 2024</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 text-lg lg:text-xl mb-2">Project Deadline</h4>
                  <p className="text-gray-600 leading-relaxed">Website redesign final delivery</p>
                </div>
                <div className="p-6 border border-gray-100 rounded-xl hover:border-primary/20 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="text-sm md:text-base font-semibold text-gray-700">Dec 20, 2024</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 text-lg lg:text-xl mb-2">Team Building Event</h4>
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
