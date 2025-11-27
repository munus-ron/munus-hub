"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, Users, Bell, FolderOpen, Clock, TrendingUp, Menu, LogOut, Settings } from "lucide-react";
import { LoginModal } from "@/components/login-modal";
import { AdminOnly } from "@/components/admin-only";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProjects } from "@/app/actions/projects";
import { getTeamMembers } from "@/app/actions/team";
import { getAnnouncements } from "@/app/actions/announcements";
import { getCalendarEvents } from "@/app/actions/calendar";
import LoginSSOButton from "@/components/login-sso-button";
import UserProfile from "@/components/user-profile";

export default function Dashboard() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showManageUsersModal, setShowManageUsersModal] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    department: "",
    position: "",
  });

  const [users, setUsers] = useState([]);

  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    activeProjects: 0,
    teamMembers: 0,
    upcomingEvents: 0,
    pendingTasks: 0,
  });

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const announcements = await getAnnouncements();
        const sortedAnnouncements = announcements.slice(0, 2);
        setRecentAnnouncements(sortedAnnouncements);
      } catch (error) {
        console.error("Error loading announcements:", error);
        setRecentAnnouncements([]);
      }
    };

    loadAnnouncements();
  }, []);

  useEffect(() => {
    const loadRecentProjects = async () => {
      try {
        const projects = await getProjects();
        const sortedProjects = projects.slice(0, 3);
        setRecentProjects(sortedProjects);
      } catch (error) {
        console.error("Error loading recent projects:", error);
        setRecentProjects([]);
      }
    };

    loadRecentProjects();
  }, []);

  useEffect(() => {
    const calculateStats = async () => {
      try {
        const [projects, teamData, events] = await Promise.all([getProjects(), getTeamMembers(), getCalendarEvents()]);

        const activeProjectsCount = projects.filter((project) => project.status && project.status !== "Complete" && project.status !== "Completed").length;

        const totalTeamMembers = (teamData.founders?.length || 0) + (teamData.advisors?.length || 0) + (teamData.consultants?.length || 0);

        const now = new Date();
        const upcomingEventsCount = events.filter((event) => {
          const eventDate = new Date(event.start_time);
          return eventDate > now;
        }).length;

        let pendingTasksCount = 0;
        projects.forEach((project) => {
          if (project.milestones) {
            project.milestones.forEach((milestone) => {
              if (milestone.endDate || milestone.end_date) {
                const dueDate = new Date(milestone.endDate || milestone.end_date);
                const daysDiff = (dueDate - now) / (1000 * 60 * 60 * 24);
                if (daysDiff >= 0 && daysDiff <= 7 && milestone.status !== "completed" && milestone.status !== "done") {
                  pendingTasksCount++;
                }
              }
            });
          }
        });

        setDashboardStats({
          activeProjects: activeProjectsCount,
          teamMembers: totalTeamMembers,
          upcomingEvents: upcomingEventsCount,
          pendingTasks: pendingTasksCount,
        });
      } catch (error) {
        console.error("Error calculating dashboard stats:", error);
        setDashboardStats({
          activeProjects: 0,
          teamMembers: 0,
          upcomingEvents: 0,
          pendingTasks: 0,
        });
      }
    };

    calculateStats();
  }, []);

  useEffect(() => {
    const generateNotifications = async () => {
      const notificationsList = [];
      const now = new Date();

      try {
        const [announcements, events, projects] = await Promise.all([getAnnouncements(), getCalendarEvents(), getProjects()]);

        const recentAnnouncements = announcements.filter((announcement) => {
          const announcementDate = new Date(announcement.date);
          const daysDiff = (now - announcementDate) / (1000 * 60 * 60 * 24);
          return daysDiff <= 7;
        });

        recentAnnouncements.forEach((announcement) => {
          notificationsList.push({
            id: `announcement-${announcement.id}`,
            type: "announcement",
            title: "New Announcement",
            message: announcement.title,
            time: announcement.date,
            icon: "bell",
            link: `/announcements?highlight=${announcement.id}`,
          });
        });

        const upcomingEventsList = events.filter((event) => {
          const eventDate = new Date(event.start_time);
          const daysDiff = (eventDate - now) / (1000 * 60 * 60 * 24);
          return daysDiff >= 0 && daysDiff <= 7;
        });

        upcomingEventsList.forEach((event) => {
          notificationsList.push({
            id: `event-${event.id}`,
            type: "event",
            title: "Upcoming Event",
            message: event.title,
            time: event.start_time,
            icon: "calendar",
            link: "/calendar",
          });
        });

        projects.forEach((project) => {
          if (project.milestones) {
            project.milestones.forEach((milestone) => {
              if (milestone.endDate || milestone.end_date) {
                const dueDate = new Date(milestone.endDate || milestone.end_date);
                const daysDiff = (dueDate - now) / (1000 * 60 * 60 * 24);
                if (daysDiff >= 0 && daysDiff <= 7 && milestone.status !== "completed") {
                  notificationsList.push({
                    id: `milestone-${project.id}-${milestone.name || milestone.title}`,
                    type: "milestone",
                    title: "Milestone Due Soon",
                    message: `${milestone.name || milestone.title} in ${project.title}`,
                    time: milestone.endDate || milestone.end_date,
                    icon: "clock",
                    link: `/projects/${project.id}`,
                  });
                }
              }
            });
          }
        });

        notificationsList.sort((a, b) => new Date(b.time) - new Date(a.time));

        const limitedNotifications = notificationsList.slice(0, 10);

        setNotifications(limitedNotifications);
        setUnreadCount(limitedNotifications.length);
      } catch (error) {
        console.error("Error generating notifications:", error);
        setNotifications([]);
        setUnreadCount(0);
      }
    };

    generateNotifications();
  }, []);

  useEffect(() => {
    const loadUpcomingEvents = async () => {
      try {
        const events = await getCalendarEvents();
        const now = new Date();

        // Filter to show only future events
        const futureEvents = events.filter((event) => {
          const eventDate = new Date(event.start_time);
          return eventDate > now;
        });

        // Sort by date (earliest first) and take first 6
        const sortedEvents = futureEvents.sort((a, b) => new Date(a.start_time) - new Date(b.start_time)).slice(0, 6);

        setUpcomingEvents(sortedEvents);
      } catch (error) {
        console.error("Error loading upcoming events:", error);
        setUpcomingEvents([]);
      }
    };

    loadUpcomingEvents();
  }, []);

  const handleSaveUser = () => {
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...newUser, id: editingUser.id } : u)));
      console.log("[v0] Updated user:", newUser);
      alert(`User ${newUser.name} has been updated successfully!`);
    } else {
      const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      setUsers([...users, { ...newUser, id: newId, status: "active" }]);
      console.log("[v0] Added new user:", newUser);
      alert(`User ${newUser.name} has been added successfully!`);
    }

    setNewUser({
      name: "",
      email: "",
      password: "",
      role: "user",
      department: "",
      position: "",
    });
    setEditingUser(null);
    setShowUserForm(false);
  };

  const handleEditUser = (userToEdit) => {
    setEditingUser(userToEdit);
    setNewUser({
      name: userToEdit.name,
      email: userToEdit.email,
      password: "",
      role: userToEdit.role,
      department: userToEdit.department,
      position: userToEdit.position,
    });
    setShowUserForm(true);
  };

  const handleDeleteUser = (userId) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((u) => u.id !== userId));
      console.log("[v0] Deleted user with ID:", userId);
      alert("User has been deleted successfully!");
    }
  };

  const resetUserForm = () => {
    setNewUser({
      name: "",
      email: "",
      password: "",
      role: "user",
      department: "",
      position: "",
    });
    setEditingUser(null);
    setShowUserForm(false);
  };

  const getRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString();
  };

  const getNotificationTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "announcement":
        return <Bell className="h-4 w-4 text-blue-500" />;
      case "event":
        return <Calendar className="h-4 w-4 text-green-500" />;
      case "milestone":
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleNotificationClick = (notification) => {
    setShowNotifications(false);
    router.push(notification.link);
  };

  const markAllAsRead = () => {
    setUnreadCount(0);
    setShowNotifications(false);
  };

  const handleAnnouncementClick = (announcementId) => {
    router.push(`/announcements?highlight=${announcementId}`);
  };

  const handleProjectClickById = (projectId) => {
    router.push(`/projects/${projectId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-chart-3 text-white";
      case "Active":
        return "bg-primary text-white";
      case "Planning":
        return "border-gray-300 text-gray-700";
      case "Complete":
      case "Completed":
        return "bg-green-500 text-white";
      default:
        return "border-gray-300 text-gray-700";
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case "meeting":
        return <Calendar className="h-5 w-5 text-primary" />;
      case "deadline":
        return <Clock className="h-5 w-5 text-red-500" />;
      case "training":
        return <Users className="h-5 w-5 text-blue-500" />;
      default:
        return <Calendar className="h-5 w-5 text-primary" />;
    }
  };

  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <Card className="border-gray-100 shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <img
                  src="/munus-logo.jpg"
                  alt="Munus Logo"
                  className="h-12 w-auto"
                />
                <span className="text-3xl font-bold text-gray-900 font-serif">Munus Hub</span>
              </div>
              <CardDescription className="text-lg">Please sign in to access your workspace</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-y-2.5">
              <Button
                onClick={() => setShowLoginModal(true)}
                className="w-full text-lg py-6"
              >
                Sign In
              </Button>
              <LoginSSOButton />
            </CardContent>
          </Card>
        </div>
        <LoginModal
          open={showLoginModal}
          onOpenChange={setShowLoginModal}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white">
        <div className="flex h-20 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <img
                  src="/munus-logo.jpg"
                  alt="Munus Logo"
                  className="h-8 w-auto"
                />
                <span className="text-2xl md:text-3xl font-bold text-gray-900 font-serif">Munus Hub</span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-1 ml-8">
              <Button
                variant="ghost"
                className="gap-2 bg-primary text-white hover:bg-primary/90 h-10 px-4 font-medium"
              >
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

            <Popover
              open={showNotifications}
              onOpenChange={setShowNotifications}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-primary relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 p-0"
                align="end"
              >
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-xs text-primary"
                      >
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
                      <Bell className="h-8 w-8 mx-auto mb-4 text-gray-300" />
                      <p className="text-sm">No notifications</p>
                    </div>
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="p-3 border-t">
                    <Link href="/announcements">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs text-primary"
                      >
                        View all announcements
                      </Button>
                    </Link>
                  </div>
                )}
              </PopoverContent>
            </Popover>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 md:h-10 md:w-10">
                <UserProfile />
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
            <nav className="px-4 py-4 space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 bg-primary text-white hover:bg-primary/90 h-12 px-4 font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                <TrendingUp className="h-5 w-5" />
                Dashboard
              </Button>
              <Link
                href="/projects"
                onClick={() => setShowMobileMenu(false)}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-50 hover:text-primary h-12 px-4 font-medium"
                >
                  <FolderOpen className="h-5 w-5" />
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
                  <Calendar className="h-5 w-5" />
                  Calendar
                </Button>
              </Link>
              <Link
                href="/announcements"
                onClick={() => setShowMobileMenu(false)}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-50 hover:text-primary h-12 px-4 font-medium"
                >
                  <Bell className="h-5 w-5" />
                  Announcements
                </Button>
              </Link>
              <Link
                href="/team"
                onClick={() => setShowMobileMenu(false)}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-50 hover:text-primary h-12 px-4 font-medium"
                >
                  <Users className="h-5 w-5" />
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
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">Welcome back, {user?.name?.split(" ")[0]}!</h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6 md:mb-8">
              Our Munus Hub brings together all your essential tools and information in one centralized location, making collaboration seamless and productivity
              effortless.
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

          <div className="bg-green-50 rounded-3xl p-6 md:p-12 mb-12 md:mb-16">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6 font-serif">Streamline Your Workflow</h3>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6 md:mb-8">
                Access your projects, calendar, team information, and announcements all in one place. Stay organized and keep your team aligned with real-time
                updates.
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
                <CardTitle className="text-2xl lg:text-3xl font-semibold text-gray-900 font-serif">Recent Projects</CardTitle>
                <CardDescription className="text-gray-600 text-base lg:text-sm">Latest project updates and milestones</CardDescription>
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
                          <FolderOpen className={`h-6 w-6 ${index === 0 ? "text-primary" : index === 1 ? "text-secondary" : "text-chart-4"}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg lg:text-xl">{project.title}</h4>
                          <p className="text-gray-600">{project.team?.length || 0} team members</p>
                          {project.description && (
                            <p className="text-sm lg:text-xs text-gray-500 mt-1">
                              {project.description.length > 60 ? `${project.description.substring(0, 60)}...` : project.description}
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
                <CardTitle className="text-2xl lg:text-3xl font-semibold text-gray-900 font-serif">Recent Announcements</CardTitle>
                <CardDescription className="text-gray-600 text-base lg:text-sm">Latest company news and updates</CardDescription>
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
                            {announcement.content.length > 80 ? `${announcement.content.substring(0, 80)}...` : announcement.content}
                          </p>
                          <p className="text-sm lg:text-xs text-gray-500">
                            {announcement.author} • {getRelativeTime(announcement.date)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
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
              <CardTitle className="text-xl lg:text-2xl font-semibold text-gray-900 font-serif">Upcoming Events & Deadlines</CardTitle>
              <CardDescription className="text-gray-600 text-sm md:text-base">Important dates and milestones to keep track of</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-6 border border-gray-100 rounded-xl hover:border-primary/20 transition-colors cursor-pointer"
                      onClick={() => router.push("/calendar")}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        {getEventTypeIcon(event.type)}
                        <span className="text-sm md:text-base font-semibold text-gray-700">{formatEventDate(event.start_time)}</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-lg lg:text-xl mb-2">{event.title}</h4>
                      <p className="text-gray-600 leading-relaxed">
                        {event.description
                          ? event.description.length > 80
                            ? `${event.description.substring(0, 80)}...`
                            : event.description
                          : "No description"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No upcoming events</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
