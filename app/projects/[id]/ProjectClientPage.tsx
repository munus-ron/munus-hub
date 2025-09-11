"use client"

import type React from "react"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  Users,
  Clock,
  ArrowLeft,
  Edit,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Save,
  Plus,
  Trash2,
  UserPlus,
  Mail,
  Pencil,
  FileText,
  Download,
  Upload,
  Eye,
  Star,
  X,
  MessageCircle,
} from "lucide-react"
import { useState } from "react"
import { AdminOnly } from "@/components/admin-only"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { loadTeamDataFromStorage } from "@/lib/utils"

// Mock project data - in a real app, this would come from a database
const projectData = {
  1: {
    id: 1,
    title: "Website Redesign",
    description:
      "Complete overhaul of company website with modern design and improved user experience. This project aims to enhance our online presence, improve conversion rates, and provide a better user experience for our customers.",
    status: "In Progress",
    progress: 65,
    team: [
      { name: "Sarah Miller", role: "Project Manager", avatar: "/team-sarah.png", email: "sarah.miller@company.com" },
      { name: "John Doe", role: "UI/UX Designer", avatar: "/team-john.png", email: "john.doe@company.com" },
      { name: "Mike Chen", role: "Frontend Developer", avatar: "/team-mike.png", email: "mike.chen@company.com" },
    ],
    department: "Marketing",
    startDate: "2024-10-01",
    endDate: "2024-12-15",
    priority: "High",
    budget: "$45,000",
    spent: "$29,250",
    milestones: [
      {
        name: "Research & Discovery",
        status: "completed",
        dueDate: "2024-10-15",
        startDate: "2024-10-01",
        endDate: "2024-10-14",
      },
      {
        name: "Design Mockups",
        status: "completed",
        dueDate: "2024-11-01",
        startDate: "2024-10-15",
        endDate: "2024-10-30",
      },
      {
        name: "Frontend Development",
        status: "in-progress",
        dueDate: "2024-11-30",
        startDate: "2024-11-01",
        endDate: "2024-11-29",
      },
      {
        name: "Content Migration",
        status: "pending",
        dueDate: "2024-12-10",
        startDate: "2024-11-30",
        endDate: "2024-12-09",
      },
      {
        name: "Testing & Launch",
        status: "pending",
        dueDate: "2024-12-15",
        startDate: "2024-12-10",
        endDate: "2024-12-15",
      },
    ],
    recentActivity: [
      { user: "John Doe", action: "uploaded new design mockups", time: "2 hours ago" },
      { user: "Mike Chen", action: "completed homepage component", time: "1 day ago" },
      { user: "Sarah Miller", action: "updated project timeline", time: "2 days ago" },
    ],
    functionalities: [
      "Responsive web design across all devices",
      "Modern UI/UX with improved navigation",
      "SEO optimization and performance enhancements",
      "Content management system integration",
    ],
    features: [
      "Interactive product showcase",
      "Customer testimonials section",
      "Advanced search functionality",
      "Multi-language support",
    ],
    documents: [
      {
        id: 1,
        name: "Project Requirements.pdf",
        type: "PDF",
        size: "2.4 MB",
        uploadedBy: "Sarah Miller",
        uploadedDate: "2024-01-15",
        category: "Requirements",
        sharepointUrl:
          "https://munuslaw.sharepoint.com/sites/ProjectDocuments/Shared%20Documents/Requirements/Project%20Requirements.pdf",
      },
      {
        id: 2,
        name: "Design Mockups.figma",
        type: "Figma",
        size: "15.2 MB",
        uploadedBy: "John Doe",
        uploadedDate: "2024-01-18",
        category: "Design",
        sharepointUrl:
          "https://munuslaw.sharepoint.com/sites/ProjectDocuments/Shared%20Documents/Design/Design%20Mockups.figma",
      },
    ],
  },
  2: {
    id: 2,
    title: "Mobile App Launch",
    description:
      "Development and launch of our mobile application for iOS and Android platforms. This project focuses on creating a seamless mobile experience for our users with native performance and intuitive design.",
    status: "In Progress",
    progress: 45,
    team: [
      {
        name: "Emily Johnson",
        role: "Mobile App Lead",
        avatar: "/team-member-1.png",
        email: "emily.johnson@company.com",
      },
      { name: "David Park", role: "iOS Developer", avatar: "/team-member-2.png", email: "david.park@company.com" },
      { name: "Lisa Wong", role: "Android Developer", avatar: "/team-member-3.png", email: "lisa.wong@company.com" },
      {
        name: "Alex Rivera",
        role: "QA Engineer",
        avatar: "/professional-headshot.png",
        email: "alex.rivera@company.com",
      },
    ],
    department: "Technology",
    startDate: "2024-09-15",
    endDate: "2025-02-28",
    priority: "High",
    budget: "$120,000",
    spent: "$54,000",
    milestones: [
      {
        name: "App Architecture Design",
        status: "completed",
        dueDate: "2024-10-01",
        startDate: "2024-09-15",
        endDate: "2024-09-30",
      },
      {
        name: "Core Features Development",
        status: "in-progress",
        dueDate: "2024-12-15",
        startDate: "2024-10-01",
        endDate: "2024-12-14",
      },
      {
        name: "Testing & Bug Fixes",
        status: "pending",
        dueDate: "2025-01-31",
        startDate: "2024-12-15",
        endDate: "2025-01-30",
      },
      {
        name: "App Store Submission",
        status: "pending",
        dueDate: "2025-02-28",
        startDate: "2025-02-01",
        endDate: "2025-02-28",
      },
    ],
    recentActivity: [
      { user: "David Park", action: "completed user authentication module", time: "3 hours ago" },
      { user: "Lisa Wong", action: "implemented push notifications", time: "1 day ago" },
      { user: "Emily Johnson", action: "reviewed app store guidelines", time: "2 days ago" },
    ],
    functionalities: [
      "Cross-platform mobile application",
      "User authentication and profiles",
      "Real-time notifications",
      "Offline data synchronization",
    ],
    features: ["Biometric login support", "Dark mode interface", "In-app messaging system", "Social media integration"],
    documents: [
      {
        id: 1,
        name: "Mobile App Specifications.pdf",
        type: "PDF",
        size: "3.2 MB",
        uploadedBy: "Emily Johnson",
        uploadedDate: "2024-09-20",
        category: "Requirements",
        sharepointUrl:
          "https://munuslaw.sharepoint.com/sites/ProjectDocuments/Shared%20Documents/Mobile/App%20Specifications.pdf",
      },
      {
        id: 2,
        name: "UI Design Guidelines.sketch",
        type: "Sketch",
        size: "8.7 MB",
        uploadedBy: "David Park",
        uploadedDate: "2024-10-05",
        category: "Design",
        sharepointUrl:
          "https://munuslaw.sharepoint.com/sites/ProjectDocuments/Shared%20Documents/Mobile/UI%20Guidelines.sketch",
      },
    ],
  },
  3: {
    id: 3,
    title: "Q4 Planning Initiative",
    description:
      "Strategic planning and resource allocation for Q4 business objectives. This initiative focuses on setting clear goals, optimizing team performance, and ensuring successful delivery of key business outcomes.",
    status: "Planning",
    progress: 25,
    team: [
      {
        name: "Robert Johnson",
        role: "Strategy Lead",
        avatar: "/ceo-headshot.png",
        email: "robert.johnson@company.com",
      },
      {
        name: "Jennifer Lee",
        role: "Business Analyst",
        avatar: "/team-member-1.png",
        email: "jennifer.lee@company.com",
      },
    ],
    department: "Operations",
    startDate: "2024-11-01",
    endDate: "2024-12-31",
    priority: "Medium",
    budget: "$25,000",
    spent: "$6,250",
    milestones: [
      {
        name: "Market Analysis",
        status: "completed",
        dueDate: "2024-11-15",
        startDate: "2024-11-01",
        endDate: "2024-11-14",
      },
      {
        name: "Resource Planning",
        status: "in-progress",
        dueDate: "2024-11-30",
        startDate: "2024-11-15",
        endDate: "2024-11-29",
      },
      {
        name: "Budget Allocation",
        status: "pending",
        dueDate: "2024-12-15",
        startDate: "2024-12-01",
        endDate: "2024-12-14",
      },
      {
        name: "Implementation Plan",
        status: "pending",
        dueDate: "2024-12-31",
        startDate: "2024-12-15",
        endDate: "2024-12-31",
      },
    ],
    recentActivity: [
      { user: "Robert Johnson", action: "completed market research analysis", time: "4 hours ago" },
      { user: "Jennifer Lee", action: "updated resource allocation spreadsheet", time: "2 days ago" },
    ],
    functionalities: [
      "Strategic planning framework",
      "Resource optimization tools",
      "Performance tracking system",
      "Budget management interface",
    ],
    features: [
      "Interactive planning dashboard",
      "Automated reporting system",
      "Team collaboration tools",
      "Goal tracking metrics",
    ],
    documents: [
      {
        id: 1,
        name: "Q4 Strategy Document.docx",
        type: "Word",
        size: "2.1 MB",
        uploadedBy: "Robert Johnson",
        uploadedDate: "2024-11-05",
        category: "Strategy",
        sharepointUrl:
          "https://munuslaw.sharepoint.com/sites/ProjectDocuments/Shared%20Documents/Planning/Q4%20Strategy.docx",
      },
    ],
  },
  4: {
    id: 4,
    title: "Customer Support Portal",
    description:
      "Development of a comprehensive customer support portal with ticketing system, knowledge base, and live chat functionality. This project aims to improve customer satisfaction and reduce support response times.",
    status: "In Progress",
    progress: 70,
    team: [
      {
        name: "Amanda Davis",
        role: "Product Manager",
        avatar: "/team-member-2.png",
        email: "amanda.davis@company.com",
      },
      {
        name: "Carlos Martinez",
        role: "Full Stack Developer",
        avatar: "/team-member-3.png",
        email: "carlos.martinez@company.com",
      },
      { name: "Sophie Chen", role: "UX Designer", avatar: "/team-member-1.png", email: "sophie.chen@company.com" },
    ],
    department: "Customer Success",
    startDate: "2024-08-01",
    endDate: "2024-12-20",
    priority: "High",
    budget: "$75,000",
    spent: "$52,500",
    milestones: [
      {
        name: "Portal Architecture",
        status: "completed",
        dueDate: "2024-08-31",
        startDate: "2024-08-01",
        endDate: "2024-08-30",
      },
      {
        name: "Ticketing System",
        status: "completed",
        dueDate: "2024-10-15",
        startDate: "2024-09-01",
        endDate: "2024-10-14",
      },
      {
        name: "Knowledge Base",
        status: "in-progress",
        dueDate: "2024-11-30",
        startDate: "2024-10-15",
        endDate: "2024-11-29",
      },
      {
        name: "Live Chat Integration",
        status: "pending",
        dueDate: "2024-12-20",
        startDate: "2024-12-01",
        endDate: "2024-12-20",
      },
    ],
    recentActivity: [
      { user: "Carlos Martinez", action: "deployed knowledge base search feature", time: "1 hour ago" },
      { user: "Sophie Chen", action: "finalized chat widget design", time: "6 hours ago" },
      { user: "Amanda Davis", action: "reviewed customer feedback", time: "1 day ago" },
    ],
    functionalities: [
      "Ticket management system",
      "Knowledge base with search",
      "Live chat support",
      "Customer feedback collection",
    ],
    features: [
      "Multi-language support",
      "Automated ticket routing",
      "Customer satisfaction surveys",
      "Integration with CRM system",
    ],
    documents: [
      {
        id: 1,
        name: "Support Portal Requirements.pdf",
        type: "PDF",
        size: "1.9 MB",
        uploadedBy: "Amanda Davis",
        uploadedDate: "2024-08-10",
        category: "Requirements",
        sharepointUrl:
          "https://munuslaw.sharepoint.com/sites/ProjectDocuments/Shared%20Documents/Support/Portal%20Requirements.pdf",
      },
      {
        id: 2,
        name: "Chat Integration Guide.docx",
        type: "Word",
        size: "1.3 MB",
        uploadedBy: "Carlos Martinez",
        uploadedDate: "2024-10-20",
        category: "Documentation",
        sharepointUrl:
          "https://munuslaw.sharepoint.com/sites/ProjectDocuments/Shared%20Documents/Support/Chat%20Integration.docx",
      },
    ],
  },
  5: {
    id: 5,
    title: "Data Analytics Dashboard",
    description:
      "Implementation of a comprehensive data analytics dashboard for business intelligence and reporting. This project will provide real-time insights into key business metrics and performance indicators.",
    status: "In Progress",
    progress: 55,
    team: [
      {
        name: "Michael Thompson",
        role: "Data Engineer",
        avatar: "/professional-headshot.png",
        email: "michael.thompson@company.com",
      },
      { name: "Rachel Kim", role: "Data Analyst", avatar: "/team-member-2.png", email: "rachel.kim@company.com" },
    ],
    department: "Analytics",
    startDate: "2024-09-01",
    endDate: "2025-01-15",
    priority: "Medium",
    budget: "$60,000",
    spent: "$33,000",
    milestones: [
      {
        name: "Data Pipeline Setup",
        status: "completed",
        dueDate: "2024-09-30",
        startDate: "2024-09-01",
        endDate: "2024-09-29",
      },
      {
        name: "Dashboard Development",
        status: "in-progress",
        dueDate: "2024-12-15",
        startDate: "2024-10-01",
        endDate: "2024-12-14",
      },
      {
        name: "Report Automation",
        status: "pending",
        dueDate: "2025-01-15",
        startDate: "2024-12-15",
        endDate: "2025-01-15",
      },
    ],
    recentActivity: [
      { user: "Michael Thompson", action: "optimized data processing pipeline", time: "2 hours ago" },
      { user: "Rachel Kim", action: "created sales performance charts", time: "1 day ago" },
    ],
    functionalities: [
      "Real-time data visualization",
      "Custom report generation",
      "Data export capabilities",
      "Performance monitoring",
    ],
    features: [
      "Interactive charts and graphs",
      "Automated alert system",
      "Mobile-responsive design",
      "Role-based access control",
    ],
    documents: [
      {
        id: 1,
        name: "Analytics Requirements.xlsx",
        type: "Excel",
        size: "2.8 MB",
        uploadedBy: "Rachel Kim",
        uploadedDate: "2024-09-05",
        category: "Requirements",
        sharepointUrl:
          "https://munuslaw.sharepoint.com/sites/ProjectDocuments/Shared%20Documents/Analytics/Requirements.xlsx",
      },
    ],
  },
  6: {
    id: 6,
    title: "Security Audit & Compliance",
    description:
      "Comprehensive security audit and compliance assessment to ensure adherence to industry standards and regulations. This project includes vulnerability assessments, policy updates, and security training.",
    status: "Planning",
    progress: 30,
    team: [
      {
        name: "Thomas Wilson",
        role: "Security Specialist",
        avatar: "/ceo-headshot.png",
        email: "thomas.wilson@company.com",
      },
      {
        name: "Maria Garcia",
        role: "Compliance Officer",
        avatar: "/team-member-1.png",
        email: "maria.garcia@company.com",
      },
    ],
    department: "Security",
    startDate: "2024-10-15",
    endDate: "2025-03-31",
    priority: "High",
    budget: "$85,000",
    spent: "$25,500",
    milestones: [
      {
        name: "Security Assessment",
        status: "in-progress",
        dueDate: "2024-12-01",
        startDate: "2024-10-15",
        endDate: "2024-11-30",
      },
      {
        name: "Policy Updates",
        status: "pending",
        dueDate: "2025-01-31",
        startDate: "2024-12-01",
        endDate: "2025-01-30",
      },
      {
        name: "Staff Training",
        status: "pending",
        dueDate: "2025-02-28",
        startDate: "2025-02-01",
        endDate: "2025-02-28",
      },
      {
        name: "Compliance Certification",
        status: "pending",
        dueDate: "2025-03-31",
        startDate: "2025-03-01",
        endDate: "2025-03-31",
      },
    ],
    recentActivity: [
      { user: "Thomas Wilson", action: "completed network vulnerability scan", time: "3 hours ago" },
      { user: "Maria Garcia", action: "reviewed compliance documentation", time: "2 days ago" },
    ],
    functionalities: [
      "Security vulnerability scanning",
      "Compliance monitoring system",
      "Policy management platform",
      "Training tracking system",
    ],
    features: [
      "Automated security reports",
      "Risk assessment tools",
      "Incident response system",
      "Compliance dashboard",
    ],
    documents: [
      {
        id: 1,
        name: "Security Audit Plan.pdf",
        type: "PDF",
        size: "3.5 MB",
        uploadedBy: "Thomas Wilson",
        uploadedDate: "2024-10-20",
        category: "Security",
        sharepointUrl:
          "https://munuslaw.sharepoint.com/sites/ProjectDocuments/Shared%20Documents/Security/Audit%20Plan.pdf",
      },
      {
        id: 2,
        name: "Compliance Checklist.xlsx",
        type: "Excel",
        size: "1.7 MB",
        uploadedBy: "Maria Garcia",
        uploadedDate: "2024-10-25",
        category: "Compliance",
        sharepointUrl:
          "https://munuslaw.sharepoint.com/sites/ProjectDocuments/Shared%20Documents/Security/Compliance%20Checklist.xlsx",
      },
    ],
  },
}

