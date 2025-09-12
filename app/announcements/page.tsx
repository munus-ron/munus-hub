"use client"

import { CardDescription } from "@/components/ui/card"
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import {
  Bell,
  Search,
  Calendar,
  Users,
  TrendingUp,
  FolderOpen,
  MessageSquare,
  Heart,
  Share2,
  Pin,
  AlertCircle,
  Info,
  CheckCircle,
  Megaphone,
  Menu,
  LogOut,
  Settings,
} from "lucide-react"
import { AdminOnly } from "@/components/admin-only"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null)
  const [deletingAnnouncement, setDeletingAnnouncement] = useState<any>(null)
  const [announcementLikes, setAnnouncementLikes] = useState<{
    [key: number]: { users: string[]; currentUserLiked: boolean }
  }>({})
  const [showLikesList, setShowLikesList] = useState<{ [key: number]: boolean }>({})
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>({})
  const [newComments, setNewComments] = useState<{ [key: number]: string }>({})
  const [highlightedAnnouncement, setHighlightedAnnouncement] = useState<number | null>(null)
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    category: "",
    priority: "medium",
    isPinned: false,
    tags: "",
  })
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const { user, logout, isAuthenticated } = useAuth()
  const searchParams = useSearchParams()
  const highlightId = searchParams.get("highlight")

  useEffect(() => {
    const loadAnnouncements = () => {
      const stored = localStorage.getItem("announcements")
      if (stored) {
        try {
          const parsedAnnouncements = JSON.parse(stored)
          setAnnouncements(parsedAnnouncements)
        } catch (error) {
          console.error("Error parsing stored announcements:", error)
          setAnnouncements(defaultAnnouncements)
        }
      } else {
        setAnnouncements(defaultAnnouncements)
      }
    }

    loadAnnouncements()
  }, []) // Remove searchParams dependency and handle highlight separately

  useEffect(() => {
    if (highlightId) {
      const id = Number.parseInt(highlightId)
      setHighlightedAnnouncement(id)
      // Auto-scroll to highlighted announcement after a short delay
      setTimeout(() => {
        const element = document.getElementById(`announcement-${id}`)
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }, 500)
      // Remove highlight after 3 seconds
      setTimeout(() => {
        setHighlightedAnnouncement(null)
      }, 3000)
    }
  }, [highlightId]) // Use extracted highlightId instead of searchParams

  const defaultAnnouncements = [
    {
      id: 1,
      title: "New Office Opening in Austin, Texas",
      content:
        "We're excited to announce the opening of our new branch office in Austin, Texas. This expansion represents our commitment to growth and better serving our clients in the Southwest region. The new office will house our customer success and sales teams, with plans to hire 25 new employees over the next six months.",
      author: "Sarah Miller",
      authorRole: "CEO",
      authorAvatar: "/ceo-headshot.png",
      publishedAt: "2024-12-10T14:30:00Z",
      category: "Company News",
      priority: "high",
      isPinned: true,
      likes: 42,
      comments: 8,
      tags: ["expansion", "hiring", "austin"],
    },
    {
      id: 2,
      title: "Updated Holiday Schedule for 2024-2025",
      content:
        "Please note the updated holiday schedule for the remainder of 2024 and early 2025. The office will be closed December 23-26 and January 1st. All employees are encouraged to use their remaining PTO before the end of the year. HR will be sending individual PTO balance reports by email this week.",
      author: "Robert Johnson",
      authorRole: "HR Director",
      authorAvatar: "/placeholder-wb2g6.png",
      publishedAt: "2024-12-09T09:15:00Z",
      category: "HR Policy",
      priority: "medium",
      isPinned: false,
      likes: 28,
      comments: 12,
      tags: ["holidays", "pto", "schedule"],
    },
    {
      id: 3,
      title: "Q4 All Hands Meeting - December 15th",
      content:
        "Join us for our quarterly all hands meeting on December 15th at 10:00 AM in Conference Room A. We'll be reviewing Q4 performance, discussing 2025 goals, and recognizing outstanding team achievements. Light refreshments will be provided. Please confirm your attendance with your manager.",
      author: "Jennifer Lee",
      authorRole: "Operations Manager",
      authorAvatar: "/team-member-1.png",
      publishedAt: "2024-12-08T16:45:00Z",
      category: "Events",
      priority: "medium",
      isPinned: true,
      likes: 35,
      comments: 6,
      tags: ["meeting", "q4", "goals"],
    },
    {
      id: 4,
      title: "New Security Protocols Effective Immediately",
      content:
        "As part of our ongoing commitment to data security, we're implementing new security protocols effective immediately. All employees must enable two-factor authentication on their work accounts by December 20th. IT will be hosting training sessions throughout the week. Please contact the IT helpdesk if you need assistance.",
      author: "Michael Chen",
      authorRole: "IT Security Manager",
      authorAvatar: "/team-member-2.png",
      publishedAt: "2024-12-07T11:20:00Z",
      category: "Security",
      priority: "critical",
      isPinned: false,
      likes: 18,
      comments: 15,
      tags: ["security", "2fa", "training"],
    },
    {
      id: 5,
      title: "Employee of the Month - November 2024",
      content:
        "Congratulations to Lisa Rodriguez from our Customer Success team for being selected as Employee of the Month for November! Lisa consistently goes above and beyond to ensure customer satisfaction and has received outstanding feedback from clients. Please join us in congratulating Lisa on this well-deserved recognition.",
      author: "Amanda Foster",
      authorRole: "People Operations",
      authorAvatar: "/team-member-3.png",
      publishedAt: "2024-12-06T13:10:00Z",
      category: "Recognition",
      priority: "low",
      isPinned: false,
      likes: 67,
      comments: 23,
      tags: ["recognition", "employee", "success"],
    },
    {
      id: 6,
      title: "Updated Health Benefits Information",
      content:
        "Open enrollment for health benefits ends December 15th. Please review the updated benefits package and make your selections through the HR portal. New this year: enhanced mental health coverage and flexible spending account options. Contact HR with any questions about your benefits selections.",
      author: "Robert Johnson",
      authorRole: "HR Director",
      authorAvatar: "/placeholder-wb2g6.png",
      publishedAt: "2024-12-05T08:30:00Z",
      category: "Benefits",
      priority: "high",
      isPinned: false,
      likes: 24,
      comments: 9,
      tags: ["benefits", "enrollment", "health"],
    },
  ]

  function getPriorityColor(priority: string) {
    switch (priority) {
      case "critical":
        return "bg-destructive text-destructive-foreground"
      case "high":
        return "bg-chart-3 text-white"
      case "medium":
        return "bg-secondary text-secondary-foreground"
      case "low":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  function getPriorityIcon(priority: string) {
    switch (priority) {
      case "critical":
        return <AlertCircle className="h-4 w-4" />
      case "high":
        return <Info className="h-4 w-4" />
      case "medium":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  function getCategoryColor(category: string) {
    switch (category) {
      case "Company News":
        return "bg-primary text-primary-foreground"
      case "HR Policy":
        return "bg-chart-4 text-white"
      case "Events":
        return "bg-accent text-accent-foreground"
      case "Security":
        return "bg-destructive text-destructive-foreground"
      case "Recognition":
        return "bg-chart-2 text-white"
      case "Benefits":
        return "bg-chart-1 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  function formatTimeAgo(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-green-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <Card className="border-gray-100 shadow-lg">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-serif">Access Required</CardTitle>
              <CardDescription>Please sign in to view announcements</CardDescription>
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

  const pinnedAnnouncements = announcements.filter((a) => a.isPinned)
  const regularAnnouncements = announcements.filter((a) => !a.isPinned)

  const handleAddComment = (announcementId: number) => {
    const commentText = newComments[announcementId]?.trim()
    if (!commentText) return

    const updatedAnnouncements = announcements.map((announcement) => {
      if (announcement.id === announcementId) {
        const newComment = {
          id: Date.now(),
          author: user?.name || "Anonymous",
          authorAvatar: user?.avatar || "/placeholder.svg",
          content: commentText,
          timestamp: new Date().toISOString(),
        }

        const updatedComments = announcement.comments || []
        return {
          ...announcement,
          comments: typeof announcement.comments === "number" ? updatedComments.length + 1 : updatedComments.length + 1,
          commentsList: [...(announcement.commentsList || []), newComment],
        }
      }
      return announcement
    })

    setAnnouncements(updatedAnnouncements)
    localStorage.setItem("announcements", JSON.stringify(updatedAnnouncements))

    // Clear the comment input
    setNewComments({
      ...newComments,
      [announcementId]: "",
    })
  }

  const handleCommentChange = (announcementId: number, value: string) => {
    setNewComments({
      ...newComments,
      [announcementId]: value,
    })
  }

  const handleCreateAnnouncement = () => {
    // console.log("Creating announcement:", newAnnouncement)

    const newId = Math.max(...announcements.map((a) => a.id), 0) + 1
    const announcement = {
      id: newId,
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      author: user?.name || "Anonymous",
      authorRole: user?.role || "User",
      authorAvatar: "/placeholder-wb2g6.png",
      publishedAt: new Date().toISOString(),
      category: newAnnouncement.category,
      priority: newAnnouncement.priority,
      isPinned: newAnnouncement.isPinned,
      likes: 0,
      comments: 0,
      tags: newAnnouncement.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    }

    const updatedAnnouncements = [announcement, ...announcements]
    setAnnouncements(updatedAnnouncements)
    localStorage.setItem("announcements", JSON.stringify(updatedAnnouncements))

    setNewAnnouncement({
      title: "",
      content: "",
      category: "",
      priority: "medium",
      isPinned: false,
      tags: "",
    })
    setIsCreateModalOpen(false)
  }

  const handleEditAnnouncement = (announcement: any) => {
    setEditingAnnouncement({
      ...announcement,
      tags: announcement.tags.join(", "),
    })
    setIsEditModalOpen(true)
  }

  const handleUpdateAnnouncement = () => {
    // console.log("Updating announcement:", editingAnnouncement)

    const updatedAnnouncements = announcements.map((announcement) =>
      announcement.id === editingAnnouncement.id
        ? {
            ...announcement,
            title: editingAnnouncement.title,
            content: editingAnnouncement.content,
            category: editingAnnouncement.category,
            priority: editingAnnouncement.priority,
            isPinned: editingAnnouncement.isPinned,
            tags: editingAnnouncement.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag),
          }
        : announcement,
    )

    setAnnouncements(updatedAnnouncements)
    localStorage.setItem("announcements", JSON.stringify(updatedAnnouncements))

    setIsEditModalOpen(false)
    setEditingAnnouncement(null)
  }

  const handleDeleteAnnouncement = (announcement: any) => {
    setDeletingAnnouncement(announcement)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteAnnouncement = () => {
    // console.log("Deleting announcement:", deletingAnnouncement)

    const updatedAnnouncements = announcements.filter((announcement) => announcement.id !== deletingAnnouncement.id)

    setAnnouncements(updatedAnnouncements)
    localStorage.setItem("announcements", JSON.stringify(updatedAnnouncements))

    setIsDeleteDialogOpen(false)
    setDeletingAnnouncement(null)
  }

  const handleLike = (announcementId: number) => {
    const currentUser = "Current User" // In a real app, this would come from auth context
    const currentState = announcementLikes[announcementId] || { users: [], currentUserLiked: false }

    let newUsers = [...currentState.users]
    const newCurrentUserLiked = !currentState.currentUserLiked

    if (newCurrentUserLiked) {
      // Add user to likes list if not already there
      if (!newUsers.includes(currentUser)) {
        newUsers.push(currentUser)
      }
    } else {
      // Remove user from likes list
      newUsers = newUsers.filter((user) => user !== currentUser)
    }

    const updatedLikes = {
      ...announcementLikes,
      [announcementId]: { users: newUsers, currentUserLiked: newCurrentUserLiked },
    }

    setAnnouncementLikes(updatedLikes)

    // Save to localStorage
    localStorage.setItem("announcement_likes", JSON.stringify(updatedLikes))
  }

  const handleComment = (announcementId: number) => {
    setShowComments({
      ...showComments,
      [announcementId]: !showComments[announcementId],
    })
  }

  const handleShare = async (announcement: any) => {
    try {
      // Check if Web Share API is available and supported
      if (navigator.share && navigator.canShare) {
        const shareData = {
          title: announcement.title,
          text: announcement.content,
          url: window.location.href,
        }

        if (navigator.canShare(shareData)) {
          await navigator.share(shareData)
          return
        }
      }

      // Fallback: copy to clipboard with better formatting
      const shareText = `📢 ${announcement.title}\n\n${announcement.content}\n\n🔗 Shared from Munus Hub: ${window.location.href}`

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText)
        // Show success message
        const button = document.activeElement as HTMLElement
        const originalText = button.textContent
        button.textContent = "Copied!"
        setTimeout(() => {
          if (button.textContent === "Copied!") {
            button.textContent = originalText
          }
        }, 2000)
      } else {
        // Final fallback for older browsers
        const textArea = document.createElement("textarea")
        textArea.value = shareText
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
        alert("Announcement copied to clipboard!")
      }
    } catch (error) {
      // console.log("Error sharing:", error)
      alert("Unable to share. Please try copying the content manually.")
    }
  }

  const getLikeData = (announcementId: number, defaultCount: number) => {
    const likeData = announcementLikes[announcementId] || { users: [], currentUserLiked: false }
    return {
      liked: likeData.currentUserLiked,
      count: likeData.users.length || defaultCount,
      users: likeData.users,
    }
  }

  const toggleLikesList = (announcementId: number) => {
    setShowLikesList((prev) => ({
      ...prev,
      [announcementId]: !prev[announcementId],
    }))
  }

  const renderAdminButtons = (announcement: any) => (
    <AdminOnly>
      <div className="flex gap-2 ml-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleEditAnnouncement(announcement)}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDeleteAnnouncement(announcement)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Delete
        </Button>
      </div>
    </AdminOnly>
  )

  const renderCommentSection = (announcement: any) =>
    showComments[announcement.id] && (
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="space-y-3">
          {/* Display existing comments */}
          {announcement.commentsList?.map((comment: any) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.authorAvatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {comment.author
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium">{comment.author}</p>
                  <p className="text-sm text-gray-600">{comment.content}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(comment.timestamp)}</p>
              </div>
            </div>
          ))}

          {/* Default sample comment if no comments exist */}
          {(!announcement.commentsList || announcement.commentsList.length === 0) && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/team-member-1.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-sm text-gray-600">
                    {announcement.isPinned
                      ? "Great news! Looking forward to this."
                      : "Thanks for sharing this information!"}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>
          )}

          {/* New comment input */}
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Write a comment..."
                className="text-sm"
                value={newComments[announcement.id] || ""}
                onChange={(e) => handleCommentChange(announcement.id, e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddComment(announcement.id)
                  }
                }}
              />
              <Button
                size="sm"
                onClick={() => handleAddComment(announcement.id)}
                disabled={!newComments[announcement.id]?.trim()}
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    )

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
              <Button
                variant="ghost"
                className="gap-2 bg-primary/5 text-primary hover:bg-primary/10 h-10 px-4 font-medium"
              >
                <Bell className="h-4 w-4" />
                Announcements
              </Button>
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
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 bg-primary/5 text-primary hover:bg-primary/10 h-12 px-4 font-medium"
              >
                <Bell className="h-4 w-4" />
                Announcements
              </Button>
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
      <main className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Announcements</h2>
              <p className="text-gray-600">Stay updated with company news and important information</p>
            </div>
            <AdminOnly>
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Megaphone className="h-4 w-4 mr-2" />
                    Create Announcement
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Announcement</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newAnnouncement.title}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                        placeholder="Enter announcement title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={newAnnouncement.content}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                        placeholder="Enter announcement content"
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={newAnnouncement.category}
                          onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Company News">Company News</SelectItem>
                            <SelectItem value="HR Policy">HR Policy</SelectItem>
                            <SelectItem value="Events">Events</SelectItem>
                            <SelectItem value="Security">Security</SelectItem>
                            <SelectItem value="Recognition">Recognition</SelectItem>
                            <SelectItem value="Benefits">Benefits</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={newAnnouncement.priority}
                          onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, priority: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={newAnnouncement.tags}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, tags: e.target.value })}
                        placeholder="e.g. meeting, important, deadline"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="pinned"
                        checked={newAnnouncement.isPinned}
                        onCheckedChange={(checked) => setNewAnnouncement({ ...newAnnouncement, isPinned: !!checked })}
                      />
                      <Label htmlFor="pinned">Pin this announcement</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateAnnouncement}>Create Announcement</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </AdminOnly>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search announcements..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="company-news">Company News</SelectItem>
                <SelectItem value="hr-policy">HR Policy</SelectItem>
                <SelectItem value="events">Events</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="recognition">Recognition</SelectItem>
                <SelectItem value="benefits">Benefits</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                All Announcements
              </TabsTrigger>
              <TabsTrigger
                value="pinned"
                className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                Pinned
              </TabsTrigger>
              <TabsTrigger
                value="recent"
                className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                Recent
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {pinnedAnnouncements.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Pin className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">Pinned Announcements</h3>
                  </div>
                  {pinnedAnnouncements.map((announcement) => (
                    <Card
                      key={announcement.id}
                      className={`border-l-4 border-l-accent ${highlightedAnnouncement === announcement.id ? "bg-yellow-50" : ""}`}
                      id={`announcement-${announcement.id}`}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={announcement.authorAvatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {announcement.author
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <CardTitle className="text-lg">{announcement.title}</CardTitle>
                                <Pin className="h-4 w-4 text-accent" />
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                <span className="font-medium">{announcement.author}</span>
                                <span>•</span>
                                <span>{announcement.authorRole}</span>
                                <span>•</span>
                                <span>{formatTimeAgo(announcement.publishedAt)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getCategoryColor(announcement.category)}>{announcement.category}</Badge>
                            <Badge className={getPriorityColor(announcement.priority)}>
                              {getPriorityIcon(announcement.priority)}
                              <span className="ml-1 capitalize">{announcement.priority}</span>
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground mb-4 leading-relaxed">{announcement.content}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-4">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`gap-2 ${getLikeData(announcement.id, announcement.likes).liked ? "text-red-500" : ""}`}
                                onClick={() => handleLike(announcement.id)}
                              >
                                <Heart
                                  className={`h-4 w-4 ${getLikeData(announcement.id, announcement.likes).liked ? "fill-current" : ""}`}
                                />
                                {getLikeData(announcement.id, announcement.likes).count}
                              </Button>

                              {getLikeData(announcement.id, announcement.likes).count > 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleLikesList(announcement.id)}
                                  className="text-xs text-muted-foreground hover:text-foreground"
                                >
                                  Show who liked
                                </Button>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-2"
                              onClick={() => handleComment(announcement.id)}
                            >
                              {/* Fixed message count to only use commentsList length, removing double counting */}
                              <MessageSquare className="h-4 w-4" />
                              {announcement.commentsList?.length || 0}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-2"
                              onClick={() => handleShare(announcement)}
                            >
                              <Share2 className="h-4 w-4" />
                              Share
                            </Button>
                            {renderAdminButtons(announcement)}
                          </div>
                          <div className="flex gap-1">
                            {announcement.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {showLikesList[announcement.id] &&
                          getLikeData(announcement.id, announcement.likes).users.length > 0 && (
                            <div className="mt-2 p-3 bg-muted rounded-lg">
                              <p className="text-sm font-medium mb-2">Liked by:</p>
                              <div className="flex flex-wrap gap-2">
                                {getLikeData(announcement.id, announcement.likes).users.map((user, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {user}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        {renderCommentSection(announcement)}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="space-y-4">
                {pinnedAnnouncements.length > 0 && <h3 className="text-lg font-semibold">Recent Announcements</h3>}
                {regularAnnouncements.map((announcement) => (
                  <Card
                    key={announcement.id}
                    className={`${highlightedAnnouncement === announcement.id ? "bg-yellow-50" : ""}`}
                    id={`announcement-${announcement.id}`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={announcement.authorAvatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {announcement.author
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-1">{announcement.title}</CardTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              <span className="font-medium">{announcement.author}</span>
                              <span>•</span>
                              <span>{announcement.authorRole}</span>
                              <span>•</span>
                              <span>{formatTimeAgo(announcement.publishedAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getCategoryColor(announcement.category)}>{announcement.category}</Badge>
                          <Badge className={getPriorityColor(announcement.priority)}>
                            {getPriorityIcon(announcement.priority)}
                            <span className="ml-1 capitalize">{announcement.priority}</span>
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground mb-4 leading-relaxed">{announcement.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`gap-2 ${getLikeData(announcement.id, announcement.likes).liked ? "text-red-500" : ""}`}
                              onClick={() => handleLike(announcement.id)}
                            >
                              <Heart
                                className={`h-4 w-4 ${getLikeData(announcement.id, announcement.likes).liked ? "fill-current" : ""}`}
                              />
                              {getLikeData(announcement.id, announcement.likes).count}
                            </Button>

                            {getLikeData(announcement.id, announcement.likes).count > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleLikesList(announcement.id)}
                                className="text-xs text-muted-foreground hover:text-foreground"
                              >
                                Show who liked
                              </Button>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2"
                            onClick={() => handleComment(announcement.id)}
                          >
                            {/* Fixed message count to only use commentsList length, removing double counting */}
                            <MessageSquare className="h-4 w-4" />
                            {announcement.commentsList?.length || 0}
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-2" onClick={() => handleShare(announcement)}>
                            <Share2 className="h-4 w-4" />
                            Share
                          </Button>
                          {renderAdminButtons(announcement)}
                        </div>
                        <div className="flex gap-1">
                          {announcement.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {showLikesList[announcement.id] &&
                        getLikeData(announcement.id, announcement.likes).users.length > 0 && (
                          <div className="mt-2 p-3 bg-muted rounded-lg">
                            <p className="text-sm font-medium mb-2">Liked by:</p>
                            <div className="flex flex-wrap gap-2">
                              {getLikeData(announcement.id, announcement.likes).users.map((user, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {user}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      {renderCommentSection(announcement)}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pinned" className="space-y-4">
              {pinnedAnnouncements.map((announcement) => (
                <Card
                  key={announcement.id}
                  className={`border-l-4 border-l-accent ${highlightedAnnouncement === announcement.id ? "bg-yellow-50" : ""}`}
                  id={`announcement-${announcement.id}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={announcement.authorAvatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {announcement.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-lg">{announcement.title}</CardTitle>
                            <Pin className="h-4 w-4 text-accent" />
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <span className="font-medium">{announcement.author}</span>
                            <span>•</span>
                            <span>{announcement.authorRole}</span>
                            <span>•</span>
                            <span>{formatTimeAgo(announcement.publishedAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getCategoryColor(announcement.category)}>{announcement.category}</Badge>
                        <Badge className={getPriorityColor(announcement.priority)}>
                          {getPriorityIcon(announcement.priority)}
                          <span className="ml-1 capitalize">{announcement.priority}</span>
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground mb-4 leading-relaxed">{announcement.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`gap-2 ${getLikeData(announcement.id, announcement.likes).liked ? "text-red-500" : ""}`}
                            onClick={() => handleLike(announcement.id)}
                          >
                            <Heart
                              className={`h-4 w-4 ${getLikeData(announcement.id, announcement.likes).liked ? "fill-current" : ""}`}
                            />
                            {getLikeData(announcement.id, announcement.likes).count}
                          </Button>

                          {getLikeData(announcement.id, announcement.likes).count > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleLikesList(announcement.id)}
                              className="text-xs text-muted-foreground hover:text-foreground"
                            >
                              Show who liked
                            </Button>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleComment(announcement.id)}
                        >
                          {/* Fixed message count to only use commentsList length, removing double counting */}
                          <MessageSquare className="h-4 w-4" />
                          {announcement.commentsList?.length || 0}
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2" onClick={() => handleShare(announcement)}>
                          <Share2 className="h-4 w-4" />
                          Share
                        </Button>
                        {renderAdminButtons(announcement)}
                      </div>
                      <div className="flex gap-1">
                        {announcement.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="recent" className="space-y-4">
              {announcements.slice(0, 3).map((announcement) => (
                <Card
                  key={announcement.id}
                  className={`${highlightedAnnouncement === announcement.id ? "bg-yellow-50" : ""}`}
                  id={`announcement-${announcement.id}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={announcement.authorAvatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {announcement.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{announcement.title}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <span className="font-medium">{announcement.author}</span>
                            <span>•</span>
                            <span>{announcement.authorRole}</span>
                            <span>•</span>
                            <span>{formatTimeAgo(announcement.publishedAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getCategoryColor(announcement.category)}>{announcement.category}</Badge>
                        <Badge className={getPriorityColor(announcement.priority)}>
                          {getPriorityIcon(announcement.priority)}
                          <span className="ml-1 capitalize">{announcement.priority}</span>
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground mb-4 leading-relaxed">{announcement.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4">
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Heart className="h-4 w-4" />
                          {announcement.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <MessageSquare className="h-4 w-4" />
                          {announcement.comments}
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Share2 className="h-4 w-4" />
                          Share
                        </Button>
                        {renderAdminButtons(announcement)}
                      </div>
                      <div className="flex gap-1">
                        {announcement.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
          </DialogHeader>
          {editingAnnouncement && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingAnnouncement.title}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
                  placeholder="Enter announcement title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  value={editingAnnouncement.content}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, content: e.target.value })}
                  placeholder="Enter announcement content"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={editingAnnouncement.category}
                    onValueChange={(value) => setEditingAnnouncement({ ...editingAnnouncement, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Company News">Company News</SelectItem>
                      <SelectItem value="HR Policy">HR Policy</SelectItem>
                      <SelectItem value="Events">Events</SelectItem>
                      <SelectItem value="Security">Security</SelectItem>
                      <SelectItem value="Recognition">Recognition</SelectItem>
                      <SelectItem value="Benefits">Benefits</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Select
                    value={editingAnnouncement.priority}
                    onChange={(value) => setEditingAnnouncement({ ...editingAnnouncement, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
                <Input
                  id="edit-tags"
                  value={editingAnnouncement.tags}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, tags: e.target.value })}
                  placeholder="e.g. meeting, important, deadline"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-pinned"
                  checked={editingAnnouncement.isPinned}
                  onCheckedChange={(checked) => setEditingAnnouncement({ ...editingAnnouncement, isPinned: !!checked })}
                />
                <Label htmlFor="edit-pinned">Pin this announcement</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateAnnouncement}>Update Announcement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Announcement</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete "{deletingAnnouncement?.title}"? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteAnnouncement}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
