"use server";

import { createClient } from "@/lib/supabase/server";

export interface UserRole {
  email: string;
  name: string;
  role: "administrator" | "lead" | "user";
}

export interface ProjectLead {
  projectId: number;
  userEmail: string;
}

// Defines the structure of the user record returned from the DB
export interface UserRecord {
  id: string; // The primary key, often derived from email or a dedicated UUID
  email: string;
  name: string;
  role: string;
}

// Defines the structure for creating a new user
export interface NewUserData {
  email: string;
  name: string;
  role: string;
}

// Get current user's role
export async function getUserRole(email: string): Promise<UserRole | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.from("user_roles").select("*").eq("user_email", email).single();

    if (error) {
      console.error("[v0] Error fetching user role:", error);
      return null;
    }

    return {
      email: data.user_email,
      name: data.name,
      role: data.role,
    };
  } catch (error) {
    console.error("[v0] Error in getUserRole:", error);
    return null;
  }
}

// Check if user is an administrator
export async function isAdministrator(email: string): Promise<boolean> {
  const userRole = await getUserRole(email);
  return userRole?.role === "administrator";
}

// Check if user is a lead for a specific project
export async function isProjectLead(email: string, projectId: number): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.from("project_leads").select("*").eq("user_email", email).eq("project_id", projectId).single();

    if (error) {
      return false;
    }

    return !!data;
  } catch (error) {
    console.error("[v0] Error checking project lead:", error);
    return false;
  }
}

// Get all projects a user is a lead for
export async function getUserLeadProjects(email: string): Promise<number[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.from("project_leads").select("project_id").eq("user_email", email);

    if (error) {
      console.error("[v0] Error fetching lead projects:", error);
      return [];
    }

    return data.map((item) => item.project_id);
  } catch (error) {
    console.error("[v0] Error in getUserLeadProjects:", error);
    return [];
  }
}

// Check if user can edit a project (admin or project lead)
export async function canEditProject(email: string, projectId: number): Promise<boolean> {
  const isAdmin = await isAdministrator(email);
  if (isAdmin) return true;

  const isLead = await isProjectLead(email, projectId);
  return isLead;
}