// const founders = [
//   { id: 1, name: "David Chen", role: "Co-Founder & Chairman" },
//   { id: 2, name: "Maria Rodriguez", role: "Co-Founder & CTO" },
//   { id: 3, name: "James Wilson", role: "Co-Founder & COO" },
// ]

// const advisors = [
//   { id: 1, name: "Dr. Patricia Kim", role: "Strategic Advisor - Go-to-Market Strategy" },
//   { id: 2, name: "Robert Thompson", role: "Technology Advisor - AI & Machine Learning" },
//   { id: 3, name: "Lisa Chang", role: "Financial Advisor - Finance & Investment" },
// ]

// const consultants = [
//   { id: 1, name: "Michael Foster", role: "Management Consultant - Organizational Development" },
//   { id: 2, name: "Jennifer Park", role: "Marketing Consultant - Digital Marketing Strategy" },
//   { id: 3, name: "Alex Kumar", role: "Technology Consultant - Cloud Migration & DevOps" },
// ]

// const allOrganizationMembers = [
//   ...founders.map((f) => ({ ...f, uniqueId: `founder-${f.id}`, category: "Founder" })),
//   ...advisors.map((a) => ({ ...a, uniqueId: `advisor-${a.id}`, category: "Advisor" })),
//   ...consultants.map((c) => ({ ...c, uniqueId: `consultant-${c.id}`, category: "Consultant" })),
// ]

