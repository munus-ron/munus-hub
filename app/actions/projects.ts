"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getProjects() {
  try {
    const supabase = await createClient()

    console.log("[v0] Attempting to fetch projects from Supabase")

    const { data: projects, error } = await supabase
      .from("projects")
      .select(
        `
      *,
      project_core_features (*),
      project_milestones (*),
      project_documents (*),
      project_activities (*),
      project_team_members (*)
    `,
      )
      .order("position", { ascending: true, nullsFirst: false })

    if (error) {
      console.error("[v0] Supabase error fetching projects:", JSON.stringify(error, null, 2))
      return []
    }

    console.log("[v0] Successfully fetched", projects?.length || 0, "projects")

    return projects.map((project) => ({
      ...project,
      title: project.name,
      startDate: project.start_date,
      endDate: project.end_date,
      coreFeatures: (project.project_core_features || []).map((cf: any) => ({
        id: cf.id,
        description: cf.feature,
        created_at: cf.created_at,
      })),
      milestones: project.project_milestones || [],
      documents: project.project_documents || [],
      activities: project.project_activities || [],
      team: (project.project_team_members || []).map((tm: any) => ({
        id: tm.id,
        name: tm.name,
        role: tm.role,
        email: tm.email,
        avatar: tm.avatar,
      })),
    }))
  } catch (error) {
    console.error("[v0] Error fetching projects:", error)
    console.error("[v0] Error type:", typeof error)
    console.error("[v0] Error details:", error instanceof Error ? error.message : String(error))
    return []
  }
}

export async function getProjectById(id: number) {
  const supabase = await createClient()

  const { data: project, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      project_core_features (*),
      project_milestones (*),
      project_documents (*),
      project_activities (*),
      project_team_members (*)
    `,
    )
    .eq("id", id)
    .single()

  if (error) {
    console.error("[v0] Error fetching project:", error)
    return null
  }

  return {
    ...project,
    title: project.name,
    startDate: project.start_date,
    endDate: project.end_date,
    coreFeatures: (project.project_core_features || []).map((cf: any) => ({
      id: cf.id,
      description: cf.feature,
      created_at: cf.created_at,
    })),
    milestones: (project.project_milestones || []).map((m: any) => ({
      id: m.id,
      name: m.title,
      status: m.status,
      startDate: m.start_date,
      endDate: m.end_date,
    })),
    documents: project.project_documents || [],
    activities: project.project_activities || [],
    team: (project.project_team_members || []).map((tm: any) => ({
      id: tm.id,
      name: tm.name,
      role: tm.role,
      email: tm.email,
      avatar: tm.avatar,
    })),
  }
}

export async function createProject(projectData: any) {
  const supabase = await createClient()

  const { data: maxPositionData } = await supabase
    .from("projects")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .single()

  const nextPosition = (maxPositionData?.position || 0) + 1

  // Insert main project
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({
      name: projectData.title,
      description: projectData.description,
      status: projectData.status,
      progress: 0,
      start_date: projectData.startDate,
      end_date: projectData.endDate,
      team_count: 0,
      position: nextPosition, // Set position for new project
    })
    .select()
    .single()

  if (projectError) {
    console.error("[v0] Error creating project:", projectError)
    throw new Error("Failed to create project")
  }

  // Insert default core features
  const defaultFeatures = [
    "Core functionality implementation",
    "User interface development",
    "Testing and quality assurance",
    "Documentation and deployment",
  ]

  await supabase.from("project_core_features").insert(
    defaultFeatures.map((feature) => ({
      project_id: project.id,
      feature,
    })),
  )

  // Insert default milestones
  const defaultMilestones = [
    {
      project_id: project.id,
      title: "Project Kickoff",
      status: "completed",
      start_date: projectData.startDate,
      end_date: projectData.startDate,
    },
    {
      project_id: project.id,
      title: "Development Phase",
      status: "in-progress",
      start_date: projectData.startDate,
      end_date: projectData.endDate,
    },
    {
      project_id: project.id,
      title: "Testing & Review",
      status: "pending",
      start_date: projectData.endDate,
      end_date: projectData.endDate,
    },
    {
      project_id: project.id,
      title: "Project Completion",
      status: "pending",
      start_date: projectData.endDate,
      end_date: projectData.endDate,
    },
  ]

  await supabase.from("project_milestones").insert(defaultMilestones)

  // Insert default documents
  const defaultDocuments = [
    {
      project_id: project.id,
      name: "Project Charter.pdf",
      type: "Planning",
      url: `https://sharepoint.company.com/projects/${projectData.title.toLowerCase().replace(/\s+/g, "-")}/charter.pdf`,
    },
    {
      project_id: project.id,
      name: "Requirements Document.docx",
      type: "Documentation",
      url: `https://sharepoint.company.com/projects/${projectData.title.toLowerCase().replace(/\s+/g, "-")}/requirements.docx`,
    },
  ]

  await supabase.from("project_documents").insert(defaultDocuments)

  revalidatePath("/projects")
  return project
}

