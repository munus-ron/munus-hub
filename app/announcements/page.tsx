"use client";

import { DialogTrigger } from "@/components/ui/dialog";

import { CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogFooter as UIDialogFooter,
  DialogHeader as UIDialogHeader,
  DialogTitle as UIDialogTitle,
  DialogContent as UIDialogContent,
} from "@/components/ui/dialog";
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
  Edit,
  Trash2,
} from "lucide-react";
import AdminOnly from "@/components/admin-only";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { usePermissions } from "@/hooks/use-permissions";

import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  addComment, // Added import for addComment action
  toggleLike, // Import toggleLike action
} from "@/app/actions/announcements";
import UserProfile from "@/components/user-profile";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);
  const [deletingAnnouncement, setDeletingAnnouncement] = useState<any>(null);
  // const [announcementLikes, setAnnouncementLikes] = useState<{
  //   [key: number]: { users: string[]; currentUserLiked: boolean }
  // }>({})
  const [showLikesList, setShowLikesList] = useState<{ [key: number]: boolean }>({});
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>({});
  const [showAllComments, setShowAllComments] = useState<{ [key: number]: boolean }>({});
  const [newComments, setNewComments] = useState<{ [key: number]: string }>({});
  const [highlightedAnnouncement, setHighlightedAnnouncement] = useState<number | null>(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    category: "",
    priority: "medium",
    isPinned: false,
    tags: "",
    date: new Date().toISOString().split("T")[0], // Format: YYYY-MM-DD
  });
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const { user, logout, isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("highlight");
  const { canEditAnnouncements, canEditItem, isAdministrator } = usePermissions();

  useEffect(() => {
    async function loadAnnouncements() {
      const announcementsData = await getAnnouncements();
      console.log("[v0] Announcements loaded from database:", announcementsData);
      setAnnouncements(announcementsData);
    }
    loadAnnouncements();
  }, []);

  useEffect(() => {
    if (highlightId) {
      const id = Number.parseInt(highlightId);
      setHighlightedAnnouncement(id);
      // Auto-scroll to highlighted announcement after a short delay
      setTimeout(() => {
        const element = document.getElementById(`announcement-${id}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 500);
      // Remove highlight after 3 seconds
      setTimeout(() => {
        setHighlightedAnnouncement(null);
      }, 3000);
    }
  }, [highlightId]); // Use extracted highlightId instead of searchParams

  function getPriorityColor(priority: string) {
    switch (priority) {
      case "critical":
        return "bg-destructive text-destructive-foreground";
      case "high":
        return "bg-chart-3 text-white";
      case "medium":
        return "bg-secondary text-secondary-foreground";
      case "low":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  }

  function getPriorityIcon(priority: string) {
    switch (priority) {
      case "critical":
        return <AlertCircle className="h-4 w-4" />;
      case "high":
        return <Info className="h-4 w-4" />;
      case "medium":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  }

  function getCategoryColor(category: string) {
    switch (category) {
      case "Company News":
        return "bg-primary text-primary-foreground";
      case "HR Policy":
        return "bg-chart-4 text-white";
      case "Events":
        return "bg-accent text-accent-foreground";
      case "Security":
        return "bg-destructive text-destructive-foreground";
      case "Recognition":
        return "bg-chart-2 text-white";
      case "Benefits":
        return "bg-chart-1 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  }

  function formatTimeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
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
    );
  }

  const pinnedAnnouncements = announcements.filter((a) => a.isPinned);
  const regularAnnouncements = announcements.filter((a) => !a.isPinned);

  const handleAddComment = async (announcementId: number) => {
    // Made function async
    const commentText = newComments[announcementId]?.trim();
    if (!commentText) return;

    try {
      await addComment(announcementId, {
        author: user?.name || "Anonymous",
        content: commentText,
      });

      // Reload announcements from database to get updated comments
      const updatedAnnouncements = await getAnnouncements();
      setAnnouncements(updatedAnnouncements);

      // Clear the comment input
      setNewComments({
        ...newComments,
        [announcementId]: "",
      });
    } catch (error) {
      console.error("[v0] Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    }
  };

  const handleCommentChange = (announcementId: number, value: string) => {
    setNewComments({
      ...newComments,
      [announcementId]: value,
    });
  };

  const handleCreateAnnouncement = async () => {
    console.log("Creating announcement:", newAnnouncement);

    await createAnnouncement({
      ...newAnnouncement,
      author: user?.name || "Anonymous",
      authorRole: user?.role || "User",
      authorAvatar: "/placeholder-wb2g6.png",
      category: newAnnouncement.category,
      date: newAnnouncement.date,
      tags: newAnnouncement.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    });

    // Reload announcements from database
    const updatedAnnouncements = await getAnnouncements();
    setAnnouncements(updatedAnnouncements);

    setNewAnnouncement({
      title: "",
      content: "",
      category: "",
      priority: "medium",
      isPinned: false,
      tags: "",
      date: new Date().toISOString().split("T")[0],
    });
    setIsCreateModalOpen(false);
  };

  const handleEditAnnouncement = (announcement: any) => {
    setEditingAnnouncement({
      ...announcement,
      tags: announcement.tags ? announcement.tags.join(", ") : "",
      date: announcement.date ? new Date(announcement.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateAnnouncement = async () => {
    console.log("Updating announcement:", editingAnnouncement);

    await updateAnnouncement(editingAnnouncement.id, {
      title: editingAnnouncement.title,
      content: editingAnnouncement.content,
      category: editingAnnouncement.category,
      priority: editingAnnouncement.priority,
      isPinned: editingAnnouncement.isPinned,
      updatedBy: user?.name || "Anonymous", // Capture who edited it
      date: editingAnnouncement.date,
      tags: editingAnnouncement.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    });

    // Reload announcements from database
    const updatedAnnouncements = await getAnnouncements();
    setAnnouncements(updatedAnnouncements);

    setIsEditModalOpen(false);
    setEditingAnnouncement(null);
  };

  const handleDeleteAnnouncement = (announcement: any) => {
    setDeletingAnnouncement(announcement);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteAnnouncement = async () => {
    console.log("Deleting announcement:", deletingAnnouncement);

    if (!deletingAnnouncement) return;

    await deleteAnnouncement(deletingAnnouncement.id);

    // Reload announcements from database
    const updatedAnnouncements = await getAnnouncements();
    setAnnouncements(updatedAnnouncements);

    setIsDeleteDialogOpen(false);
    setDeletingAnnouncement(null);
  };

  const handleLike = async (announcementId: number) => {
    if (!user?.email || !user?.name) {
      alert("You must be logged in to like announcements");
      return;
    }

    const announcement = announcements.find((a) => a.id === announcementId);
    if (!announcement || !getLikeData(announcement).isEnabled) {
      alert("Likes feature is not yet available. Please contact your administrator to run the database migration script (023_create_announcement_likes.sql).");
      return;
    }

    try {
      const result = await toggleLike(announcementId, user.email, user.name);

      // If the likes table doesn't exist, show a helpful message
      if (result && !result.success) {
        console.log("[v0] Likes feature not available:", result.error);
        alert("Likes feature is not yet set up. Please contact your administrator to run the database migration script.");
        return;
      }

      // Reload announcements from database to get updated likes
      const updatedAnnouncements = await getAnnouncements();
      setAnnouncements(updatedAnnouncements);
    } catch (error) {
      console.error("[v0] Error toggling like:", error);
      alert("Failed to update like. Please try again.");
    }
  };

  const handleComment = (announcementId: number) => {
    setShowComments({
      ...showComments,
      [announcementId]: !showComments[announcementId],
    });
  };

  const handleShare = async (announcement: any) => {
    try {
      // Check if Web Share API is available and supported
      if (navigator.share && navigator.canShare) {
        const shareData = {
          title: announcement.title,
          text: announcement.content,
          url: window.location.href,
        };

        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
      }

      // Fallback: copy to clipboard with better formatting
      const shareText = `📢 ${announcement.title}\n\n${announcement.content}\n\n🔗 Shared from Munus Hub: ${window.location.href}`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText);
        // Show success message
        const button = document.activeElement as HTMLElement;
        const originalText = button.textContent;
        button.textContent = "Copied!";
        setTimeout(() => {
          if (button.textContent === "Copied!") {
            button.textContent = originalText;
          }
        }, 2000);
      } else {
        // Final fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = shareText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("Announcement details copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing announcement:", error);
      alert("Unable to share announcement. Please try again.");
    }
  };

  const getLikeData = (announcement: any) => {
    const likesList = announcement.likesList || [];
    const currentUserLiked = likesList.some((like: any) => like.user_email === user?.email);

    return {
      liked: currentUserLiked,
      count: likesList.length,
      users: likesList.map((like: any) => like.user_name),
      isEnabled: announcement.likesList !== undefined, // Feature is enabled if likesList exists
    };
  };

  const toggleLikesList = (announcementId: number) => {
    setShowLikesList((prev) => ({
      ...prev,
      [announcementId]: !prev[announcementId],
    }));
  };

  const toggleShowAllComments = (announcementId: number) => {
    setShowAllComments((prev) => ({
      ...prev,
      [announcementId]: !prev[announcementId],
    }));
  };

  const renderAdminButtons = (announcement: any) => {
    const canEdit = isAdministrator || (canEditAnnouncements && announcement.author === user?.name);

    return (
      <>
        {canEdit && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEditAnnouncement(announcement)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDeleteAnnouncement(announcement)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleShare(announcement)}
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        )}
      </>
    );
  };

  const renderCommentSection = (announcement: any) => (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">{announcement.commentsList?.length || 0} Comments</span>
      </div>
      {announcement.commentsList && announcement.commentsList.length > 0 && (
        <div className="space-y-3 mb-4">
          {(showAllComments[announcement.id] ? announcement.commentsList : announcement.commentsList.slice(0, 2)).map((comment: any) => {
            const authorName = typeof comment.author === "string" ? comment.author : String(comment.author || "Anonymous");
            const commentContent = typeof comment.content === "string" ? comment.content : String(comment.content || "");
            const commentDate = comment.date || comment.created_at;

            return (
              <div
                key={comment.id}
                className="flex gap-3"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.authorAvatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">
                    {authorName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{authorName}</span>
                    <span className="text-xs text-muted-foreground">{formatTimeAgo(commentDate)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{commentContent}</p>
                </div>
              </div>
            );
          })}
          {announcement.commentsList.length > 2 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => toggleShowAllComments(announcement.id)}
            >
              {showAllComments[announcement.id] ? "Show less" : `View all ${announcement.commentsList.length} comments`}
            </Button>
          )}
        </div>
      )}
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <UserProfile />
          <AvatarFallback className="text-xs">
            {user?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            placeholder="Add a comment..."
            className="h-auto resize-none"
            rows={1}
            value={newComments[announcement.id] || ""}
            onChange={(e) => handleCommentChange(announcement.id, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddComment(announcement.id);
              }
            }}
          />
        </div>
        <Button
          size="sm"
          onClick={() => handleAddComment(announcement.id)}
          disabled={!newComments[announcement.id]?.trim()}
        >
          Post
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white">
        <div className="flex h-20 items-center justify-between px-8">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <img
                src="/munus-logo.jpg"
                alt="Munus Logo"
                className="h-8 w-auto"
              />
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
                <UserProfile />
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
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-gray-600"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <nav className="px-4 py-2 space-y-1">
              <Link
                href="/"
                onClick={() => setShowMobileMenu(false)}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-50 hover:text-primary h-12 px-4 font-medium"
                >
                  <TrendingUp className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link
                href="/projects"
                onClick={() => setShowMobileMenu(false)}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-50 hover:text-primary h-12 px-4 font-medium"
                >
                  <FolderOpen className="h-4 w-4" />
                  Projects
                </Button>
              </Link>
              <Link
                href="/calendar"
                onClick={() => setShowMobileMenu(false)}
              >
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
              <Link
                href="/team"
                onClick={() => setShowMobileMenu(false)}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-50 hover:text-primary h-12 px-4 font-medium"
                >
                  <Users className="h-4 w-4" />
                  Team
                </Button>
              </Link>
              <AdminOnly>
                <Link
                  href="/admin"
                  onClick={() => setShowMobileMenu(false)}
                >
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
            {canEditAnnouncements && (
              <Dialog
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Megaphone className="h-4 w-4 mr-2" />
                    Create Announcement
                  </Button>
                </DialogTrigger>
                <UIDialogContent className="max-w-2xl">
                  <UIDialogHeader>
                    <UIDialogTitle>Create New Announcement</UIDialogTitle>
                  </UIDialogHeader>
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
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newAnnouncement.date}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, date: e.target.value })}
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
                  <UIDialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreateAnnouncement}>Create Announcement</Button>
                  </UIDialogFooter>
                </UIDialogContent>
              </Dialog>
            )}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search announcements..."
                className="pl-10"
              />
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
          <Tabs
            defaultValue="all"
            className="space-y-4"
          >
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

            <TabsContent
              value="all"
              className="space-y-6"
            >
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
                                className={`gap-2 ${getLikeData(announcement).liked ? "text-red-500" : ""}`}
                                onClick={() => handleLike(announcement.id)}
                              >
                                <Heart className={`h-4 w-4 ${getLikeData(announcement).liked ? "fill-current" : ""}`} />
                                {getLikeData(announcement).count}
                              </Button>

                              {getLikeData(announcement).count > 0 && (
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
                            {(announcement.tags || []).map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                              >
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {showLikesList[announcement.id] && getLikeData(announcement).users.length > 0 && (
                          <div className="mt-2 p-3 bg-muted rounded-lg">
                            <p className="text-sm font-medium mb-2">Liked by:</p>
                            <div className="flex flex-wrap gap-2">
                              {getLikeData(announcement).users.map((userName, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {userName}
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
                              className={`gap-2 ${getLikeData(announcement).liked ? "text-red-500" : ""}`}
                              onClick={() => handleLike(announcement.id)}
                            >
                              <Heart className={`h-4 w-4 ${getLikeData(announcement).liked ? "fill-current" : ""}`} />
                              {getLikeData(announcement).count}
                            </Button>

                            {getLikeData(announcement).count > 0 && (
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
                          {(announcement.tags || []).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {showLikesList[announcement.id] && getLikeData(announcement).users.length > 0 && (
                        <div className="mt-2 p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium mb-2">Liked by:</p>
                          <div className="flex flex-wrap gap-2">
                            {getLikeData(announcement).users.map((userName, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {userName}
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

            <TabsContent
              value="pinned"
              className="space-y-4"
            >
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
                            className={`gap-2 ${getLikeData(announcement).liked ? "text-red-500" : ""}`}
                            onClick={() => handleLike(announcement.id)}
                          >
                            <Heart className={`h-4 w-4 ${getLikeData(announcement).liked ? "fill-current" : ""}`} />
                            {getLikeData(announcement).count}
                          </Button>

                          {getLikeData(announcement).count > 0 && (
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
                        {(announcement.tags || []).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent
              value="recent"
              className="space-y-4"
            >
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
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`gap-2 ${getLikeData(announcement).liked ? "text-red-500" : ""}`}
                            onClick={() => handleLike(announcement.id)}
                          >
                            <Heart className={`h-4 w-4 ${getLikeData(announcement).liked ? "fill-current" : ""}`} />
                            {getLikeData(announcement).count}
                          </Button>

                          {getLikeData(announcement).count > 0 && (
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
                        {(announcement.tags || []).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {showLikesList[announcement.id] && getLikeData(announcement).users.length > 0 && (
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-2">Liked by:</p>
                        <div className="flex flex-wrap gap-2">
                          {getLikeData(announcement).users.map((userName, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {userName}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {renderCommentSection(announcement)}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Dialog
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      >
        <UIDialogContent className="max-w-2xl">
          <UIDialogHeader>
            <UIDialogTitle>Edit Announcement</UIDialogTitle>
          </UIDialogHeader>
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
              <div className="space-y-2">
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editingAnnouncement.date}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, date: e.target.value })}
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
                    onValueChange={(value) => setEditingAnnouncement({ ...editingAnnouncement, priority: value })} // Changed onChange to onValueChange
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
          <UIDialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateAnnouncement}>Update Announcement</Button>
          </UIDialogFooter>
        </UIDialogContent>
      </Dialog>

      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <UIDialogContent className="max-w-md">
          <UIDialogHeader>
            <UIDialogTitle>Delete Announcement</UIDialogTitle>
          </UIDialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">Are you sure you want to delete "{deletingAnnouncement?.title}"? This action cannot be undone.</p>
          </div>
          <UIDialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteAnnouncement}
            >
              Delete
            </Button>
          </UIDialogFooter>
        </UIDialogContent>
      </Dialog>
    </div>
  );
}
