"use client"

import type React from "react"
import { useEffect, useState } from "react"
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
  X,
  MessageCircle,
  Check,
  ChevronUp,
  ChevronDown,
  Send,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { usePermissions } from "@/hooks/use-permissions"
import { useUser } from "@/hooks/use-user" // Assuming useUser hook is available

// Mock project data - in a real app, this would come from a database

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
  coreFeatures?: any[] // Changed to coreFeatures for the new structure
}

// Imports from updates section
import {
  getProjectById,
  updateProject,
  addCoreFeature,
  updateCoreFeature,
  deleteCoreFeature,
  addMilestone,
  deleteMilestone,
  updateMilestone,
  addProjectDocument, // Added from updates
  deleteProjectDocument, // Added from updates
  updateProjectDocument, // Added from updates
  getDocumentComments, // Added from updates
  addDocumentComment, // Added from updates
  deleteDocumentComment, // Added from updates
} from "@/app/actions/projects"
import { getTeamMembers } from "@/app/actions/team"
import {
  getProjectTeamMembers,
  addProjectTeamMember,
  updateProjectTeamMember,
  removeProjectTeamMember,
} from "@/app/actions/project-team"

// Mock data for staticProject (used in getProjectData function)
// This should be replaced with actual data fetching logic or a proper mock
const projectData = {
  1: {
    id: 1,
    title: "Initial Project Alpha",
    description: "This is the first project.",
    status: "completed",
    progress: 100,
    team: [],
    department: "Development",
    startDate: "2023-01-01",
    endDate: "2023-06-30",
    priority: "High",
    budget: "100000", // Changed to string for formatting
    spent: "95000", // Changed to string for formatting
    milestones: [],
    recentActivity: [],
    functionalities: [],
    features: [],
    documents: [],
    coreFeatures: [],
  },
  // Add more mock projects as needed
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useUser() // Assuming useUser hook returns an object with a user property

  const [activeTab, setActiveTab] = useState("overview")
  const [isEditingCoreFeatures, setIsEditingCoreFeatures] = useState(false)
  const [editingFeatureId, setEditingFeatureId] = useState<number | null>(null)
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [founders, setFounders] = useState<any[]>([])
  const [advisors, setAdvisors] = useState<any[]>([])
  const [consultants, setConsultants] = useState<any[]>([])
  const [editingFeatureText, setEditingFeatureText] = useState("")
  const [foundersState, setFoundersState] = useState<any[]>([])
  const [advisorsState, setAdvisorsState] = useState<any[]>([])
  const [consultantsState, setConsultantsState] = useState<any[]>([])
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
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [newMember, setNewMember] = useState({
    selectedMember: "",
    customName: "",
    role: "",
    email: "",
  })
  const [milestones, setMilestones] = useState<any[]>([])
  const [newMilestone, setNewMilestone] = useState({
    name: "",
    status: "pending",
    startDate: "",
    endDate: "",
  })
  const [activities, setActivities] = useState<any[]>([])
  const [newActivity, setNewActivity] = useState({ user: "", action: "", time: "" })
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isTeamEditOpen, setIsTeamEditOpen] = useState(false)
  const [isTimelineEditOpen, setIsTimelineEditOpen] = useState(false)
  const [isActivityEditOpen, setIsActivityEditOpen] = useState(false)
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [selectedPersonForMessage, setSelectedPersonForMessage] = useState<{ name: string; email: string } | null>({
    name: "",
    email: "",
  })
  const [isEditMemberModalOpen, setIsEditMemberModalOpen] = useState(false)
  const [isDeleteMemberModalOpen, setIsDeleteMemberModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<any>(null)
  const [deletingMember, setDeletingMember] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [isDocumentsEditOpen, setIsDocumentsEditOpen] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [coreFeatures, setCoreFeatures] = useState<any[]>([])
  const [newCoreFeature, setNewCoreFeature] = useState("")
  const [isAddingFeature, setIsAddingFeature] = useState(false)
  const [functionalities, setFunctionalities] = useState<string[]>([])
  const [features, setFeatures] = useState<string[]>([])
  const [newFunctionality, setNewFunctionality] = useState("")
  const [newFeature, setNewFeature] = useState("")
  const [isEditingFeatures, setIsEditingFeatures] = useState(false)
  const [newFeatureText, setNewFeatureText] = useState("") // Added for new feature input

  const [editingDocument, setEditingDocument] = useState<any>(null)
  const [documentUploadMode, setDocumentUploadMode] = useState<"upload" | "link">("upload")
  const [sharepointLinkForm, setSharepointLinkForm] = useState({ name: "", url: "", type: "Documentation" })

  const [documentComments, setDocumentComments] = useState<Record<number, any[]>>({})
  const [newComment, setNewComment] = useState<Record<number, string>>({})
  const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({})

  const { isAdministrator, canEditProject, loading: permissionsLoading } = usePermissions()
  const [canEdit, setCanEdit] = useState(false)

  const allOrganizationMembers = [
    ...(Array.isArray(founders) ? founders : []).map((f) => ({
      ...f,
      uniqueId: `founder-${f.id}`,
      category: "Founder",
    })),
    ...(Array.isArray(advisors) ? advisors : []).map((a) => ({
      ...a,
      uniqueId: `advisor-${a.id}`,
      category: "Advisor",
    })),
    ...(Array.isArray(consultants) ? consultants : []).map((c) => ({
      ...c,
      uniqueId: `consultant-${c.id}`,
      category: "Consultant",
    })),
  ]

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const projectId = Number.parseInt(params.id as string)

        const projectData = await getProjectById(projectId)
        if (projectData) {
          console.log("[v0] Project data loaded:", projectData)
          setProject(projectData)
          const normalizedMilestones = (projectData.milestones || []).map((milestone: any) => ({
            id: milestone.id, // Keep the database ID for updates
            name: milestone.title ?? milestone.name ?? "",
            status: milestone.status ?? "pending",
            startDate: milestone.start_date ?? milestone.startDate ?? "",
            endDate: milestone.end_date ?? milestone.endDate ?? "",
            dueDate: milestone.due_date ?? milestone.dueDate ?? "",
          }))
          setMilestones(normalizedMilestones)
          setActivities(projectData.recentActivity || [])
          setDocuments(projectData.documents || [])
          setFunctionalities(projectData.functionalities || [])
          setFeatures(projectData.features || [])
          setCoreFeatures(projectData.coreFeatures || [])

          if (projectData.team && Array.isArray(projectData.team)) {
            console.log("[v0] Found old team data on project:", projectData.team)
          }
        } else {
          console.log("[v0] Project not found:", projectId)
        }

        console.log("[v0] Loading project team members for project:", projectId)
        const projectTeamData = await getProjectTeamMembers(projectId)
        console.log("[v0] Project team members loaded:", projectTeamData)
        setTeamMembers(projectTeamData)

        const { founders: foundersData, advisors: advisorsData, consultants: consultantsData } = await getTeamMembers()
        setFounders(foundersData.map((m: any) => ({ ...m, avatar: m.image })))
        setAdvisors(advisorsData.map((m: any) => ({ ...m, avatar: m.image })))
        setConsultants(consultantsData.map((m: any) => ({ ...m, avatar: m.image })))
      } catch (error) {
        console.error("[v0] Error loading project data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.id])

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
      setCoreFeatures(project.coreFeatures || [])
      setDocuments(project.documents || [])
      const normalizedMilestones = (project.milestones || []).map((milestone: any) => ({
        id: milestone.id, // Keep the database ID for updates
        name: milestone.title ?? milestone.name ?? "",
        status: milestone.status ?? "pending",
        startDate: milestone.start_date ?? milestone.startDate ?? "",
        endDate: milestone.end_date ?? milestone.endDate ?? "",
        dueDate: milestone.due_date ?? milestone.dueDate ?? "",
      }))
      setMilestones(normalizedMilestones)
    }
  }, [project])

  useEffect(() => {
    async function loadDocumentComments() {
      if (documents.length > 0) {
        const commentsMap: Record<number, any[]> = {}
        for (const doc of documents) {
          const comments = await getDocumentComments(doc.id)
          commentsMap[doc.id] = comments
        }
        setDocumentComments(commentsMap)
      }
    }
    loadDocumentComments()
  }, [documents])

  useEffect(() => {
    if (!permissionsLoading && project) {
      setCanEdit(isAdministrator || canEditProject(project.id))
    }
  }, [isAdministrator, canEditProject, project, permissionsLoading])

  if (loading || permissionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-4">The project you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push("/projects")}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Back to Projects
          </button>
        </div>
      </div>
    )
  }

  const getProjectData = () => {
    const projectId = Number.parseInt(params.id as string)
    const storedProject = localStorage.getItem(`project_${projectId}`)

    if (storedProject) {
      try {
        const parsedProject = JSON.parse(storedProject)
        const staticProject = projectData[projectId as keyof typeof projectData]
        if (staticProject) {
          return { ...staticProject, ...parsedProject }
        }
        return parsedProject
      } catch (error) {
        console.log("[v0] Error parsing stored project data:", error)
      }
    }

    const staticProject = projectData[projectId as keyof typeof projectData]
    if (staticProject) {
      return staticProject
    }

    return null
  }

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
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]

        const documentData = {
          name: file.name,
          type: file.name.split(".").pop()?.toUpperCase() || "Unknown",
          url: `https://munuslaw.sharepoint.com/sites/ProjectDocuments/Shared%20Documents/Documentation/${encodeURIComponent(file.name)}`,
        }

        await addProjectDocument(project.id, documentData)
      }

      setSelectedFiles(null)
      const fileInput = document.getElementById("file-upload") as HTMLInputElement
      if (fileInput) fileInput.value = ""

      // Reload project data to get updated documents
      const updatedProject = await getProjectById(project.id)
      if (updatedProject) {
        setDocuments(updatedProject.documents || [])
      }

      console.log("[v0] Documents uploaded successfully")
    } catch (error) {
      console.error("[v0] Error uploading documents:", error)
    } finally {
      setUploadingFile(false)
    }
  }

  const handleAddSharepointLink = async () => {
    if (!sharepointLinkForm.name || !sharepointLinkForm.url) {
      alert("Please fill in all fields")
      return
    }

    setUploadingFile(true)

    try {
      await addProjectDocument(project.id, {
        name: sharepointLinkForm.name,
        type: sharepointLinkForm.type,
        url: sharepointLinkForm.url,
      })

      // Reset form
      setSharepointLinkForm({
        name: "",
        url: "",
        type: "Documentation",
      })

      // Reload project data to get updated documents
      const updatedProject = await getProjectById(project.id)
      if (updatedProject) {
        setDocuments(updatedProject.documents || [])
      }

      console.log("[v0] SharePoint link added successfully")
    } catch (error) {
      console.error("[v0] Error adding SharePoint link:", error)
    } finally {
      setUploadingFile(false)
    }
  }

  const handleEditDocument = (doc: any) => {
    setEditingDocument(doc)
    setSharepointLinkForm({
      name: doc.name,
      url: doc.url || doc.sharepointUrl,
      type: doc.type,
    })
    setDocumentUploadMode("link")
  }

  const handleUpdateDocument = async () => {
    if (!editingDocument) return

    try {
      setUploadingFile(true)

      const updatedDoc = await updateProjectDocument(editingDocument.id, project.id, {
        name: sharepointLinkForm.name,
        url: sharepointLinkForm.url,
        type: sharepointLinkForm.type,
      })

      // Update local state
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === editingDocument.id
            ? {
                ...doc,
                name: updatedDoc.name,
                url: updatedDoc.url,
                sharepointUrl: updatedDoc.url,
                type: updatedDoc.type,
              }
            : doc,
        ),
      )

      // Reset form
      setEditingDocument(null)
      setSharepointLinkForm({ name: "", url: "", type: "Documentation" })

      console.log("[v0] Document updated successfully")
    } catch (error) {
      console.error("[v0] Error updating document:", error)
    } finally {
      setUploadingFile(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingDocument(null)
    setSharepointLinkForm({ name: "", url: "", type: "Documentation" })
    setDocumentUploadMode("upload")
  }

  const handleDeleteDocument = async (documentId: number) => {
    try {
      await deleteProjectDocument(documentId, project.id)

      // Update local state
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId))

      console.log("[v0] Document deleted:", documentId)
    } catch (error) {
      console.error("[v0] Error deleting document:", error)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!project) return

    try {
      const updatedProjectData = {
        ...project,
        ...editForm,
        team: teamMembers,
        milestones: milestones,
        recentActivity: activities,
        documents: documents,
        functionalities: functionalities,
        features: features,
      }

      await updateProject(project.id, updatedProjectData)

      setProject(updatedProjectData)

      console.log("[v0] Project changes saved successfully:", editForm)
      setIsEditOpen(false)
    } catch (error) {
      console.error("[v0] Error saving project changes:", error)
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

  const handleAddTeamMember = async () => {
    if (!project) return

    let memberName = ""
    let memberEmail = newMember.email
    let memberAvatar = "/placeholder.svg"
    let teamMemberId: number | undefined = undefined

    if (newMember.selectedMember === "other") {
      memberName = newMember.customName
    } else if (newMember.selectedMember) {
      const selectedOrgMember = allOrganizationMembers.find((m) => m.uniqueId === newMember.selectedMember)
      if (selectedOrgMember) {
        memberName = selectedOrgMember.name
        memberEmail = selectedOrgMember.email
        memberAvatar = selectedOrgMember.avatar || selectedOrgMember.image || "/placeholder.svg"
        teamMemberId = selectedOrgMember.id
      }
    }

    if (memberName && newMember.role) {
      const newTeamMember = await addProjectTeamMember(project.id, {
        team_member_id: teamMemberId,
        name: memberName,
        role: newMember.role,
        email: memberEmail,
        avatar: memberAvatar,
      })

      if (newTeamMember) {
        setTeamMembers([...teamMembers, newTeamMember])
        setNewMember({ selectedMember: "", customName: "", role: "", email: "" })
        console.log("[v0] Team member added to database")
      }
    }
  }

  const handleRemoveTeamMember = async (index: number) => {
    if (!project) return

    const member = teamMembers[index]
    const success = await removeProjectTeamMember(member.id, project.id)

    if (success) {
      setTeamMembers(teamMembers.filter((_, i) => i !== index))
      console.log("[v0] Team member removed from database")
    }
  }

  const handleSaveTeam = async () => {
    setIsTeamEditOpen(false)
  }

  const handleAddMilestone = () => {
    if (newMilestone.name) {
      // Create a new milestone object without an ID initially
      const milestoneToAdd = { ...newMilestone, id: undefined } // Assign undefined ID for new milestones
      setMilestones([...milestones, milestoneToAdd])
      setNewMilestone({ name: "", status: "pending", startDate: "", endDate: "" })
    }
  }

  const handleRemoveMilestone = (index: number) => {
    const milestoneToRemove = milestones[index]
    if (milestoneToRemove.id) {
      // If the milestone has an ID, it exists in the database, so delete it
      deleteMilestone(milestoneToRemove.id, project!.id) // Ensure project is not null
        .then(() => {
          setMilestones(milestones.filter((_, i) => i !== index))
          console.log("[v0] Milestone deleted from database")
        })
        .catch((error) => console.error("[v0] Error deleting milestone:", error))
    } else {
      // If the milestone is new (no ID), just remove it from the state
      setMilestones(milestones.filter((_, i) => i !== index))
      console.log("[v0] New milestone removed from state")
    }
  }

  const handleMilestoneChange = (index: number, field: string, value: string) => {
    const updated = milestones.map((milestone, i) => (i === index ? { ...milestone, [field]: value } : milestone))
    setMilestones(updated)
  }

  const handleSaveTimeline = async () => {
    if (!project) return
    try {
      console.log("[v0] Saving timeline with dates:", {
        startDate: editForm.startDate,
        endDate: editForm.endDate,
      })

      // Save project dates
      await updateProject(project.id, {
        ...project,
        startDate: editForm.startDate,
        endDate: editForm.endDate,
      })

      // Get existing milestone IDs from the database
      const existingMilestoneIds = (project.milestones || []).map((m: any) => m.id)
      const currentMilestoneIds = milestones.filter((m) => m.id).map((m) => m.id)

      // Delete removed milestones
      for (const existingId of existingMilestoneIds) {
        if (!currentMilestoneIds.includes(existingId)) {
          console.log("[v0] Deleting milestone:", existingId)
          await deleteMilestone(existingId, project.id)
        }
      }

      // Update existing milestones and add new ones
      for (const milestone of milestones) {
        if (milestone.id) {
          // Update existing milestone
          console.log("[v0] Updating milestone:", milestone.id)
          await updateMilestone(milestone.id, project.id, {
            title: milestone.name,
            status: milestone.status,
            start_date: milestone.startDate || null,
            end_date: milestone.endDate || null,
            due_date: milestone.dueDate || null,
          })
        } else {
          // Add new milestone
          console.log("[v0] Adding new milestone:", milestone.name)
          // Ensure milestone data is in the correct format for addMilestone
          await addMilestone(project.id, {
            title: milestone.name,
            status: milestone.status,
            start_date: milestone.startDate || null,
            end_date: milestone.endDate || null,
            due_date: milestone.dueDate || null,
          })
        }
      }

      // Reload project data to get updated milestones
      const refreshedProject = await getProjectById(project.id)
      console.log("[v0] Project after save:", refreshedProject)
      setProject(refreshedProject)

      // Update milestones state with refreshed data
      const refreshedMilestones = (refreshedProject.milestones || []).map((milestone: any) => ({
        id: milestone.id,
        name: milestone.title ?? milestone.name ?? "",
        status: milestone.status ?? "pending",
        startDate: milestone.start_date ?? milestone.startDate ?? "",
        endDate: milestone.end_date ?? milestone.endDate ?? "",
        dueDate: milestone.due_date ?? milestone.dueDate ?? "",
      }))
      setMilestones(refreshedMilestones)

      setIsTimelineEditOpen(false)
    } catch (error) {
      console.error("[v0] Error saving timeline:", error)
    }
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
    setEditingMember({
      ...member,
      index,
      name: member.name || "",
      role: member.role || "",
      email: member.email || "",
      avatar: member.avatar || "",
    })
    setIsEditMemberModalOpen(true)
  }

  const handleDeleteMember = (member: any, index: number) => {
    console.log("[v0] Deleting team member:", member)
    setDeletingMember({ ...member, index })
    setIsDeleteMemberModalOpen(true)
  }

  const handleSaveEditMember = async () => {
    if (!editingMember || !project) return

    try {
      const updated = await updateProjectTeamMember(editingMember.id, project.id, {
        name: editingMember.name,
        role: editingMember.role,
        email: editingMember.email,
        avatar: editingMember.avatar,
      })

      if (updated) {
        const updatedTeamMembers = [...teamMembers]
        updatedTeamMembers[editingMember.index] = updated
        setTeamMembers(updatedTeamMembers)
        console.log("[v0] Saved edited team member to database")
      }

      setIsEditMemberModalOpen(false)
      setEditingMember(null)
    } catch (error) {
      console.error("[v0] Error saving edited team member:", error)
    }
  }

  const handleConfirmDeleteMember = async () => {
    if (!deletingMember || !project) return

    try {
      const success = await removeProjectTeamMember(deletingMember.id, project.id)

      if (success) {
        const updatedTeamMembers = teamMembers.filter((_, index) => index !== deletingMember.index)
        setTeamMembers(updatedTeamMembers)
        console.log("[v0] Deleted team member from database")
      }

      setIsDeleteMemberModalOpen(false)
      setDeletingMember(null)
    } catch (error) {
      console.error("[v0] Error deleting team member:", error)
    }
  }

  const handleBackToProjects = () => {
    console.log("[v0] Navigating back to projects")
    router.push("/projects")
  }

  // Update startEditingFeature to set editingFeatureId and editingFeatureText
  const startEditingFeature = (feature: any) => {
    setEditingFeatureId(feature.id)
    setEditingFeatureText(feature.description)
  }

  const handleSaveCoreFeature = async (featureId: number, newDescription: string) => {
    if (!newDescription.trim()) {
      console.log("[v0] Cannot save feature - empty description")
      return
    }

    console.log("[v0] Updating core feature:", featureId, newDescription)

    try {
      const result = await updateCoreFeature(featureId, newDescription.trim())
      console.log("[v0] updateCoreFeature result:", result)

      setEditingFeatureId(null)

      // Reload project data to get updated core features
      const updatedProject = await getProjectById(project.id)
      if (updatedProject) {
        setProject(updatedProject)
        setCoreFeatures(updatedProject.coreFeatures || [])
      }
      console.log("[v0] Core feature updated successfully")
    } catch (error) {
      console.error("[v0] Error updating core feature:", error)
      alert("Failed to update core feature. Please try again.")
    }
  }

  const cancelEditingFeature = () => {
    setEditingFeatureId(null)
    setEditingFeatureText("")
  }

  const handleSaveFeatures = async () => {
    if (!project) return

    try {
      if (editingFeatureId !== null && editingFeatureText.trim()) {
        await handleSaveCoreFeature(editingFeatureId, editingFeatureText)
      }

      const updatedProject = {
        ...project,
        functionalities: functionalities,
        features: features,
      }

      await updateProject(project.id, updatedProject)
      setProject(updatedProject)
      setIsEditingFeatures(false)
    } catch (error) {
      console.error("[v0] Error saving features:", error)
    }
  }

  // Update addCoreFeatureHandler to use the correct database action
  const addCoreFeatureHandler = async () => {
    if (!newCoreFeature.trim() || !project) {
      console.log("[v0] Cannot add feature - empty input or no project")
      return
    }

    console.log("[v0] Starting to add core feature:", newCoreFeature)
    setIsAddingFeature(true)

    try {
      console.log("[v0] Calling addCoreFeature action with project ID:", project.id)
      const result = await addCoreFeature(project.id, newCoreFeature.trim())
      console.log("[v0] addCoreFeature result:", result)

      setNewCoreFeature("")

      // Reload project data to get updated core features
      console.log("[v0] Reloading project data...")
      const updatedProject = await getProjectById(project.id)
      console.log("[v0] Updated project data:", updatedProject)

      if (updatedProject) {
        setProject(updatedProject)
        setCoreFeatures(updatedProject.coreFeatures || [])
        console.log("[v0] Core features updated:", updatedProject.coreFeatures)
      }
      console.log("[v0] Core feature added successfully")
    } catch (error) {
      console.error("[v0] Error adding core feature:", error)
      alert("Failed to add core feature. Please try again.")
    } finally {
      setIsAddingFeature(false)
    }
  }

  const handleDeleteCoreFeature = async (featureId: number) => {
    if (!project) return

    console.log("[v0] Deleting core feature:", featureId)

    try {
      const result = await deleteCoreFeature(featureId, project.id)
      console.log("[v0] deleteCoreFeature result:", result)

      // Reload project data to get updated core features
      const updatedProject = await getProjectById(project.id)
      if (updatedProject) {
        setProject(updatedProject)
        setCoreFeatures(updatedProject.coreFeatures || [])
      }
      console.log("[v0] Core feature deleted successfully")
    } catch (error) {
      console.error("[v0] Error deleting core feature:", error)
      alert("Failed to delete core feature. Please try again.")
    }
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

  // Handle adding a new core feature from the input field
  const handleAddCoreFeature = async () => {
    if (!newFeatureText.trim() || !project) {
      console.log("[v0] Cannot add feature - empty input or no project")
      return
    }

    console.log("[v0] Starting to add core feature:", newFeatureText)

    try {
      console.log("[v0] Calling addCoreFeature action with project ID:", project.id)
      const result = await addCoreFeature(project.id, newFeatureText.trim())
      console.log("[v0] addCoreFeature result:", result)

      setNewFeatureText("") // Clear the input field

      // Reload project data to get updated core features
      console.log("[v0] Reloading project data...")
      const updatedProject = await getProjectById(project.id)
      console.log("[v0] Updated project data:", updatedProject)

      if (updatedProject) {
        setProject(updatedProject)
        setCoreFeatures(updatedProject.coreFeatures || [])
        console.log("[v0] Core features updated:", updatedProject.coreFeatures)
      }
      console.log("[v0] Core feature added successfully")
    } catch (error) {
      console.error("[v0] Error adding core feature:", error)
      alert("Failed to add core feature. Please try again.")
    }
  }

  const handleDownloadDocument = (doc: any) => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement("a")
    link.href = doc.sharepointUrl || doc.url
    link.download = doc.name // Suggest filename for download
    link.target = "_blank"
    link.rel = "noopener noreferrer"

    // Append to body, click, and remove
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleAddComment = async (documentId: number) => {
    const comment = newComment[documentId]?.trim()
    if (!comment || !user?.name) return

    try {
      const newCommentData = await addDocumentComment(documentId, user.name, comment)
      setDocumentComments((prev) => ({
        ...prev,
        [documentId]: [...(prev[documentId] || []), newCommentData],
      }))
      setNewComment((prev) => ({ ...prev, [documentId]: "" }))
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }

  const handleDeleteComment = async (documentId: number, commentId: number) => {
    try {
      await deleteDocumentComment(commentId)
      setDocumentComments((prev) => ({
        ...prev,
        [documentId]: prev[documentId].filter((c) => c.id !== commentId),
      }))
    } catch (error) {
      console.error("Error deleting comment:", error)
    }
  }

  const toggleComments = (documentId: number) => {
    setExpandedComments((prev) => ({
      ...prev,
      [documentId]: !prev[documentId],
    }))
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white">
        <div className="flex h-20 items-center justify-between px-8">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <img src="/munus-logo.jpg" alt="Munus Logo" className="h-8 w-auto" />
              <span className="text-2xl font-bold text-gray-900 font-serif">Munus Hub</span>
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
                      placeholder="e.g., 45000"
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          {/* Project Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 font-serif">{project.title}</h1>
                <p className="text-gray-600 max-w-3xl">{project.description}</p>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-orange-100 text-orange-800 border-orange-200">{project.status}</Badge>
                {project.priority && (
                  <Badge className="bg-red-100 text-red-800 border-red-200">{project.priority}</Badge>
                )}
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
                    {project.startDate && project.endDate // Use startDate/endDate from project object
                      ? Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                      : 0}{" "}
                    days left
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {project.startDate && new Date(project.startDate).toLocaleDateString()} -{" "}
                    {project.endDate && new Date(project.endDate).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Team Size</span>
                  </div>
                  <p className="text-lg font-bold mt-1">{project.team.length} members</p>{" "}
                  {/* Use project.team.length */}
                  <p className="text-xs text-muted-foreground">{project.department || "N/A"}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Progress</span>
                  </div>
                  <p className="text-lg font-bold mt-1">{project.progress || 0}%</p>
                  <Progress value={project.progress || 0} className="h-2 mt-2" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Budget</span>
                  </div>
                  <p className="text-lg font-bold mt-1">
                    {project.budget
                      ? new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(Number(project.budget)) // Ensure project.budget is a number
                      : "N/A"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Spent:{" "}
                    {project.spent
                      ? new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(Number(project.spent)) // Ensure project.spent is a number
                      : "N/A"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm"
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="team"
              className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm"
              onClick={() => setActiveTab("team")}
            >
              Team
            </TabsTrigger>
            <TabsTrigger
              value="timeline"
              className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm"
              onClick={() => setActiveTab("timeline")}
            >
              Timeline
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm"
              onClick={() => setActiveTab("documents")}
            >
              Project Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="space-y-6">
              {/* Core Platform Features - Now full width and larger */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Core Platform Features</CardTitle>
                    <CardDescription>Key capabilities and system functions organized by category</CardDescription>
                  </div>
                  {canEdit && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditingFeatures(!isEditingFeatures)}>
                      <Edit className="h-4 w-4 mr-2" />
                      {isEditingFeatures ? "Cancel" : "Edit"}
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="min-h-[400px]">
                  {isEditingFeatures ? (
                    <div className="space-y-4">
                      {coreFeatures.length === 0 && (
                        <div className="text-sm text-muted-foreground mb-4 p-4 bg-muted/50 rounded-lg">
                          <p className="font-medium mb-1">No core features yet</p>
                          <p>Start by adding your first core platform feature below.</p>
                        </div>
                      )}
                      <div className="space-y-2">
                        {coreFeatures.map(
                          (
                            feature: any, // Changed to use 'any' for simplicity with new structure
                          ) => (
                            <div key={feature.id} className="flex items-center gap-2 p-2 border rounded">
                              {editingFeatureId === feature.id ? (
                                <>
                                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                                  <Input
                                    value={editingFeatureText}
                                    onChange={(e) => setEditingFeatureText(e.target.value)}
                                    onKeyPress={(e) => {
                                      if (e.key === "Enter") handleSaveCoreFeature(feature.id, editingFeatureText)
                                      if (e.key === "Escape") cancelEditingFeature()
                                    }}
                                    className="flex-1 text-sm"
                                    autoFocus
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSaveCoreFeature(feature.id, editingFeatureText)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Check className="h-3 w-3 text-green-600" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={cancelEditingFeature}
                                    className="h-6 w-6 p-0"
                                  >
                                    <X className="h-3 w-3 text-red-600" />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                                  <span className="flex-1 text-sm">{feature.description}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => startEditingFeature(feature)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteCoreFeature(feature.id)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                            </div>
                          ),
                        )}
                        {canEdit && (
                          <div className="space-y-2 pt-2">
                            <label className="text-sm font-medium">Add New Feature</label>
                            <div className="flex gap-2">
                              <Input
                                placeholder="Enter feature description..."
                                value={newCoreFeature}
                                onChange={(e) => {
                                  console.log("[v0] Input changed:", e.target.value)
                                  setNewCoreFeature(e.target.value)
                                }}
                                onKeyPress={(e) => {
                                  console.log("[v0] Key pressed:", e.key)
                                  if (e.key === "Enter") {
                                    console.log("[v0] Enter key pressed, calling addCoreFeatureHandler")
                                    addCoreFeatureHandler()
                                  }
                                }}
                                className="text-sm"
                                disabled={isAddingFeature}
                              />
                              <Button
                                onClick={() => {
                                  console.log("[v0] Add button clicked")
                                  addCoreFeatureHandler()
                                }}
                                size="sm"
                                disabled={isAddingFeature || !newCoreFeature.trim()}
                              >
                                {isAddingFeature ? (
                                  <span className="h-4 w-4 animate-spin">⏳</span>
                                ) : (
                                  <Plus className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsEditingFeatures(false)}>
                          Done
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {coreFeatures.length === 0 ? (
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-semibold text-base mb-3 flex items-center gap-2">
                              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                                1
                              </span>
                              User Management & Access Control
                            </h4>
                            <ul className="space-y-2 ml-8">
                              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></span>
                                Role-based access permissions
                              </li>
                              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></span>
                                Multi-tenant architecture with granular user segmentation
                              </li>
                              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></span>
                                Integration with Microsoft Entra ID for identity federation and SSO
                              </li>
                              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></span>
                                Conditional access policies and MFA enforcement
                              </li>
                              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></span>
                                Audit logs and access history tracking
                              </li>
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-semibold text-base mb-3 flex items-center gap-2">
                              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                                2
                              </span>
                              KYC Integration
                            </h4>
                            <ul className="space-y-2 ml-8">
                              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></span>
                                API-based integration with third-party KYC providers (e.g., Onfido, Jumio, Trulioo)
                              </li>
                              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></span>
                                Real-time identity verification workflow
                              </li>
                            </ul>
                          </div>
                        </div>
                      ) : (
                        /* Unified custom features display without distinction */
                        <div className="space-y-3">
                          <ul className="space-y-2">
                            {coreFeatures.map((feature: any) => (
                              <li key={feature.id} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <span>{feature.description}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Removed Project Milestones section */}
                {/* Removed Recent Activity section */}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>People working on this project</CardDescription>
                </div>
                {canEdit && (
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
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={member.avatar || "/placeholder.svg"} />
                                  <AvatarFallback>
                                    {member.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
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
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
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
                        {canEdit && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                            onClick={() => handleEditMember(member, index)}
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        )}
                        {canEdit && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-red-600 hover:text-red-700 bg-transparent"
                            onClick={() => handleDeleteMember(member, index)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle>Project Timeline</CardTitle>
                  <CardDescription>Milestones and important dates</CardDescription>
                </div>
                {canEdit && (
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
                                  onValueChange={(value) => handleMilestoneChange(index, "status", value)}
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
                              <div className="grid grid-cols-2 gap-2">
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
                              onValueChange={(value) => setNewMilestone({ ...newMilestone, status: value })}
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
                          <div className="grid grid-cols-2 gap-2">
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
                )}
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
                                <div className="font-medium">{new Date(milestone.startDate).toLocaleDateString()}</div>
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
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle>Project Documents</CardTitle>
                  <CardDescription>Files and resources related to this project</CardDescription>
                </div>
                {canEdit && (
                  <Dialog open={isDocumentsEditOpen} onOpenChange={setIsDocumentsEditOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Manage Documents
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Manage Project Documents</DialogTitle>
                        <DialogDescription>
                          Upload, organize, and manage project files and documentation.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        {/* Current Documents */}
                        {documents.length > 0 && (
                          <div className="space-y-2">
                            {documents.map((doc) => (
                              <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-blue-100 rounded">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium">{doc.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {doc.type} • Added{" "}
                                      {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : "N/A"}
                                    </p>
                                    <p className="text-xs text-blue-600 break-all">SharePoint: {doc.url}</p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" onClick={() => window.open(doc.url, "_blank")}>
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => handleEditDocument(doc)}>
                                    <Edit className="h-4 w-4" />
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
                        )}

                        {/* Upload New Document */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{editingDocument ? "Edit Document" : "Add Document"}</h4>
                            {!editingDocument && (
                              <div className="flex gap-2">
                                <Button
                                  variant={documentUploadMode === "upload" ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setDocumentUploadMode("upload")}
                                >
                                  Upload File
                                </Button>
                                <Button
                                  variant={documentUploadMode === "link" ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setDocumentUploadMode("link")}
                                >
                                  SharePoint Link
                                </Button>
                              </div>
                            )}
                          </div>

                          {editingDocument ? (
                            <div className="border border-gray-300 rounded-lg p-6 space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-doc-name">Document Name</Label>
                                <Input
                                  id="edit-doc-name"
                                  placeholder="e.g., Project Requirements.docx"
                                  value={sharepointLinkForm.name}
                                  onChange={(e) =>
                                    setSharepointLinkForm({ ...sharepointLinkForm, name: e.target.value })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-doc-url">SharePoint URL</Label>
                                <Input
                                  id="edit-doc-url"
                                  placeholder="https://yourcompany.sharepoint.com/..."
                                  value={sharepointLinkForm.url}
                                  onChange={(e) =>
                                    setSharepointLinkForm({ ...sharepointLinkForm, url: e.target.value })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-doc-type">Document Type</Label>
                                <select
                                  id="edit-doc-type"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                  value={sharepointLinkForm.type}
                                  onChange={(e) =>
                                    setSharepointLinkForm({ ...sharepointLinkForm, type: e.target.value })
                                  }
                                >
                                  <option value="Documentation">Documentation</option>
                                  <option value="Planning">Planning</option>
                                  <option value="Design">Design</option>
                                  <option value="Development">Development</option>
                                  <option value="Testing">Testing</option>
                                  <option value="Other">Other</option>
                                </select>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  className="flex-1"
                                  onClick={handleUpdateDocument}
                                  disabled={uploadingFile || !sharepointLinkForm.name || !sharepointLinkForm.url}
                                >
                                  {uploadingFile ? "Updating..." : "Update Document"}
                                </Button>
                                <Button variant="outline" className="flex-1 bg-transparent" onClick={handleCancelEdit}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : documentUploadMode === "upload" ? (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
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
                          ) : (
                            <div className="border border-gray-300 rounded-lg p-6 space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="doc-name">Document Name</Label>
                                <Input
                                  id="doc-name"
                                  placeholder="e.g., Project Requirements.docx"
                                  value={sharepointLinkForm.name}
                                  onChange={(e) =>
                                    setSharepointLinkForm({ ...sharepointLinkForm, name: e.target.value })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="doc-url">SharePoint URL</Label>
                                <Input
                                  id="doc-url"
                                  placeholder="https://yourcompany.sharepoint.com/..."
                                  value={sharepointLinkForm.url}
                                  onChange={(e) =>
                                    setSharepointLinkForm({ ...sharepointLinkForm, url: e.target.value })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="doc-type">Document Type</Label>
                                <select
                                  id="doc-type"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                  value={sharepointLinkForm.type}
                                  onChange={(e) =>
                                    setSharepointLinkForm({ ...sharepointLinkForm, type: e.target.value })
                                  }
                                >
                                  <option value="Documentation">Documentation</option>
                                  <option value="Planning">Planning</option>
                                  <option value="Design">Design</option>
                                  <option value="Development">Development</option>
                                  <option value="Testing">Testing</option>
                                  <option value="Other">Other</option>
                                </select>
                              </div>
                              <Button
                                className="w-auto px-6"
                                onClick={handleAddSharepointLink}
                                disabled={uploadingFile || !sharepointLinkForm.name || !sharepointLinkForm.url}
                              >
                                {uploadingFile ? "Adding..." : "Add SharePoint Link"}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDocumentsEditOpen(false)}>
                          Close
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="p-4 border border-border rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 bg-blue-100 rounded">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{doc.name}</h4>
                          <p className="text-sm text-muted-foreground">{doc.type}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Added {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : "N/A"}
                          </p>
                          <p className="text-xs text-blue-600 mt-1 break-all">SharePoint Link Available</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mb-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => window.open(doc.url, "_blank")}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => handleDownloadDocument(doc)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>

                      {/* Comments section for each document */}
                      <div className="border-t pt-3 mt-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-between mb-2"
                          onClick={() => toggleComments(doc.id)}
                        >
                          <span className="text-sm font-medium">
                            Comments ({documentComments[doc.id]?.length || 0})
                          </span>
                          {expandedComments[doc.id] ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>

                        {expandedComments[doc.id] && (
                          <div className="space-y-3">
                            {/* Display existing comments */}
                            {documentComments[doc.id]?.length > 0 ? (
                              <div className="space-y-2 max-h-60 overflow-y-auto">
                                {documentComments[doc.id].map((comment) => (
                                  <div key={comment.id} className="flex gap-2 p-2 bg-muted/50 rounded">
                                    <Avatar className="h-6 w-6">
                                      <AvatarFallback className="text-xs">
                                        {comment.author
                                          .split(" ")
                                          .map((n: string) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs font-medium">{comment.author}</span>
                                        <div className="flex items-center gap-1">
                                          <span className="text-xs text-muted-foreground">
                                            {new Date(comment.created_at).toLocaleDateString()}
                                          </span>
                                          {user?.name === comment.author && (
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-5 w-5 p-0"
                                              onClick={() => handleDeleteComment(doc.id, comment.id)}
                                            >
                                              <Trash2 className="h-3 w-3 text-red-600" />
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                      <p className="text-xs text-muted-foreground mt-1">{comment.content}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-muted-foreground text-center py-2">No comments yet</p>
                            )}

                            {/* Add new comment */}
                            <div className="flex gap-2">
                              <Input
                                placeholder="Add a comment..."
                                value={newComment[doc.id] || ""}
                                onChange={(e) => setNewComment((prev) => ({ ...prev, [doc.id]: e.target.value }))}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault()
                                    handleAddComment(doc.id)
                                  }
                                }}
                                className="text-sm"
                              />
                              <Button
                                size="sm"
                                onClick={() => handleAddComment(doc.id)}
                                disabled={!newComment[doc.id]?.trim()}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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