export async function updateProject(id: number, projectData: any) {
  const supabase = await createClient()

  let sanitizedBudget = null
  if (projectData.budget !== undefined && projectData.budget !== null && projectData.budget !== "") {
    // Remove dollar signs, commas, and other non-numeric characters except decimal point
    const budgetString = String(projectData.budget).replace(/[$,]/g, "")
    const budgetNumber = Number.parseFloat(budgetString)
    sanitizedBudget = isNaN(budgetNumber) ? null : budgetNumber
  }

  const updateData: any = {
    name: projectData.title,
    description: projectData.description,
    status: projectData.status,
    progress: projectData.progress,
    start_date: projectData.startDate || null, // Convert empty string to null
    end_date: projectData.endDate || null, // Convert empty string to null
    updated_at: new Date().toISOString(),
  }

  // Add budget if provided
  if (projectData.budget !== undefined) {
    updateData.budget = sanitizedBudget
  }

  const { error } = await supabase.from("projects").update(updateData).eq("id", id)

  if (error) {
    console.error("[v0] Error updating project:", error)
    throw new Error("Failed to update project")
  }

  revalidatePath("/projects")
  revalidatePath(`/projects/${id}`)
}

export async function deleteProject(id: number) {
  const supabase = await createClient()

  const { error } = await supabase.from("projects").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting project:", error)
    throw new Error("Failed to delete project")
  }

  revalidatePath("/projects")
}

export async function addCoreFeature(projectId: number, feature: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("project_core_features")
    .insert({
      project_id: projectId,
      feature,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error adding core feature:", error)
    throw new Error("Failed to add core feature")
  }

  revalidatePath(`/projects/${projectId}`)
  return data
}

export async function updateCoreFeature(id: number, feature: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("project_core_features").update({ feature }).eq("id", id)

  if (error) {
    console.error("[v0] Error updating core feature:", error)
    throw new Error("Failed to update core feature")
  }

  revalidatePath("/projects")
}

export async function deleteCoreFeature(id: number, projectId: number) {
  const supabase = await createClient()

  const { error } = await supabase.from("project_core_features").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting core feature:", error)
    throw new Error("Failed to delete core feature")
  }

  revalidatePath(`/projects/${projectId}`)
}

export async function updateMilestone(id: number, projectId: number, data: any) {
  const supabase = await createClient()

  const updateData: any = {}

  if (data.name !== undefined) updateData.title = data.name
  if (data.status !== undefined) updateData.status = data.status
  if (data.startDate !== undefined) updateData.start_date = data.startDate || null
  if (data.endDate !== undefined) updateData.end_date = data.endDate || null

  const { error } = await supabase.from("project_milestones").update(updateData).eq("id", id)

  if (error) {
    console.error("[v0] Error updating milestone:", error)
    throw new Error("Failed to update milestone")
  }

  revalidatePath(`/projects/${projectId}`)
}

export async function addMilestone(projectId: number, milestoneData: any) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("project_milestones")
    .insert({
      project_id: projectId,
      title: milestoneData.name,
      status: milestoneData.status,
      start_date: milestoneData.startDate || null,
      end_date: milestoneData.endDate || null,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error adding milestone:", error)
    throw new Error("Failed to add milestone")
  }

  revalidatePath(`/projects/${projectId}`)
  return data
}

export async function deleteMilestone(id: number, projectId: number) {
  const supabase = await createClient()

  const { error } = await supabase.from("project_milestones").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting milestone:", error)
    throw new Error("Failed to delete milestone")
  }

  revalidatePath(`/projects/${projectId}`)
}

export async function updateProjectPositions(projectIds: number[]) {
  const supabase = await createClient()

  // Update each project's position based on its index in the array
  const updates = projectIds.map((id, index) => ({
    id,
    position: index + 1,
  }))

  for (const update of updates) {
    await supabase.from("projects").update({ position: update.position }).eq("id", update.id)
  }

  revalidatePath("/projects")
}

export async function addProjectDocument(projectId: number, documentData: any) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("project_documents")
    .insert({
      project_id: projectId,
      name: documentData.name,
      type: documentData.type,
      url: documentData.url,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error adding document:", error)
    throw new Error("Failed to add document")
  }

  revalidatePath(`/projects/${projectId}`)
  return data
}

export async function deleteProjectDocument(id: number, projectId: number) {
  const supabase = await createClient()

  const { error } = await supabase.from("project_documents").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting document:", error)
    throw new Error("Failed to delete document")
  }

  revalidatePath(`/projects/${projectId}`)
}

export async function updateProjectDocument(id: number, projectId: number, documentData: any) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("project_documents")
    .update({
      name: documentData.name,
      type: documentData.type,
      url: documentData.url,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("[v0] Error updating document:", error)
    throw new Error("Failed to update document")
  }

  revalidatePath(`/projects/${projectId}`)
  return data
}

export async function getDocumentComments(documentId: number) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("project_document_comments")
    .select("*")
    .eq("document_id", documentId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching document comments:", error)
    return []
  }

  return data
}

export async function addDocumentComment(documentId: number, author: string, content: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("project_document_comments")
    .insert({
      document_id: documentId,
      author,
      content,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error adding document comment:", error)
    throw new Error("Failed to add comment")
  }

  return data
}

export async function deleteDocumentComment(commentId: number) {
  const supabase = await createClient()

  const { error } = await supabase.from("project_document_comments").delete().eq("id", commentId)

  if (error) {
    console.error("[v0] Error deleting document comment:", error)
    throw new Error("Failed to delete comment")
  }
}
