"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import {
  CalendarIcon,
  Users,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Plane,
  Coffee,
  TrendingUp,
  FolderOpen,
  Bell,
  Menu,
  LogOut,
  Edit,
  Trash2,
  Pencil,
  Calendar,
} from "lucide-react"
import { AdminOnly } from "@/components/admin-only"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

const eventsData = [
  {
    id: 1,
    title: "All Hands Meeting",
    type: "meeting",
    date: "2024-12-15",
    time: "10:00 AM",
    duration: "2 hours",
    location: "Conference Room A",
    attendees: 48,
    description: "Quarterly review and planning session for all departments",
    onlineMeeting: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: 2,
    title: "Project Deadline: Website Redesign",
    type: "deadline",
    date: "2024-12-18",
    time: "5:00 PM",
    duration: "All day",
    location: "Remote",
    attendees: 3,
    description: "Final delivery of the website redesign project",
    onlineMeeting: "",
  },
  {
    id: 3,
    title: "Team Building Event",
    type: "event",
    date: "2024-12-20",
    time: "2:00 PM",
    duration: "4 hours",
    location: "Downtown Event Center",
    attendees: 48,
    description: "Annual holiday celebration and team building activities",
    onlineMeeting: "",
  },
  {
    id: 4,
    title: "Client Presentation",
    type: "meeting",
    date: "2024-12-22",
    time: "9:00 AM",
    duration: "1 hour",
    location: "Client Office",
    attendees: 5,
    description: "Quarterly business review with key client",
    onlineMeeting: "https://zoom.us/j/123456789",
  },
]

const vacationsData = [
  {
    id: 1,
    employee: "Sarah Miller",
    department: "Marketing",
    startDate: "2024-12-23",
    endDate: "2024-12-30",
    days: 6,
    type: "Holiday Leave",
    status: "approved",
    avatar: "/team-sarah.png",
  },
  {
    id: 2,
    employee: "John Doe",
    department: "Design",
    startDate: "2024-12-16",
    endDate: "2024-12-20",
    days: 5,
    type: "Personal Leave",
    status: "approved",
    avatar: "/team-john.png",
  },
  {
    id: 3,
    employee: "Mike Chen",
    department: "Development",
    startDate: "2024-12-27",
    endDate: "2025-01-03",
    days: 8,
    type: "Holiday Leave",
    status: "pending",
    avatar: "/team-mike.png",
  },
  {
    id: 4,
    employee: "Lisa Wang",
    department: "Development",
    startDate: "2024-12-19",
    endDate: "2024-12-19",
    days: 1,
    type: "Sick Leave",
    status: "approved",
    avatar: "/team-member-1.png",
  },
]

function getEventTypeColor(type: string) {
  switch (type) {
    case "meeting":
      return "bg-secondary text-secondary-foreground"
    case "deadline":
      return "bg-destructive text-destructive-foreground"
    case "event":
      return "bg-chart-4 text-white"
    case "training":
      return "bg-chart-2 text-white"
    default:
      return "bg-muted text-muted-foreground"
  }
}

function getEventTypeIcon(type: string) {
  switch (type) {
    case "meeting":
      return <Users className="h-4 w-4" />
    case "deadline":
      return <Clock className="h-4 w-4" />
    case "event":
      return <Coffee className="h-4 w-4" />
    case "training":
      return <FolderOpen className="h-4 w-4" />
    default:
      return <CalendarIcon className="h-4 w-4" />
  }
}