// Add a project lead
export async function addProjectLead(projectId: number, userEmail: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("project_leads").insert({
      project_id: projectId,
      user_email: userEmail,
    });

    if (error) {
      console.error("[v0] Error adding project lead:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("[v0] Error in addProjectLead:", error);
    return { success: false, error: "Failed to add project lead" };
  }
}

// Remove a project lead
export async function removeProjectLead(projectId: number, userEmail: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("project_leads").delete().eq("project_id", projectId).eq("user_email", userEmail);

    if (error) {
      console.error("[v0] Error removing project lead:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("[v0] Error in removeProjectLead:", error);
    return { success: false, error: "Failed to remove project lead" };
  }
}

// Update user role
export async function updateUserRole(email: string, role: "administrator" | "lead" | "user") {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("user_roles").upsert({
      user_email: email,
      role: role,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("[v0] Error updating user role:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("[v0] Error in updateUserRole:", error);
    return { success: false, error: "Failed to update user role" };
  }
}

// Get all user roles (for admin page)
export async function getAllUserRoles() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.from("user_roles").select("*").order("user_email");

    if (error) {
      console.error("[v0] Error fetching user roles:", error);
      return [];
    }

    return data.map((item) => ({
      email: item.user_email,
      name: item.name,
      role: item.role,
    }));
  } catch (error) {
    console.error("[v0] Error in getAllUserRoles:", error);
    return [];
  }
}

// Get all users with their roles and assigned projects
export async function getAllUsers() {
  try {
    const supabase = await createClient();

    // Get all user roles
    const { data: userRoles, error: rolesError } = await supabase.from("user_roles").select("*").order("user_email");

    if (rolesError) {
      console.error("[v0] Error fetching user roles:", rolesError);
      return [];
    }

    // Get all project leads
    const { data: projectLeads, error: leadsError } = await supabase.from("project_leads").select("user_email, project_id");

    if (leadsError) {
      console.error("[v0] Error fetching project leads:", leadsError);
    }

    // Combine data
    const users = userRoles.map((user) => ({
      email: user.user_email,
      name: user.name,
      role: user.role,
      projects: projectLeads?.filter((lead) => lead.user_email === user.user_email).map((lead) => lead.project_id) || [],
      createdAt: user.created_at,
    }));

    return users;
  } catch (error) {
    console.error("[v0] Error in getAllUsers:", error);
    return [];
  }
}

// Add a new user
export async function addUser(email: string, name: string, password: string, role: "administrator" | "lead" | "user", projectIds: number[] = []) {
  try {
    const supabase = await createClient();

    const hashedPassword = await hashPassword(password);

    console.log("[v0] Adding new user to database:", { email, name, role });

    // Add user role with name and hashed password
    const { error: roleError } = await supabase.from("user_roles").insert({
      user_email: email,
      name: name,
      password: hashedPassword,
      role: role,
    });

    if (roleError) {
      console.error("[v0] Error adding user role:", roleError);
      return { success: false, error: roleError.message };
    }

    console.log("[v0] User successfully added to user_roles table:", email);

    // If user is a lead, add project assignments
    if (role === "lead" && projectIds.length > 0) {
      const projectLeads = projectIds.map((projectId) => ({
        user_email: email,
        project_id: projectId,
      }));

      console.log("[v0] Adding project assignments for lead:", projectIds);

      const { error: leadsError } = await supabase.from("project_leads").insert(projectLeads);

      if (leadsError) {
        console.error("[v0] Error adding project leads:", leadsError);
        return { success: false, error: leadsError.message };
      }

      console.log("[v0] Project assignments added successfully");
    }

    console.log("[v0] User creation completed successfully:", email);
    return { success: true };
  } catch (error) {
    console.error("[v0] Error in addUser:", error);
    return { success: false, error: "Failed to add user" };
  }
}

// Update user role and project assignments
export async function updateUser(email: string, name: string, password: string | null, role: "administrator" | "lead" | "user", projectIds: number[] = []) {
  try {
    const supabase = await createClient();

    const updateData: any = {
      name: name,
      role: role,
      updated_at: new Date().toISOString(),
    };

    if (password && password.trim() !== "") {
      updateData.password = await hashPassword(password);
    }

    // Update user role
    const { error: roleError } = await supabase.from("user_roles").update(updateData).eq("user_email", email);

    if (roleError) {
      console.error("[v0] Error updating user role:", roleError);
      return { success: false, error: roleError.message };
    }

    // Remove all existing project leads for this user
    const { error: deleteError } = await supabase.from("project_leads").delete().eq("user_email", email);

    if (deleteError) {
      console.error("[v0] Error removing old project leads:", deleteError);
    }

    // If user is a lead, add new project assignments
    if (role === "lead" && projectIds.length > 0) {
      const projectLeads = projectIds.map((projectId) => ({
        user_email: email,
        project_id: projectId,
      }));

      const { error: leadsError } = await supabase.from("project_leads").insert(projectLeads);

      if (leadsError) {
        console.error("[v0] Error adding project leads:", leadsError);
        return { success: false, error: leadsError.message };
      }
    }

    return { success: true };
  } catch (error) {
    console.error("[v0] Error in updateUser:", error);
    return { success: false, error: "Failed to update user" };
  }
}

// Delete a user
export async function deleteUser(email: string) {
  try {
    const supabase = await createClient();

    // Delete project leads first (foreign key constraint)
    await supabase.from("project_leads").delete().eq("user_email", email);

    // Delete user role
    const { error } = await supabase.from("user_roles").delete().eq("user_email", email);

    if (error) {
      console.error("[v0] Error deleting user:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("[v0] Error in deleteUser:", error);
    return { success: false, error: "Failed to delete user" };
  }
}

// Authenticate user with email and password
export async function authenticateUser(email: string, password: string) {
  try {
    const supabase = await createClient();

    console.log("[v0] Authenticating user:", email);
    console.log("[v0] Provided password length:", password.length);

    const { data: allUsers, error: countError } = await supabase.from("user_roles").select("user_email", { count: "exact", head: true });

    if (!countError) {
      const { count } = await supabase.from("user_roles").select("*", { count: "exact", head: true });

      // If no users exist, create the default admin user
      if (count === 0) {
        console.log("[v0] No users found in database. Creating default admin user...");

        const defaultEmail = "admin@company.com";
        const defaultPassword = "admin123";
        const defaultName = "Administrator";

        const hashedPassword = await hashPassword(defaultPassword);

        const { error: insertError } = await supabase.from("user_roles").insert({
          user_email: defaultEmail,
          name: defaultName,
          password: hashedPassword,
          role: "administrator",
        });

        if (insertError) {
          console.error("[v0] Error creating default admin user:", insertError);
        } else {
          console.log("[v0] Default admin user created successfully");
          console.log("[v0] Email: admin@company.com");
          console.log("[v0] Password: admin123");
        }
      }
    }

    const { data: user, error } = await supabase.from("user_roles").select("user_email, name, role, password").eq("user_email", email).maybeSingle();

    if (error || !user) {
      console.log("[v0] User not found in database:", email);
      return { success: false, error: "User not found" };
    }

    console.log("[v0] User found in database:", email);

    // Check if user has a password set
    if (!user.password) {
      console.log("[v0] User has no password set");
      return { success: false, error: "No password set for this user" };
    }

    console.log("[v0] Stored password hash (first 20 chars):", user.password.substring(0, 20));

    // Hash the provided password
    const hashedPassword = await hashPassword(password);

    console.log("[v0] Computed password hash (first 20 chars):", hashedPassword.substring(0, 20));
    console.log("[v0] Hashes match:", hashedPassword === user.password);

    // Compare hashed passwords
    if (hashedPassword !== user.password) {
      console.log("[v0] Password mismatch");
      return { success: false, error: "Invalid password" };
    }

    console.log("[v0] Password match - authentication successful");

    // Return user data (without password)
    return {
      success: true,
      user: {
        email: user.user_email,
        name: user.name,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("[v0] Error in authenticateUser:", error);
    return { success: false, error: "Authentication failed" };
  }
}

/**
 * Finds an existing user in the database by their verified email.
 * Used for the JIT CHECK/RETRIEVE step.
 */
export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  try {
    const supabase = await createClient();

    console.log("[DB] Attempting to find user by email:", email);

    // Query for the user, selecting only necessary fields
    const { data: user, error } = await supabase
      .from("user_roles")
      .select("user_email, name, role") // Selects the columns you need
      .eq("user_email", email)
      .maybeSingle(); // Efficiently fetches 0 or 1 row

    if (error) {
      console.error("[DB] Error finding user:", error);
      return null;
    }

    if (!user) {
      console.log("[DB] User not found:", email);
      return null;
    }

    console.log("[DB] User found. Role:", user.role);

    // Maps the Supabase result to the expected UserRecord format
    return {
      id: user.user_email, // Using email as the internal ID for simplicity
      email: user.user_email,
      name: user.name,
      role: user.role,
    };
  } catch (error) {
    console.error("[DB] Critical error in findUserByEmail:", error);
    return null;
  }
}

/**
 * Creates a new user record in the database.
 * Used for the JIT PROVISIONING step.
 */
export async function createUser(data: NewUserData): Promise<UserRecord | null> {
  try {
    const supabase = await createClient();

    console.log("[DB] Provisioning new user:", data.email);

    // Insert the new user data
    const { error } = await supabase.from("user_roles").insert({
      user_email: data.email,
      name: data.name,
      role: data.role,
      // Ensure you do NOT include password fields for SSO users
    });

    if (error) {
      console.error("[DB] Error creating user:", error);
      return null;
    }

    console.log("[DB] New user successfully created:", data.email);

    // Return the created record structure
    return {
      id: data.email, // Using email as the internal ID
      email: data.email,
      name: data.name,
      role: data.role,
    };
  } catch (error) {
    console.error("[DB] Critical error in createUser:", error);
    return null;
  }
}

// Get all users with basic info for password reset tool
export async function getAllUsersBasic() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.from("user_roles").select("user_email, name, role").order("user_email");

    if (error) {
      console.error("[v0] Error fetching users:", error);
      return { success: false, error: error.message, users: [] };
    }

    console.log("[v0] Found users in database:", data.length);
    return { success: true, users: data };
  } catch (error) {
    console.error("[v0] Error in getAllUsersBasic:", error);
    return { success: false, error: "Failed to fetch users", users: [] };
  }
}

// Reset a user's password
export async function resetUserPassword(email: string, newPassword: string) {
  try {
    const supabase = await createClient();

    console.log("[v0] Resetting password for user:", email);

    const hashedPassword = await hashPassword(newPassword);
    console.log("[v0] New password hash (first 20 chars):", hashedPassword.substring(0, 20));

    const { error } = await supabase
      .from("user_roles")
      .update({
        password: hashedPassword,
        updated_at: new Date().toISOString(),
      })
      .eq("user_email", email);

    if (error) {
      console.error("[v0] Error resetting password:", error);
      return { success: false, error: error.message };
    }

    console.log("[v0] Password reset successful for:", email);
    return { success: true };
  } catch (error) {
    console.error("[v0] Error in resetUserPassword:", error);
    return { success: false, error: "Failed to reset password" };
  }
}

async function hashPassword(password: string): Promise<string> {
  // Use Web Crypto API to hash the password
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
