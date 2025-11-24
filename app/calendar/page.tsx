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
import { useState, useEffect } from "react"
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
  Settings,
} from "lucide-react"
import { AdminOnly } from "@/components/admin-only"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import {
  getCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "@/app/actions/calendar"
import { getVacations, addVacation, updateVacation, deleteVacation } from "@/app/actions/vacations"
import { getTeamMembers } from "@/app/actions/team"
import { usePermissions } from "@/hooks/use-permissions"

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
  const [events, setEvents] = useState([])
  const [vacations, setVacations] = useState([])
  const [teamMembers, setTeamMembers] = useState<any[]>([])

  const { user, logout, isAuthenticated } = useAuth()
  const { canEditCalendar, canEditEvent, canEditVacation, isAdministrator } = usePermissions()

  const [showMobileMenu, setShowMobileMenu] = useState(false)

  useEffect(() => {
    async function loadData() {
      const eventsData = await getCalendarEvents()
      console.log("[v0] Calendar events loaded from database:", eventsData)

      const parsedEvents = eventsData.map((event: any) => {
        const startDate = new Date(event.start_time)
        const endDate = new Date(event.end_time)

        return {
          ...event,
          date: startDate.toISOString().split("T")[0], // YYYY-MM-DD format
          time: startDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          duration: `${Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60))} minutes`,
          onlineMeeting: event.online_meeting_link || null,
        }
      })

      setEvents(parsedEvents)

      const vacationsData = await getVacations()
      console.log("[v0] Vacations loaded from database:", vacationsData)
      setVacations(vacationsData)

      const teamData = await getTeamMembers()
      const allMembers = [...teamData.founders, ...teamData.advisors, ...teamData.consultants]
      console.log("[v0] Team members loaded for vacation dropdown:", allMembers)
      setTeamMembers(allMembers)
    }
    loadData()
  }, [])

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
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

  const handleCreateEvent = async () => {
    console.log("Creating event:", newEvent)

    if (!newEvent.date || !newEvent.time) {
      alert("Please enter both date and time for the event")
      return
    }

    const startDateTime = new Date(`${newEvent.date}T${newEvent.time}:00`)

    if (isNaN(startDateTime.getTime())) {
      alert("Invalid date or time. Please check your input.")
      return
    }

    const endDateTime = new Date(startDateTime)

    // Add duration to end time (default to 1 hour if not specified)
    const durationMatch = newEvent.duration.match(/(\d+)\s*(hour|hr|h|minute|min|m)/i)
    if (durationMatch) {
      const value = Number.parseInt(durationMatch[1])
      const unit = durationMatch[2].toLowerCase()
      if (unit.startsWith("h")) {
        endDateTime.setHours(endDateTime.getHours() + value)
      } else if (unit.startsWith("m")) {
        endDateTime.setMinutes(endDateTime.getMinutes() + value)
      }
    } else {
      // Default to 1 hour if duration not specified
      endDateTime.setHours(endDateTime.getHours() + 1)
    }

    await createCalendarEvent(
      {
        title: newEvent.title,
        description: newEvent.description,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        location: newEvent.location,
        onlineMeetingLink: newEvent.onlineMeeting,
        attendees: newEvent.attendees ? [newEvent.attendees] : [],
        color: newEvent.type === "meeting" ? "#3b82f6" : newEvent.type === "deadline" ? "#ef4444" : "#10b981",
        type: newEvent.type,
      },
      user?.email || "",
    )

    // Reload events from database
    const updatedEvents = await getCalendarEvents()
    const parsedEvents = updatedEvents.map((event: any) => {
      const startDate = new Date(event.start_time)
      const endDate = new Date(event.end_time)

      return {
        ...event,
        date: startDate.toISOString().split("T")[0],
        time: startDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        duration: `${Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60))} minutes`,
        onlineMeeting: event.online_meeting_link || null,
      }
    })
    setEvents(parsedEvents)

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
    if (event.onlineMeeting || event.location) {
      const link = event.onlineMeeting || event.location
      if (link.startsWith("http://") || link.startsWith("https://")) {
        window.open(link, "_blank")
      } else {
        alert("This event doesn't have a valid online meeting link")
      }
    } else {
      alert("No online meeting link available for this event")
    }
  }

  const handleCreateVacation = async () => {
    console.log("[v0] Creating vacation:", newVacation)

    if (isEditingVacation && selectedVacation) {
      // Update existing vacation
      await updateVacation(selectedVacation.id, {
        employee_name: newVacation.employee,
        start_date: newVacation.startDate,
        end_date: newVacation.endDate,
        status: newVacation.status,
      })
    } else {
      await addVacation(
        {
          employee_name: newVacation.employee,
          start_date: newVacation.startDate,
          end_date: newVacation.endDate,
          status: newVacation.status,
        },
        user?.email || "",
      )
    }

    // Reload vacations from database
    const updatedVacations = await getVacations()
    setVacations(updatedVacations)

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
    setSelectedVacation(null)
  }

  const handleEditVacation = (vacation: any) => {
    setSelectedVacation(vacation)
    setNewVacation({
      employee: vacation.employee_name || "",
      department: vacation.department || "",
      startDate: vacation.start_date || "",
      endDate: vacation.end_date || "",
      type: vacation.type || "Holiday Leave",
      status: vacation.status || "pending",
    })
    setIsEditingVacation(true)
    setIsVacationModalOpen(true)
  }

  const handleDeleteVacation = async (vacationId: number) => {
    if (confirm("Are you sure you want to delete this vacation request?")) {
      console.log("[v0] Deleting vacation:", vacationId)
      await deleteVacation(vacationId)

      // Reload vacations from database
      const updatedVacations = await getVacations()
      setVacations(updatedVacations)
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
    const startDate = new Date(event.start_time)

    // Get local hours and minutes (not UTC)
    const hours = startDate.getHours().toString().padStart(2, "0")
    const minutes = startDate.getMinutes().toString().padStart(2, "0")
    const timeIn24Hour = `${hours}:${minutes}`

    setEditingEvent({
      ...event,
      date: event.date, // Ensure date is preserved
      time: timeIn24Hour, // Use 24-hour format in local timezone for the time input
      duration: event.duration || "", // Ensure duration is preserved
      location: event.location || "", // Ensure location is preserved
      description: event.description || "", // Ensure description is preserved
      onlineMeeting: event.onlineMeeting || "", // Ensure onlineMeeting is preserved
      attendees: Array.isArray(event.attendees) ? event.attendees.join(",") : event.attendees || "", // Ensure attendees is preserved
    })
    setIsEditEventModalOpen(true)
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      await deleteCalendarEvent(eventId)

      // Reload events from database
      const updatedEvents = await getCalendarEvents()
      const parsedEvents = updatedEvents.map((event: any) => {
        const startDate = new Date(event.start_time)
        const endDate = new Date(event.end_time)

        return {
          ...event,
          date: startDate.toISOString().split("T")[0],
          time: startDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          duration: `${Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60))} minutes`,
          onlineMeeting: event.online_meeting_link || null,
        }
      })
      setEvents(parsedEvents)
    }
  }

  const handleUpdateEvent = async () => {
    if (editingEvent) {
      console.log("[v0] Starting event update with editingEvent:", editingEvent)

      if (!editingEvent.date || !editingEvent.time) {
        alert("Please enter both date and time for the event")
        return
      }

      let timeString = editingEvent.time

      // If time is in 12-hour format (e.g., "02:30 PM"), convert to 24-hour format
      if (timeString.includes("AM") || timeString.includes("PM")) {
        const [time, period] = timeString.split(" ")
        const [hours, minutes] = time.split(":")
        let hour = Number.parseInt(hours)

        if (period === "PM" && hour !== 12) {
          hour += 12
        } else if (period === "AM" && hour === 12) {
          hour = 0
        }

        timeString = `${hour.toString().padStart(2, "0")}:${minutes}`
      }

      const startDateTime = new Date(`${editingEvent.date}T${timeString}:00`)

      if (isNaN(startDateTime.getTime())) {
        alert("Invalid date or time. Please check your input.")
        return
      }

      const endDateTime = new Date(startDateTime)

      if (editingEvent.duration) {
        const durationMatch = editingEvent.duration.match(/(\d+)\s*(hour|hr|h|minute|min|m)/i)
        if (durationMatch) {
          const value = Number.parseInt(durationMatch[1])
          const unit = durationMatch[2].toLowerCase()
          if (unit.startsWith("h")) {
            endDateTime.setHours(endDateTime.getHours() + value)
          } else if (unit.startsWith("m")) {
            endDateTime.setMinutes(endDateTime.getMinutes() + value)
          }
        } else {
          // Default to 1 hour if duration format not recognized
          endDateTime.setHours(endDateTime.getHours() + 1)
        }
      } else {
        // Default to 1 hour if no duration specified
        endDateTime.setHours(endDateTime.getHours() + 1)
      }

      console.log("[v0] editingEvent.location:", editingEvent.location)
      console.log("[v0] editingEvent.onlineMeeting:", editingEvent.onlineMeeting)

      const updateData = {
        title: editingEvent.title,
        description: editingEvent.description,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        location: editingEvent.location || "",
        onlineMeetingLink: editingEvent.onlineMeeting || null,
        attendees: editingEvent.attendees ? editingEvent.attendees.split(",") : [],
        color: editingEvent.color || "#3b82f6",
        type: editingEvent.type || "meeting",
      }

      console.log("[v0] Calling updateCalendarEvent with data:", updateData)

      const result = await updateCalendarEvent(editingEvent.id, updateData)

      console.log("[v0] updateCalendarEvent result:", result)

      // Reload events from database
      const updatedEvents = await getCalendarEvents()
      const parsedEvents = updatedEvents.map((event: any) => {
        const startDate = new Date(event.start_time)
        const endDate = new Date(event.end_time)

        return {
          ...event,
          date: startDate.toISOString().split("T")[0],
          time: startDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          duration: `${Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60))} minutes`,
          onlineMeeting: event.online_meeting_link || null,
        }
      })

      console.log("[v0] Events reloaded after update:", parsedEvents)
      setEvents(parsedEvents)

      setIsEditEventModalOpen(false)
      setEditingEvent(null)
    }
  }

  return (
    <div className="min-h-screen bg-green-50">
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
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-600 hover:text-primary"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
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
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 bg-primary/5 text-primary hover:bg-primary/10 h-12 px-4 font-medium"
              >
                <CalendarIcon className="h-4 w-4" />
                Calendar
              </Button>
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
              {canEditCalendar && (
                <>
                  <Button size="sm" onClick={openEventModal}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                  <Button size="sm" onClick={openVacationModal}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vacation
                  </Button>
                </>
              )}
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
                        return <div key={`empty-${index}`} className="p-1 sm:p-2"></div>
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
                        const startDate = new Date(vacation.start_date)
                        const endDate = new Date(vacation.end_date)
                        const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                        return checkDate >= startDate && checkDate <= endDate
                      })

                      return (
                        <div
                          key={`day-${day}`}
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

              {/* Upcoming Events Section */}
              <Card className="border-gray-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-gray-900 font-serif">Upcoming Events</CardTitle>
                  <CardDescription className="text-gray-600">Events and meetings from the calendar</CardDescription>
                </CardHeader>
                <CardContent>
                  {events.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p>No upcoming events scheduled</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {events
                        .filter((event) => {
                          const eventDate = new Date(event.start_time || event.date)
                          const now = new Date()
                          return eventDate > now
                        })
                        .sort((a, b) => {
                          const dateA = new Date(a.start_time || a.date)
                          const dateB = new Date(b.start_time || b.date)
                          return dateA.getTime() - dateB.getTime()
                        })
                        .slice(0, 5)
                        .map((event) => (
                          <div
                            key={`upcoming-${event.id}`}
                            onClick={() => handleViewDetails(event)}
                            className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-primary/20 hover:bg-gray-50/50 transition-colors cursor-pointer"
                          >
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                              {getEventTypeIcon(event.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 text-lg">{event.title}</h4>
                              <p className="text-gray-600 truncate">
                                {new Date(event.date + "T00:00:00").toLocaleDateString()} • {event.time}{" "}
                                {event.timezone && `(${event.timezone})`} • {event.location}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getEventTypeColor(event.type)}>{event.type}</Badge>
                              {event.onlineMeeting && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  Online
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="space-y-8">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {events
                  .sort((a, b) => {
                    const dateA = new Date(a.start_time || a.date)
                    const dateB = new Date(b.start_time || b.date)
                    return dateB.getTime() - dateA.getTime() // Descending order (newest first)
                  })
                  .map((event) => (
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
                            <span className="text-gray-700">
                              {event.time} {event.timezone && `(${event.timezone})`}
                            </span>
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
                            disabled={!event.onlineMeeting && !event.location}
                          >
                            Join Event
                          </Button>
                          {canEditEvent(event.created_by) && (
                            <>
                              <Button variant="outline" size="sm" onClick={() => handleEditEvent(event)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDeleteEvent(event.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
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
                    {canEditCalendar && (
                      <Button size="sm" onClick={openVacationModal}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Vacation
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {vacations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Plane className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p>No vacation requests yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {vacations.map((vacation) => {
                        const startDate = new Date(vacation.start_date)
                        const endDate = new Date(vacation.end_date)
                        const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

                        return (
                          <div
                            key={vacation.id}
                            className="flex items-center gap-4 p-6 border border-gray-100 rounded-xl hover:border-primary/20 transition-colors"
                          >
                            <Avatar className="h-12 w-12 flex-shrink-0">
                              <AvatarImage src="/placeholder.svg" />
                              <AvatarFallback>
                                {vacation.employee_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                <h4 className="font-semibold text-gray-900 text-lg">{vacation.employee_name}</h4>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                  <CalendarIcon className="h-4 w-4" />
                                  <span>
                                    {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  <span>{days} days</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={`${getVacationStatusColor(vacation.status)} flex-shrink-0`}>
                                {vacation.status}
                              </Badge>
                              {canEditVacation(vacation.created_by, vacation.employee_name) && (
                                <>
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
                                </>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
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
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Label className="text-sm font-semibold text-blue-900 mb-2 block">Online Meeting Link</Label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <a
                      href={selectedEvent.onlineMeeting}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-medium text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2 break-all flex-1"
                    >
                      {selectedEvent.onlineMeeting}
                    </a>
                    <Button
                      size="sm"
                      onClick={() => handleJoinEvent(selectedEvent)}
                      className="bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0"
                    >
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
              <Select
                value={newVacation.employee}
                onValueChange={(value) => setNewVacation({ ...newVacation, employee: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.name}>
                      {member.name} - {member.role}
                    </SelectItem>
                  ))}
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

      {/* Edit Event Modal */}
      <Dialog open={isEditEventModalOpen} onOpenChange={setIsEditEventModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold font-serif">Edit Event</DialogTitle>
            <DialogDescription>Update the event details below.</DialogDescription>
          </DialogHeader>
          {editingEvent && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right font-medium">
                  Title
                </Label>
                <Input
                  id="edit-title"
                  value={editingEvent.title || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="col-span-3"
                  placeholder="Enter event title"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-type" className="text-right font-medium">
                  Type
                </Label>
                <Select
                  value={editingEvent.type || "meeting"}
                  onValueChange={(value) => setEditingEvent({ ...editingEvent, type: value })}
                >
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
                <Label htmlFor="edit-date" className="text-right font-medium">
                  Date
                </Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editingEvent.date || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-time" className="text-right font-medium">
                  Time
                </Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={editingEvent.time || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-duration" className="text-right font-medium">
                  Duration
                </Label>
                <Input
                  id="edit-duration"
                  value={editingEvent.duration || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, duration: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., 2 hours, All day"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-location" className="text-right font-medium">
                  Location
                </Label>
                <Input
                  id="edit-location"
                  value={editingEvent.location || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                  className="col-span-3"
                  placeholder="Conference Room A, Remote, etc."
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-attendees" className="text-right font-medium">
                  Attendees
                </Label>
                <Input
                  id="edit-attendees"
                  value={editingEvent.attendees || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, attendees: e.target.value })}
                  className="col-span-3"
                  placeholder="Number of expected attendees"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-online-meeting" className="text-right font-medium">
                  Online Meeting
                </Label>
                <Input
                  id="edit-online-meeting"
                  value={editingEvent.onlineMeeting || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, onlineMeeting: e.target.value })}
                  placeholder="https://meet.google.com/... or https://zoom.us/..."
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-description" className="text-right font-medium">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  value={editingEvent.description || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  className="col-span-3"
                  placeholder="Event description and details"
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditEventModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateEvent} disabled={!editingEvent?.title || !editingEvent?.date}>
              Update Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