function getVacationStatusColor(status: string) {
  switch (status) {
    case "approved":
      return "bg-chart-4 text-white"
    case "pending":
      return "bg-chart-3 text-white"
    case "rejected":
      return "bg-destructive text-destructive-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState("month")
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [isVacationModalOpen, setIsVacationModalOpen] = useState(false)
  const [isEditingVacation, setIsEditingVacation] = useState(false)
  const [selectedVacation, setSelectedVacation] = useState<any>(null)
  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "meeting",
    date: "",
    time: "",
    duration: "",
    location: "",
    description: "",
    attendees: "",
    onlineMeeting: "",
  })
  const [newVacation, setNewVacation] = useState({
    employee: "",
    department: "",
    startDate: "",
    endDate: "",
    type: "Holiday Leave",
    status: "pending",
  })

  const [editingEvent, setEditingEvent] = useState<any>(null)
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false)
  const [events, setEvents] = useState(eventsData)
  const [vacations, setVacations] = useState(vacationsData)

  const { user, logout, isAuthenticated } = useAuth()

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-green-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <Card className="border-gray-100 shadow-lg">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-serif">Access Required</CardTitle>
              <CardDescription>Please sign in to view calendar</CardDescription>
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

  const handleCreateEvent = () => {
    console.log("Creating event:", newEvent)
    const eventWithId = {
      ...newEvent,
      id: String(Date.now()),
      attendees: Number.parseInt(newEvent.attendees) || 0,
    }
    const updatedEvents = [...events, eventWithId]
    setEvents(updatedEvents)

    // Save to localStorage for persistence
    localStorage.setItem("calendar_events", JSON.stringify(updatedEvents))

    // Dispatch storage event for cross-tab synchronization
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "calendar_events",
        newValue: JSON.stringify(updatedEvents),
      }),
    )

    setNewEvent({
      title: "",
      type: "meeting",
      date: "",
      time: "",
      duration: "",
      location: "",
      description: "",
      attendees: "",
      onlineMeeting: "",
    })
    setIsEventModalOpen(false)
  }

  const openEventModal = () => {
    setIsEventModalOpen(true)
  }

  const handleViewDetails = (event: any) => {
    setSelectedEvent(event)
    setIsEventDetailsModalOpen(true)
  }

  const handleJoinEvent = (event: any) => {
    if (event.onlineMeeting) {
      window.open(event.onlineMeeting, "_blank")
    } else {
      alert("No online meeting link available for this event")
    }
  }

  const handleCreateVacation = () => {
    console.log("Creating vacation:", newVacation)
    setVacations([...vacations, { ...newVacation, id: String(Date.now()) }])
    setNewVacation({
      employee: "",
      department: "",
      startDate: "",
      endDate: "",
      type: "Holiday Leave",
      status: "pending",
    })
    setIsVacationModalOpen(false)
    setIsEditingVacation(false)
  }

  const handleEditVacation = (vacation: any) => {
    setSelectedVacation(vacation)
    setNewVacation({
      employee: vacation.employee,
      department: vacation.department,
      startDate: vacation.startDate,
      endDate: vacation.endDate,
      type: vacation.type,
      status: vacation.status,
    })
    setIsEditingVacation(true)
    setIsVacationModalOpen(true)
  }

  const handleDeleteVacation = (vacationId: number) => {
    if (confirm("Are you sure you want to delete this vacation request?")) {
      console.log("Deleting vacation:", vacationId)
      setVacations(vacations.filter((vacation) => vacation.id !== vacationId))
    }
  }

  const openVacationModal = () => {
    setIsEditingVacation(false)
    setSelectedVacation(null)
    setNewVacation({
      employee: "",
      department: "",
      startDate: "",
      endDate: "",
      type: "Holiday Leave",
      status: "pending",
    })
    setIsVacationModalOpen(true)
  }

  const currentMonth = currentDate.toLocaleString("default", { month: "long", year: "numeric" })

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const today = new Date()
  const isToday = (day: number | null) => {
    if (!day) return false
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  const handleEditEvent = (event: any) => {
    setEditingEvent(event)
    setIsEditEventModalOpen(true)
  }

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((event) => event.id !== eventId))
    }
  }

  const handleUpdateEvent = () => {
    if (editingEvent) {
      const updatedEvents = events.map((event) => (event.id === editingEvent.id ? editingEvent : event))
      setEvents(updatedEvents)

      // Save to localStorage
      localStorage.setItem("calendar_events", JSON.stringify(updatedEvents))

      // Dispatch storage event
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "calendar_events",
          newValue: JSON.stringify(updatedEvents),
        }),
      )

      setIsEditEventModalOpen(false)
      setEditingEvent(null)
    }
  }

  return (
    <div className="min-h-screen bg-green-100">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white">
        <div className="flex h-20 items-center justify-between px-8">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <img src="/munus-logo.jpg" alt="Munus Logo" className="h-8 w-auto" />
              <h1 className="text-3xl font-bold text-gray-900 font-serif">Munus Hub</h1>
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
              <Button
                variant="ghost"
                className="gap-2 bg-primary/5 text-primary hover:bg-primary/10 h-10 px-4 font-medium"
              >
                <CalendarIcon className="h-4 w-4" />
                Calendar
              </Button>
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
            <Button variant="ghost" size="sm" className="md:hidden text-gray-600 hover:text-primary">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
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
      <main className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2 font-serif">Calendar & Vacation</h2>
              <p className="text-xl text-gray-600">Manage events, meetings, and team vacation schedules</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <AdminOnly>
                <Button size="sm" onClick={openEventModal}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </AdminOnly>
              <AdminOnly>
                <Button size="sm" onClick={openVacationModal}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vacation
                </Button>
              </AdminOnly>
            </div>
          </div>

          {/* Calendar Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="text-xl font-semibold">{currentMonth}</h3>
                <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Select value={viewMode} onValueChange={setViewMode}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="day">Day</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
          </div>

          {/* Tabs Content */}
          <Tabs defaultValue="calendar" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="calendar"
                className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm font-medium"
              >
                Calendar
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm font-medium"
              >
                Events
              </TabsTrigger>
              <TabsTrigger
                value="vacation"
                className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm font-medium"
              >
                Vacation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="space-y-8">
              {/* Mini Calendar Grid */}
              <Card className="border-gray-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-gray-900 font-serif">{currentMonth}</CardTitle>
                  <CardDescription className="text-gray-600">Company events and vacation schedule</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                        <span className="hidden sm:inline">{day}</span>
                        <span className="sm:hidden">{day.slice(0, 1)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1 sm:gap-2">
                    {getDaysInMonth().map((day, index) => {
                      if (!day) {
                        return <div key={index} className="p-1 sm:p-2"></div>
                      }

                      const hasEvent = events.some((event) => {
                        const eventDate = new Date(event.date)
                        return (
                          eventDate.getDate() === day &&
                          eventDate.getMonth() === currentDate.getMonth() &&
                          eventDate.getFullYear() === currentDate.getFullYear()
                        )
                      })

                      const hasVacation = vacations.some((vacation) => {
                        const startDate = new Date(vacation.startDate)
                        const endDate = new Date(vacation.endDate)
                        const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                        return checkDate >= startDate && checkDate <= endDate
                      })

                      return (
                        <div
                          key={day}
                          className={`p-1 sm:p-2 text-center text-sm border border-gray-100 rounded cursor-pointer hover:bg-gray-50 ${
                            isToday(day) ? "bg-primary text-white" : ""
                          }`}
                        >
                          <div className="text-xs sm:text-sm">{day}</div>
                          <div className="flex gap-1 mt-1 justify-center">
                            {hasEvent && <div className="w-1 h-1 sm:w-2 sm:h-2 bg-primary rounded-full"></div>}
                            {hasVacation && <div className="w-1 h-1 sm:w-2 sm:h-2 bg-chart-3 rounded-full"></div>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-gray-900 font-serif">
                    This Week's Schedule
                  </CardTitle>
                  <CardDescription className="text-gray-600">Events and meetings for this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-b border-gray-100 pb-4">
                      <h5 className="font-medium text-gray-700 mb-3">Monday</h5>
                      <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-primary/20 transition-colors">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-lg">Daily Standup</h4>
                          <p className="text-gray-600 truncate">9:00 AM - 9:30 AM • Conference Room B</p>
                        </div>
                        <Badge className="bg-primary text-white hidden sm:inline-flex">Meeting</Badge>
                      </div>
                    </div>

                    <div className="border-b border-gray-100 pb-4">
                      <h5 className="font-medium text-gray-700 mb-3">Tuesday</h5>
                      <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-primary/20 transition-colors">
                        <div className="h-12 w-12 rounded-xl bg-chart-2/10 flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-chart-2" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-lg">Project Review Meeting</h4>
                          <p className="text-gray-600 truncate">2:00 PM - 3:30 PM • Conference Room A</p>
                        </div>
                        <Badge className="bg-chart-2 text-white hidden sm:inline-flex">Meeting</Badge>
                      </div>
                    </div>

                    <div className="border-b border-gray-100 pb-4">
                      <h5 className="font-medium text-gray-700 mb-3">Wednesday</h5>
                      <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-primary/20 transition-colors">
                        <div className="h-12 w-12 rounded-xl bg-chart-4/10 flex items-center justify-center flex-shrink-0">
                          <Coffee className="h-6 w-6 text-chart-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-lg">Coffee Chat with Design Team</h4>
                          <p className="text-gray-600 truncate">3:00 PM - 4:00 PM • Kitchen Area</p>
                        </div>
                        <Badge className="bg-chart-4 text-white hidden sm:inline-flex">Social</Badge>
                      </div>
                    </div>

                    <div className="border-b border-gray-100 pb-4">
                      <h5 className="font-medium text-gray-700 mb-3">Thursday</h5>
                      <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-primary/20 transition-colors">
                        <div className="h-12 w-12 rounded-xl bg-chart-3/10 flex items-center justify-center">
                          <Users className="h-6 w-6 text-chart-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-lg">Team Building Workshop</h4>
                          <p className="text-gray-600 truncate">10:00 AM - 12:00 PM • Training Room</p>
                        </div>
                        <Badge className="bg-chart-3 text-white hidden sm:inline-flex">Workshop</Badge>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-700 mb-3">Friday</h5>
                      <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-primary/20 transition-colors">
                        <div className="h-12 w-12 rounded-xl bg-chart-1/10 flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-chart-1" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-lg">Weekly Retrospective</h4>
                          <p className="text-gray-600 truncate">4:00 PM - 5:00 PM • Conference Room C</p>
                        </div>
                        <Badge className="bg-chart-1 text-white hidden sm:inline-flex">Meeting</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="space-y-8">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {events.map((event) => (
                  <Card key={event.id} className="border-gray-100 shadow-sm">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            {getEventTypeIcon(event.type)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-xl font-semibold text-gray-900 font-serif truncate">
                              {event.title}
                            </CardTitle>
                            <CardDescription className="text-gray-600 line-clamp-2">
                              {event.description}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className={getEventTypeColor(event.type)} className="flex-shrink-0">
                          {event.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">
                            {new Date(event.date + "T00:00:00").toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700 truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{event.attendees} attendees</span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => handleViewDetails(event)}
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleJoinEvent(event)}
                          disabled={!event.onlineMeeting}
                        >
                          Join Event
                        </Button>
                        <AdminOnly>
                          <Button variant="outline" size="sm" onClick={() => handleEditEvent(event)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteEvent(event.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AdminOnly>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="vacation" className="space-y-8">
              {/* Vacation Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card className="border-gray-100 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Plane className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-gray-700">Total Requests</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">12</p>
                    <p className="text-sm text-gray-500">This month</p>
                  </CardContent>
                </Card>
                <Card className="border-gray-100 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Users className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-gray-700">Currently Out</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">3</p>
                    <p className="text-sm text-gray-500">Team members</p>
                  </CardContent>
                </Card>
                <Card className="border-gray-100 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-gray-700">Pending Approval</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">2</p>
                    <p className="text-sm text-gray-500">Requests</p>
                  </CardContent>
                </Card>
              </div>

              {/* Vacation Requests */}
              <Card className="border-gray-100 shadow-sm">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl font-semibold text-gray-900 font-serif">
                        Vacation Schedule
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Team member time off and vacation requests
                      </CardDescription>
                    </div>
                    <AdminOnly>
                      <Button size="sm" onClick={openVacationModal}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Vacation
                      </Button>
                    </AdminOnly>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {vacations.map((vacation) => (
                      <div
                        key={vacation.id}
                        className="flex items-center gap-4 p-6 border border-gray-100 rounded-xl hover:border-primary/20 transition-colors"
                      >
                        <Avatar className="h-12 w-12 flex-shrink-0">
                          <AvatarImage src={vacation.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {vacation.employee
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900 text-lg">{vacation.employee}</h4>
                            <Badge variant="outline" className="border-gray-300 text-gray-700 w-fit">
                              {vacation.department}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{vacation.type}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4" />
                              <span>
                                {new Date(vacation.startDate).toLocaleDateString()} -{" "}
                                {new Date(vacation.endDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{vacation.days} days</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getVacationStatusColor(vacation.status)} flex-shrink-0`}>
                            {vacation.status}
                          </Badge>
                          <AdminOnly>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditVacation(vacation)}
                              className="text-gray-600 hover:text-primary"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteVacation(vacation.id)}
                              className="text-gray-600 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AdminOnly>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Event Creation Modal */}
      <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold font-serif">Create New Event</DialogTitle>
            <DialogDescription>Add a new event, meeting, or deadline to the company calendar.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right font-medium">
                Title
              </Label>
              <Input
                id="title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="col-span-3"
                placeholder="Enter event title"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right font-medium">
                Type
              </Label>
              <Select value={newEvent.type} onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right font-medium">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right font-medium">
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right font-medium">
                Duration
              </Label>
              <Input
                id="duration"
                value={newEvent.duration}
                onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })}
                className="col-span-3"
                placeholder="e.g., 2 hours, All day"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right font-medium">
                Location
              </Label>
              <Input
                id="location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                className="col-span-3"
                placeholder="Conference Room A, Remote, etc."
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="attendees" className="text-right font-medium">
                Attendees
              </Label>
              <Input
                id="attendees"
                value={newEvent.attendees}
                onChange={(e) => setNewEvent({ ...newEvent, attendees: e.target.value })}
                className="col-span-3"
                placeholder="Number of expected attendees"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="onlineMeeting" className="text-right font-medium">
                Online Meeting
              </Label>
              <Input
                id="onlineMeeting"
                value={newEvent.onlineMeeting}
                onChange={(e) => setNewEvent({ ...newEvent, onlineMeeting: e.target.value })}
                className="col-span-3"
                placeholder="https://meet.google.com/... or https://zoom.us/..."
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                className="col-span-3"
                placeholder="Event description and details"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEventModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateEvent} disabled={!newEvent.title || !newEvent.date}>
              Create Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Details Modal */}
      <Dialog open={isEventDetailsModalOpen} onOpenChange={setIsEventDetailsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold font-serif">{selectedEvent?.title}</DialogTitle>
            <DialogDescription>Event details and information</DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Type</Label>
                  <p className="text-lg capitalize">{selectedEvent.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Date</Label>
                  <p className="text-lg">{new Date(selectedEvent.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Time</Label>
                  <p className="text-lg">{selectedEvent.time}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Duration</Label>
                  <p className="text-lg">{selectedEvent.duration}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Location</Label>
                  <p className="text-lg">{selectedEvent.location}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Attendees</Label>
                  <p className="text-lg">{selectedEvent.attendees} people</p>
                </div>
              </div>

              {selectedEvent.onlineMeeting && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Online Meeting</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-lg truncate flex-1">{selectedEvent.onlineMeeting}</p>
                    <Button size="sm" onClick={() => handleJoinEvent(selectedEvent)}>
                      Join Now
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium text-gray-500">Description</Label>
                <p className="text-lg mt-1">{selectedEvent.description}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEventDetailsModalOpen(false)}>
              Close
            </Button>
            {selectedEvent?.onlineMeeting && (
              <Button onClick={() => handleJoinEvent(selectedEvent)}>Join Meeting</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Vacation Management Modal */}
      <Dialog open={isVacationModalOpen} onOpenChange={setIsVacationModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold font-serif">
              {isEditingVacation ? "Edit Vacation Request" : "Add New Vacation"}
            </DialogTitle>
            <DialogDescription>
              {isEditingVacation
                ? "Update vacation request details"
                : "Create a new vacation request for a team member"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employee" className="text-right font-medium">
                Employee
              </Label>
              <Input
                id="employee"
                value={newVacation.employee}
                onChange={(e) => setNewVacation({ ...newVacation, employee: e.target.value })}
                className="col-span-3"
                placeholder="Employee name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right font-medium">
                Department
              </Label>
              <Select
                value={newVacation.department}
                onValueChange={(value) => setNewVacation({ ...newVacation, department: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vacationType" className="text-right font-medium">
                Type
              </Label>
              <Select
                value={newVacation.type}
                onValueChange={(value) => setNewVacation({ ...newVacation, type: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Holiday Leave">Holiday Leave</SelectItem>
                  <SelectItem value="Personal Leave">Personal Leave</SelectItem>
                  <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                  <SelectItem value="Maternity Leave">Maternity Leave</SelectItem>
                  <SelectItem value="Paternity Leave">Paternity Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right font-medium">
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={newVacation.startDate}
                onChange={(e) => setNewVacation({ ...newVacation, startDate: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right font-medium">
                End Date
              </Label>
              <Input
                id="endDate"
                type="date"
                value={newVacation.endDate}
                onChange={(e) => setNewVacation({ ...newVacation, endDate: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right font-medium">
                Status
              </Label>
              <Select
                value={newVacation.status}
                onValueChange={(value) => setNewVacation({ ...newVacation, status: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVacationModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateVacation}
              disabled={!newVacation.employee || !newVacation.startDate || !newVacation.endDate}
            >
              {isEditingVacation ? "Update Vacation" : "Add Vacation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditEventModalOpen} onOpenChange={setIsEditEventModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>Update the event details below.</DialogDescription>
          </DialogHeader>
          {editingEvent && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">
                  Title
                </Label>
                <Input
                  id="edit-title"
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-type" className="text-right">
                  Type
                </Label>
                <Select
                  value={editingEvent.type}
                  onValueChange={(value) => setEditingEvent({ ...editingEvent, type: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Meeting">Meeting</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Conference">Conference</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                    <SelectItem value="Social">Social</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-date" className="text-right">
                  Date
                </Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editingEvent.date}
                  onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-time" className="text-right">
                  Time
                </Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={editingEvent.time}
                  onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-location" className="text-right">
                  Location
                </Label>
                <Input
                  id="edit-location"
                  value={editingEvent.location}
                  onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-online-meeting" className="text-right">
                  Online Meeting
                </Label>
                <Input
                  id="edit-online-meeting"
                  value={editingEvent.onlineMeeting || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, onlineMeeting: e.target.value })}
                  placeholder="Meeting link (optional)"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <textarea
                  id="edit-description"
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  className="col-span-3 min-h-[80px] px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={handleUpdateEvent}>
              Update Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