interface Project {
  id: number
  title: string
  description: string
  status: string
  progress: number
  team: any[]
  department: string
  startDate: string
  endDate: string
  priority: string
  budget: string
  spent: string
  milestones: any[]
  recentActivity: any[]
  functionalities: string[]
  features: string[]
  documents: any[]
}

type ProjectPageClientProps = {
  id: string;
};

export default function ProjectPageClient({ id }: ProjectPageClientProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const getProjectData = () => {
    const projectId = Number.parseInt(id)
    const storedProject = localStorage.getItem(`project_${projectId}`)

    if (storedProject) {
      try {
        const parsedProject = JSON.parse(storedProject)
        // Merge stored data with static data to ensure all fields are present
        const staticProject = projectData[projectId as keyof typeof projectData]
        if (staticProject) {
          return { ...staticProject, ...parsedProject }
        }
        // If no static data exists, return the stored project data
        return parsedProject
      } catch (error) {
        console.log("[v0] Error parsing stored project data:", error)
      }
    }

    // Return static project data if available, otherwise return a default structure
    const staticProject = projectData[projectId as keyof typeof projectData]
    if (staticProject) {
      return staticProject
    }

    // If no static or stored data exists, return null to indicate project not found
    return null
  }

  const [project, setProject] = useState<Project | null>(getProjectData())

  const [founders, setFounders] = useState(() => loadTeamDataFromStorage().founders)
  const [advisors, setAdvisors] = useState(() => loadTeamDataFromStorage().advisors)
  const [consultants, setConsultants] = useState(() => loadTeamDataFromStorage().consultants)

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "team_data") {
        const teamData = loadTeamDataFromStorage()
        setFounders(teamData.founders)
        setAdvisors(teamData.advisors)
        setConsultants(teamData.consultants)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const allOrganizationMembers = [
    ...founders.map((f) => ({ ...f, uniqueId: `founder-${f.id}`, category: "Founder" })),
    ...advisors.map((a) => ({ ...a, uniqueId: `advisor-${a.id}`, category: "Advisor" })),
    ...consultants.map((c) => ({ ...c, uniqueId: `consultant-${c.id}`, category: "Consultant" })),
  ]

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    department: "",
    budget: "",
    startDate: "",
    endDate: "",
  })

  const [teamMembers, setTeamMembers] = useState([])
  const [newMember, setNewMember] = useState({
    selectedMember: "",
    customName: "",
    role: "",
    email: "",
  })

  const [milestones, setMilestones] = useState([])
  const [newMilestone, setNewMilestone] = useState({
    name: "",
    status: "pending",
    startDate: "",
    endDate: "",
    dueDate: "",
  })

  const [activities, setActivities] = useState([])
  const [newActivity, setNewActivity] = useState({ user: "", action: "", time: "" })

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isTeamEditOpen, setIsTeamEditOpen] = useState(false)
  const [isTimelineEditOpen, setIsTimelineEditOpen] = useState(false)
  const [isActivityEditOpen, setIsActivityEditOpen] = useState(false)

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [selectedPersonForMessage, setSelectedPersonForMessage] = useState<{ name: string; email: string } | null>(null)

  const [isEditMemberModalOpen, setIsEditMemberModalOpen] = useState(false)
  const [isDeleteMemberModalOpen, setIsDeleteMemberModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<any>(null)
  const [deletingMember, setDeletingMember] = useState<any>(null)

  const [documents, setDocuments] = useState([])
  const [isDocumentsEditOpen, setIsDocumentsEditOpen] = useState(false)

  const [uploadingFile, setUploadingFile] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)

  const [functionalities, setFunctionalities] = useState([])
  const [features, setFeatures] = useState([])
  const [newFunctionality, setNewFunctionality] = useState("")
  const [newFeature, setNewFeature] = useState("")
  const [isEditingFeatures, setIsEditingFeatures] = useState(false)

  useEffect(() => {
    if (project) {
      setEditForm({
        title: project.title ?? "",
        description: project.description ?? "",
        status: project.status ?? "",
        priority: project.priority ?? "",
        department: project.department ?? "",
        budget: project.budget ?? "",
        startDate: project.startDate ?? "",
        endDate: project.endDate ?? "",
      })
      setTeamMembers(project.team || [])
      setFunctionalities(project.functionalities || [])
      setFeatures(project.features || [])
      setDocuments(project.documents || [])
    }
  }, [project])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      setSelectedFiles(files)
    }
  }

  const handleUploadDocument = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return

    setUploadingFile(true)

    try {
      // Process each selected file
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]

        // Create new document entry
        const newDocument = {
          id: documents.length + i + 1,
          name: file.name,
          type: file.name.split(".").pop()?.toUpperCase() || "Unknown",
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          uploadedBy: "Current User", // You can get this from auth context
          uploadedDate: new Date().toISOString().split("T")[0],
          category: "Documentation", // Default category, can be made selectable
          sharepointUrl: `https://munuslaw.sharepoint.com/sites/ProjectDocuments/Shared%20Documents/Documentation/${encodeURIComponent(file.name)}`,
        }

        // Add to documents array
        setDocuments((prev) => [...prev, newDocument])
      }

      // Clear selected files
      setSelectedFiles(null)
      const fileInput = document.getElementById("file-upload") as HTMLInputElement
      if (fileInput) fileInput.value = ""

      console.log("[v0] Documents uploaded successfully")
    } catch (error) {
      console.error("[v0] Error uploading documents:", error)
    } finally {
      setUploadingFile(false)
    }
  }

  const handleDeleteDocument = (documentId: number) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== documentId))
    console.log("[v0] Document deleted:", documentId)
  }

  useEffect(() => {
    if (project) {
      setMilestones(project.milestones || [])
      setActivities(project.recentActivity || [])
    }
  }, [project])

  if (!project) {
    return <div>Project not found</div>
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (project) {
      const updatedProject = { ...project, ...editForm, team: teamMembers }

      // Update local state immediately
      setProject(updatedProject)

      // Save to localStorage
      localStorage.setItem(`project_${project.id}`, JSON.stringify(updatedProject))

      window.dispatchEvent(
        new StorageEvent("storage", {
          key: `project_${project.id}`,
          newValue: JSON.stringify(updatedProject),
        }),
      )

      window.dispatchEvent(
        new CustomEvent("projectUpdated", {
          detail: { projectId: project.id, updatedProject },
        }),
      )

      console.log("[v0] Project changes saved successfully:", editForm)

      setIsEditOpen(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }))
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "completed":
        return "text-chart-4"
      case "in-progress":
        return "text-chart-3"
      case "pending":
        return "text-muted-foreground"
      default:
        return "text-muted-foreground"
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-chart-4" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-chart-3" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const handleAddTeamMember = () => {
    let memberName = ""
    let memberEmail = newMember.email

    if (newMember.selectedMember === "other") {
      memberName = newMember.customName
    } else if (newMember.selectedMember) {
      const selectedOrgMember = allOrganizationMembers.find((m) => m.uniqueId === newMember.selectedMember)
      if (selectedOrgMember) {
        memberName = selectedOrgMember.name
        memberEmail = selectedOrgMember.email
      }
    }

    if (memberName && newMember.role) {
      setTeamMembers([
        ...teamMembers,
        {
          name: memberName,
          role: newMember.role, // Always use project-specific role
          email: memberEmail,
          avatar: "/placeholder.svg",
        },
      ])
      setNewMember({ selectedMember: "", customName: "", role: "", email: "" })
    }
  }

  const handleRemoveTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index))
  }

  const handleSaveTeam = () => {
    console.log("[v0] Saving team changes:", teamMembers)
    if (project) {
      const updatedProject = {
        ...project,
        team: [...teamMembers],
      }
      localStorage.setItem(`project_${project.id}`, JSON.stringify(updatedProject))
      console.log("[v0] Team changes saved to localStorage for project", project.id)
    }
    setIsTeamEditOpen(false)
  }

  const handleAddMilestone = () => {
    if (newMilestone.name && newMilestone.dueDate) {
      setMilestones([...milestones, newMilestone])
      setNewMilestone({ name: "", status: "pending", startDate: "", endDate: "", dueDate: "" })
    }
  }

  const handleRemoveMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index))
  }

  const handleMilestoneChange = (index: number, field: string, value: string) => {
    const updated = milestones.map((milestone, i) => (i === index ? { ...milestone, [field]: value } : milestone))
    setMilestones(updated)
  }

  const handleSaveTimeline = () => {
    console.log("[v0] Saving timeline changes:", milestones)
    const updatedProject = {
      ...project,
      milestones: milestones,
      startDate: editForm.startDate,
      endDate: editForm.endDate,
    }
    localStorage.setItem(`project_${project.id}`, JSON.stringify(updatedProject))

    // Update local project state to reflect changes immediately
    setProject(updatedProject)

    // Dispatch storage event to notify other components
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: `project_${project.id}`,
        newValue: JSON.stringify(updatedProject),
      }),
    )

    setIsTimelineEditOpen(false)
  }

  const handleAddActivity = () => {
    if (newActivity.user && newActivity.action) {
      const activityWithTime = { ...newActivity, time: newActivity.time || "Just now" }
      setActivities([activityWithTime, ...activities])
      setNewActivity({ user: "", action: "", time: "" })
    }
  }

  const handleRemoveActivity = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index))
  }

  const handleSaveActivity = () => {
    console.log("[v0] Saving activity changes:", activities)
    setIsActivityEditOpen(false)
  }

  const handleMemberSelection = (value: string) => {
    if (value === "other") {
      setNewMember({
        ...newMember,
        selectedMember: value,
        email: "",
        customName: "",
      })
    } else if (value) {
      const selectedOrgMember = allOrganizationMembers.find((m) => m.uniqueId === value)
      if (selectedOrgMember) {
        setNewMember({
          ...newMember,
          selectedMember: value,
          email: selectedOrgMember.email,
          customName: "",
        })
      }
    } else {
      setNewMember({
        ...newMember,
        selectedMember: value,
        email: "",
        customName: "",
      })
    }
  }

  const getSelectedMemberDisplayName = () => {
    if (newMember.selectedMember === "other") {
      return "Other (External Person)"
    }

    if (newMember.selectedMember) {
      const selectedOrgMember = allOrganizationMembers.find((m) => m.uniqueId === newMember.selectedMember)
      if (selectedOrgMember) {
        return selectedOrgMember.name
      }
    }

    return ""
  }

  const handleMessage = (person: { name: string; email: string }) => {
    console.log("[v0] Message button clicked for:", person.name, "Email:", person.email)
    setSelectedPersonForMessage(person)
    setIsMessageModalOpen(true)
  }

  const handleOutlookMessage = () => {
    if (selectedPersonForMessage) {
      console.log("[v0] Opening Outlook for:", selectedPersonForMessage.email)
      const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(selectedPersonForMessage.email)}`
      window.open(outlookUrl, "_blank")
      setIsMessageModalOpen(false)
    }
  }

  const handleTeamsMessage = () => {
    if (selectedPersonForMessage) {
      console.log("[v0] Opening Teams for:", selectedPersonForMessage.email)
      const teamsUrl = `https://teams.microsoft.com/l/chat/0/0?users=${encodeURIComponent(selectedPersonForMessage.email)}`
      window.open(teamsUrl, "_blank")
      setIsMessageModalOpen(false)
    }
  }

  const handleEditMember = (member: any, index: number) => {
    console.log("[v0] Editing team member:", member)
    setEditingMember({ ...member, index })
    setIsEditMemberModalOpen(true)
  }

  const handleDeleteMember = (member: any, index: number) => {
    console.log("[v0] Deleting team member:", member)
    setDeletingMember({ ...member, index })
    setIsDeleteMemberModalOpen(true)
  }

  const handleSaveEditMember = () => {
    if (editingMember) {
      const updatedTeamMembers = [...teamMembers]
      updatedTeamMembers[editingMember.index] = {
        name: editingMember.name,
        role: editingMember.role,
        email: editingMember.email,
        avatar: editingMember.avatar,
      }
      setTeamMembers(updatedTeamMembers)

      // Update the project object and save to localStorage
      if (project) {
        project.team = updatedTeamMembers
        const updatedProject = {
          ...project,
          team: updatedTeamMembers,
        }
        localStorage.setItem(`project_${project.id}`, JSON.stringify(updatedProject))
        console.log("[v0] Saved edited team member to localStorage")
      }

      setIsEditMemberModalOpen(false)
      setEditingMember(null)
    }
  }

  const handleConfirmDeleteMember = () => {
    if (deletingMember) {
      const updatedTeamMembers = teamMembers.filter((_, index) => index !== deletingMember.index)
      setTeamMembers(updatedTeamMembers)

      // Update the project object and save to localStorage
      if (project) {
        project.team = updatedTeamMembers
        const updatedProject = {
          ...project,
          team: updatedTeamMembers,
        }
        localStorage.setItem(`project_${project.id}`, JSON.stringify(updatedProject))
        console.log("[v0] Saved team after deletion to localStorage")
      }

      setIsDeleteMemberModalOpen(false)
      setDeletingMember(null)
    }
  }

  const handleBackToProjects = () => {
    console.log("[v0] Navigating back to projects")
    window.location.href = "/projects"
  }

  const handleSaveFeatures = () => {
    const updatedProject = {
      ...project,
      functionalities,
      features,
    }

    localStorage.setItem(`project_${project.id}`, JSON.stringify(updatedProject))
    setProject(updatedProject)
    setIsEditingFeatures(false)

    // Dispatch storage event for synchronization
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: `project_${project.id}`,
        newValue: JSON.stringify(updatedProject),
      }),
    )
  }

  const addFunctionality = () => {
    if (newFunctionality.trim()) {
      setFunctionalities([...functionalities, newFunctionality.trim()])
      setNewFunctionality("")
    }
  }

  const removeFunctionality = (index: number) => {
    setFunctionalities(functionalities.filter((_, i) => i !== index))
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()])
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-green-100">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white">
        <div className="flex h-20 items-center justify-between px-8">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <img src="/munus-logo.jpg" alt="Munus Logo" className="h-8 w-auto" />
                <span className="text-2xl font-bold text-gray-900 font-serif">Munus Hub</span>
              </div>
            </div>
            <Link href="/projects" className="flex items-center gap-2 text-gray-600 hover:text-primary cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Projects</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Project</DialogTitle>
                  <DialogDescription>
                    Update project details and settings. Changes will be saved immediately.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleEditSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Project Title</Label>
                      <Input
                        id="title"
                        value={editForm.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        placeholder="Enter project title"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select
                        value={editForm.department}
                        onValueChange={(value) => handleInputChange("department", value)}
                      >
                        <SelectTrigger>
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editForm.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Enter project description"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={editForm.status} onValueChange={(value) => handleInputChange("status", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Planning">Planning</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="On Hold">On Hold</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={editForm.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={editForm.startDate}
                        onChange={(e) => handleInputChange("startDate", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={editForm.endDate}
                        onChange={(e) => handleInputChange("endDate", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget</Label>
                    <Input
                      id="budget"
                      value={editForm.budget}
                      onChange={(e) => handleInputChange("budget", e.target.value)}
                      placeholder="e.g., $45,000"
                      required
                    />
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Avatar className="h-10 w-10">
              <AvatarImage src="/professional-headshot.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Project Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 font-serif">{project.title}</h1>
                <p className="text-gray-600 max-w-3xl">{project.description}</p>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-orange-100 text-orange-800 border-orange-200">{project.status}</Badge>
                <Badge className="bg-red-100 text-red-800 border-red-200">{project.priority}</Badge>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Timeline</span>
                  </div>
                  <p className="text-lg font-bold mt-1">
                    {Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}{" "}
                    days left
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(project.startDate).toLocaleDateString()} -{" "}
                    {new Date(project.endDate).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Team Size</span>
                  </div>
                  <p className="text-lg font-bold mt-1">{project.team.length} members</p>
                  <p className="text-xs text-muted-foreground">{project.department}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Progress</span>
                  </div>
                  <p className="text-lg font-bold mt-1">{project.progress}%</p>
                  <Progress value={project.progress} className="h-2 mt-2" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Budget</span>
                  </div>
                  <p className="text-lg font-bold mt-1">{project.budget}</p>
                  <p className="text-xs text-muted-foreground">Spent: {project.spent}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tabs Content */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="team"
                className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                Team
              </TabsTrigger>
              <TabsTrigger
                value="timeline"
                className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                Timeline
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                Project Documents
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="col-span-full">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Functionalities & Features</CardTitle>
                      <CardDescription>Core capabilities and key features of this project</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsEditingFeatures(!isEditingFeatures)}>
                      <Edit className="h-4 w-4 mr-2" />
                      {isEditingFeatures ? "Cancel" : "Edit"}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {isEditingFeatures ? (
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm text-primary">All Functionalities & Features</h4>
                          <div className="space-y-2">
                            {functionalities.map((functionality, index) => (
                              <div key={`func-${index}`} className="flex items-center gap-2 p-2 border rounded">
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                <span className="flex-1 text-sm">{functionality}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFunctionality(index)}
                                  className="h-6 w-6 p-0"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                            {features.map((feature, index) => (
                              <div key={`feat-${index}`} className="flex items-center gap-2 p-2 border rounded">
                                <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                                <span className="flex-1 text-sm">{feature}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFeature(index)}
                                  className="h-6 w-6 p-0"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Add new functionality..."
                                  value={newFunctionality}
                                  onChange={(e) => setNewFunctionality(e.target.value)}
                                  onKeyPress={(e) => e.key === "Enter" && addFunctionality()}
                                  className="text-sm"
                                />
                                <Button onClick={addFunctionality} size="sm">
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Add new feature..."
                                  value={newFeature}
                                  onChange={(e) => setNewFeature(e.target.value)}
                                  onKeyPress={(e) => e.key === "Enter" && addFeature()}
                                  className="text-sm"
                                />
                                <Button onClick={addFeature} size="sm">
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsEditingFeatures(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSaveFeatures}>Save Changes</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <ul className="space-y-2">
                          {functionalities.map((functionality, index) => (
                            <li key={`func-${index}`} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{functionality}</span>
                            </li>
                          ))}
                          {features.map((feature, index) => (
                            <li key={`feat-${index}`} className="flex items-start gap-2 text-sm">
                              <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Milestones */}
                <Card>
                  <CardHeader>
                    <CardTitle>Project Milestones</CardTitle>
                    <CardDescription>Key deliverables and deadlines</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {milestones.map((milestone, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                        {getStatusIcon(milestone.status)}
                        <div className="flex-1">
                          <h4 className={`font-medium ${getStatusColor(milestone.status)}`}>{milestone.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Due: {new Date(milestone.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest updates and changes</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {activities.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {activity.user
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{activity.user}</span> {activity.action}
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="team" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Team Members</CardTitle>
                      <CardDescription>People working on this project</CardDescription>
                    </div>
                    <AdminOnly>
                      <Dialog open={isTeamEditOpen} onOpenChange={setIsTeamEditOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Add Team Member
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Add Team Members</DialogTitle>
                            <DialogDescription>Add or remove team members and update their roles.</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Current Team Members */}
                            <div className="space-y-4">
                              <h4 className="font-medium">Current Team Members</h4>
                              {teamMembers.map((member, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <div>
                                      <p className="font-medium">{member.name}</p>
                                      <p className="text-sm text-muted-foreground">{member.role}</p>
                                    </div>
                                  </div>
                                  <Button variant="outline" size="sm" onClick={() => handleRemoveTeamMember(index)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>

                            {/* Add New Member */}
                            <div className="space-y-4">
                              <h4 className="font-medium">Add New Member</h4>
                              <div className="space-y-2">
                                <Label>Select Team Member</Label>
                                <Select value={newMember.selectedMember} onValueChange={handleMemberSelection}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Choose from organization or select Other">
                                      {getSelectedMemberDisplayName() || "Choose from organization or select Other"}
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="other">Other (External Person)</SelectItem>
                                    {founders.length > 0 && (
                                      <>
                                        <SelectItem
                                          disabled
                                          value="founders-header"
                                          className="font-medium text-muted-foreground"
                                        >
                                          — Founders —
                                        </SelectItem>
                                        {founders.map((founder) => (
                                          <SelectItem key={`founder-${founder.id}`} value={`founder-${founder.id}`}>
                                            {founder.name}
                                          </SelectItem>
                                        ))}
                                      </>
                                    )}
                                    {advisors.length > 0 && (
                                      <>
                                        <SelectItem
                                          disabled
                                          value="advisors-header"
                                          className="font-medium text-muted-foreground"
                                        >
                                          — Advisors —
                                        </SelectItem>
                                        {advisors.map((advisor) => (
                                          <SelectItem key={`advisor-${advisor.id}`} value={`advisor-${advisor.id}`}>
                                            {advisor.name}
                                          </SelectItem>
                                        ))}
                                      </>
                                    )}
                                    {consultants.length > 0 && (
                                      <>
                                        <SelectItem
                                          disabled
                                          value="consultants-header"
                                          className="font-medium text-muted-foreground"
                                        >
                                          — Consultants —
                                        </SelectItem>
                                        {consultants.map((consultant) => (
                                          <SelectItem
                                            key={`consultant-${consultant.id}`}
                                            value={`consultant-${consultant.id}`}
                                          >
                                            {consultant.name}
                                          </SelectItem>
                                        ))}
                                      </>
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>

                              {newMember.selectedMember === "other" && (
                                <div className="space-y-2">
                                  <Label>Name</Label>
                                  <Input
                                    value={newMember.customName}
                                    onChange={(e) => setNewMember({ ...newMember, customName: e.target.value })}
                                    placeholder="Enter full name"
                                  />
                                </div>
                              )}

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Project Role *</Label>
                                  <Input
                                    value={newMember.role}
                                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                                    placeholder="Enter role for this project"
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Email</Label>
                                  <Input
                                    value={newMember.email}
                                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                                    placeholder="Email address"
                                    type="email"
                                    disabled={newMember.selectedMember !== "other" && newMember.selectedMember !== ""}
                                  />
                                </div>
                              </div>
                              <Button onClick={handleAddTeamMember} className="w-full">
                                <UserPlus className="h-4 w-4 mr-2" />
                                Add Team Member
                              </Button>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsTeamEditOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleSaveTeam}>
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </AdminOnly>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teamMembers.map((member, index) => (
                      <div key={index} className="p-4 border border-border rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div>
                            <h4 className="font-medium">{member.name}</h4>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                            onClick={() => handleMessage({ name: member.name, email: member.email || "" })}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                          <AdminOnly>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 bg-transparent"
                              onClick={() => handleEditMember(member, index)}
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-red-600 hover:text-red-700 bg-transparent"
                              onClick={() => handleDeleteMember(member, index)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </AdminOnly>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Project Timeline</CardTitle>
                      <CardDescription>Detailed schedule and milestones</CardDescription>
                    </div>
                    <AdminOnly>
                      <Dialog open={isTimelineEditOpen} onOpenChange={setIsTimelineEditOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Timeline
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Project Timeline</DialogTitle>
                            <DialogDescription>Update milestones, dates, and status information.</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                              <h4 className="font-medium">Project Dates</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Project Start Date</Label>
                                  <Input
                                    type="date"
                                    value={editForm.startDate}
                                    onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Project End Date</Label>
                                  <Input
                                    type="date"
                                    value={editForm.endDate}
                                    onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Current Milestones */}
                            <div className="space-y-4">
                              <h4 className="font-medium">Current Milestones</h4>
                              {milestones.map((milestone, index) => (
                                <div key={index} className="p-3 border rounded-lg space-y-3">
                                  <div className="flex items-center justify-between">
                                    <Input
                                      value={milestone.name}
                                      onChange={(e) => handleMilestoneChange(index, "name", e.target.value)}
                                    />
                                    <Select
                                      value={milestone.status}
                                      onChange={(value) => handleMilestoneChange(index, "status", value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="in-progress">In Progress</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Button variant="outline" size="sm" onClick={() => handleRemoveMilestone(index)}>
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <div className="grid grid-cols-3 gap-2">
                                    <div>
                                      <Label className="text-xs">Start Date</Label>
                                      <Input
                                        type="date"
                                        value={milestone.startDate || ""}
                                        onChange={(e) => handleMilestoneChange(index, "startDate", e.target.value)}
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs">End Date</Label>
                                      <Input
                                        type="date"
                                        value={milestone.endDate || ""}
                                        onChange={(e) => handleMilestoneChange(index, "endDate", e.target.value)}
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs">Due Date</Label>
                                      <Input
                                        type="date"
                                        value={milestone.dueDate}
                                        onChange={(e) => handleMilestoneChange(index, "dueDate", e.target.value)}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Add New Milestone */}
                            <div className="space-y-4">
                              <h4 className="font-medium">Add New Milestone</h4>
                              <div className="space-y-2">
                                <Label>Name</Label>
                                <Input
                                  value={newMilestone.name}
                                  onChange={(e) => setNewMilestone({ ...newMilestone, name: e.target.value })}
                                  placeholder="Enter milestone name"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Status</Label>
                                <Select
                                  value={newMilestone.status}
                                  onChange={(value) => setNewMilestone({ ...newMilestone, status: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <div className="space-y-2">
                                  <Label>Start Date</Label>
                                  <Input
                                    type="date"
                                    value={newMilestone.startDate}
                                    onChange={(e) => setNewMilestone({ ...newMilestone, startDate: e.target.value })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>End Date</Label>
                                  <Input
                                    type="date"
                                    value={newMilestone.endDate}
                                    onChange={(e) => setNewMilestone({ ...newMilestone, endDate: e.target.value })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Due Date</Label>
                                  <Input
                                    type="date"
                                    value={newMilestone.dueDate}
                                    onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
                                    required
                                  />
                                </div>
                              </div>
                              <Button onClick={handleAddMilestone} className="w-full">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Milestone
                              </Button>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsTimelineEditOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleSaveTimeline}>
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </AdminOnly>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-3">Project Timeline</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Start Date: </span>
                        <span className="font-medium">
                          {project?.startDate ? new Date(project.startDate).toLocaleDateString() : "Not set"}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">End Date: </span>
                        <span className="font-medium">
                          {project?.endDate ? new Date(project.endDate).toLocaleDateString() : "Not set"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium mb-4">Project Milestones</h4>
                    <div className="space-y-3">
                      {milestones
                        .sort((a, b) => {
                          // Sort by start date first, then by due date if no start date
                          const dateA = new Date(a.startDate || a.dueDate || "9999-12-31")
                          const dateB = new Date(b.startDate || b.dueDate || "9999-12-31")
                          return dateA.getTime() - dateB.getTime()
                        })
                        .map((milestone, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 p-4 border border-border rounded-lg bg-card"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              {getStatusIcon(milestone.status)}
                              <div className="min-w-0 flex-1">
                                <h5 className={`font-medium ${getStatusColor(milestone.status)}`}>{milestone.name}</h5>
                                <p className="text-sm text-muted-foreground capitalize">
                                  Status: {milestone.status.replace("-", " ")}
                                </p>
                              </div>
                            </div>

                            {/* Timetable section */}
                            <div className="flex items-center gap-6 text-sm">
                              {milestone.startDate && (
                                <div className="text-center">
                                  <div className="text-xs text-muted-foreground font-medium">START</div>
                                  <div className="font-medium">
                                    {new Date(milestone.startDate).toLocaleDateString()}
                                  </div>
                                </div>
                              )}

                              {milestone.startDate && milestone.endDate && (
                                <div className="flex items-center">
                                  <div className="w-8 h-px bg-border"></div>
                                  <div className="w-2 h-2 bg-primary rounded-full mx-1"></div>
                                  <div className="w-8 h-px bg-border"></div>
                                </div>
                              )}

                              {milestone.endDate && (
                                <div className="text-center">
                                  <div className="text-xs text-muted-foreground font-medium">END</div>
                                  <div className="font-medium">{new Date(milestone.endDate).toLocaleDateString()}</div>
                                </div>
                              )}

                              {milestone.dueDate && (
                                <div className="text-center">
                                  <div className="text-xs text-muted-foreground font-medium">DUE</div>
                                  <div className="font-medium text-orange-600">
                                    {new Date(milestone.dueDate).toLocaleDateString()}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Project Documents</CardTitle>
                      <CardDescription>Files, resources, and documentation for this project</CardDescription>
                    </div>
                    <AdminOnly>
                      <Dialog open={isDocumentsEditOpen} onOpenChange={setIsDocumentsEditOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Manage Documents
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Manage Project Documents</DialogTitle>
                            <DialogDescription>
                              Upload, organize, and manage project files and documentation.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Current Documents */}
                            <div className="space-y-4">
                              <h4 className="font-medium">Current Documents</h4>
                              {documents.map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded">
                                      <FileText className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                      <p className="font-medium">{doc.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {doc.size} • {doc.category} • Uploaded by {doc.uploadedBy}
                                      </p>
                                      <p className="text-xs text-blue-600 truncate max-w-md">
                                        SharePoint: {doc.sharepointUrl}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => window.open(doc.sharepointUrl, "_blank")}
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700 bg-transparent"
                                      onClick={() => handleDeleteDocument(doc.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Upload New Document */}
                            <div className="space-y-4">
                              <h4 className="font-medium">Upload New Document</h4>
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                <p className="text-sm text-gray-600 mb-2">
                                  Drag and drop files here, or click to browse
                                </p>
                                <input
                                  id="file-upload"
                                  type="file"
                                  multiple
                                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
                                  onChange={handleFileUpload}
                                  className="hidden"
                                />
                                <div className="space-y-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => document.getElementById("file-upload")?.click()}
                                    disabled={uploadingFile}
                                  >
                                    {uploadingFile ? "Uploading..." : "Choose Files"}
                                  </Button>
                                  {selectedFiles && selectedFiles.length > 0 && (
                                    <div className="space-y-2">
                                      <p className="text-sm text-gray-600">Selected {selectedFiles.length} file(s):</p>
                                      {Array.from(selectedFiles).map((file, index) => (
                                        <p key={index} className="text-xs text-gray-500">
                                          {file.name} ({(file.size / (1024 * 1024)).toFixed(1)} MB)
                                        </p>
                                      ))}
                                      <Button size="sm" onClick={handleUploadDocument} disabled={uploadingFile}>
                                        {uploadingFile ? "Uploading..." : "Upload Files"}
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDocumentsEditOpen(false)}>
                              Close
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </AdminOnly>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-4 border border-border rounded-lg hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="p-2 bg-blue-100 rounded">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{doc.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {doc.type} • {doc.size}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {doc.category} • {new Date(doc.uploadedDate).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-blue-600 mt-1 truncate">SharePoint Link Available</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                            onClick={() => window.open(doc.sharepointUrl, "_blank")}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                            onClick={() => window.open(doc.sharepointUrl, "_blank")}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
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
      <Dialog open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Contact {selectedPersonForMessage?.name}
            </DialogTitle>
            <DialogDescription>
              Choose how you'd like to communicate with {selectedPersonForMessage?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4">
            <Button
              onClick={handleOutlookMessage}
              className="flex items-center gap-3 h-12 justify-start bg-transparent"
              variant="outline"
            >
              <Mail className="h-5 w-5 text-blue-600" />
              <div className="text-left">
                <div className="font-medium">Send Email via Outlook</div>
                <div className="text-sm text-muted-foreground">{selectedPersonForMessage?.email}</div>
              </div>
            </Button>
            <Button
              onClick={handleTeamsMessage}
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

      <Dialog open={isEditMemberModalOpen} onOpenChange={setIsEditMemberModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>Update the team member's information for this project.</DialogDescription>
          </DialogHeader>
          {editingMember && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={editingMember.name || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role" className="text-right">
                  Role
                </Label>
                <Input
                  id="edit-role"
                  value={editingMember.role || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingMember.email || ""}
                  onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditMemberModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEditMember}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteMemberModalOpen} onOpenChange={setIsDeleteMemberModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Team Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {deletingMember?.name} from this project? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteMemberModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDeleteMember}>
              Delete Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
