import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function loadTeamDataFromStorage() {
  if (typeof window === "undefined") {
    // Return default data for SSR
    return {
      founders: [
        {
          id: 1,
          name: "David Chen",
          role: "Co-Founder & Chairman",
          department: "Executive",
          email: "david.chen@company.com",
          phone: "+1 (555) 111-2222",
          location: "San Francisco, CA",
          avatar: "/professional-headshot.png",
          foundedDate: "2018-01-01",
          equity: "35%",
        },
        {
          id: 2,
          name: "Maria Rodriguez",
          role: "Co-Founder & CTO",
          department: "Technology",
          email: "maria.rodriguez@company.com",
          phone: "+1 (555) 333-4444",
          location: "Austin, TX",
          avatar: "/team-member-1.png",
          foundedDate: "2018-01-01",
          equity: "30%",
        },
        {
          id: 3,
          name: "James Wilson",
          role: "Co-Founder & COO",
          department: "Operations",
          email: "james.wilson@company.com",
          phone: "+1 (555) 555-6666",
          location: "New York, NY",
          avatar: "/team-member-2.png",
          foundedDate: "2018-01-01",
          equity: "25%",
        },
      ],
      advisors: [
        {
          id: 1,
          name: "Dr. Patricia Kim",
          role: "Strategic Advisor - Go-to-Market Strategy",
          department: "Advisory Board",
          email: "patricia.kim@advisor.com",
          phone: "+1 (555) 777-8888",
          location: "Boston, MA",
          avatar: "/team-member-3.png",
          joinDate: "2019-06-15",
        },
        {
          id: 2,
          name: "Robert Thompson",
          role: "Technology Advisor - AI & Machine Learning",
          department: "Advisory Board",
          email: "robert.thompson@advisor.com",
          phone: "+1 (555) 999-0000",
          location: "Seattle, WA",
          avatar: "/team-john.png",
          joinDate: "2020-02-10",
        },
        {
          id: 3,
          name: "Lisa Chang",
          role: "Financial Advisor - Finance & Investment",
          department: "Advisory Board",
          email: "lisa.chang@advisor.com",
          phone: "+1 (555) 222-3333",
          location: "San Francisco, CA",
          avatar: "/placeholder-wb2g6.png",
          joinDate: "2019-11-20",
        },
      ],
      consultants: [
        {
          id: 1,
          name: "Michael Foster",
          role: "Management Consultant - Organizational Development",
          department: "External Consulting",
          email: "michael.foster@consulting.com",
          phone: "+1 (555) 444-5555",
          location: "Chicago, IL",
          avatar: "/team-mike.png",
          contractStart: "2023-01-15",
          contractEnd: "2024-01-15",
        },
        {
          id: 2,
          name: "Jennifer Park",
          role: "Marketing Consultant - Digital Marketing Strategy",
          department: "External Consulting",
          email: "jennifer.park@consulting.com",
          phone: "+1 (555) 666-7777",
          location: "Los Angeles, CA",
          avatar: "/ceo-headshot.png",
          contractStart: "2023-06-01",
          contractEnd: "2024-06-01",
        },
        {
          id: 3,
          name: "Alex Kumar",
          role: "Technology Consultant - Cloud Migration & DevOps",
          department: "External Consulting",
          email: "alex.kumar@consulting.com",
          phone: "+1 (555) 888-9999",
          location: "Austin, TX",
          avatar: "/professional-headshot.png",
          contractStart: "2023-03-10",
          contractEnd: "2024-03-10",
        },
      ],
    }
  }

  try {
    const storedData = localStorage.getItem("teamManagementData")
    if (storedData) {
      return JSON.parse(storedData)
    }
  } catch (error) {
    console.error("Error loading team data from storage:", error)
  }

  // Return default data if nothing in storage
  return {
    founders: [
      {
        id: 1,
        name: "David Chen",
        role: "Co-Founder & Chairman",
        department: "Executive",
        email: "david.chen@company.com",
        phone: "+1 (555) 111-2222",
        location: "San Francisco, CA",
        avatar: "/professional-headshot.png",
        foundedDate: "2018-01-01",
        equity: "35%",
      },
      {
        id: 2,
        name: "Maria Rodriguez",
        role: "Co-Founder & CTO",
        department: "Technology",
        email: "maria.rodriguez@company.com",
        phone: "+1 (555) 333-4444",
        location: "Austin, TX",
        avatar: "/team-member-1.png",
        foundedDate: "2018-01-01",
        equity: "30%",
      },
      {
        id: 3,
        name: "James Wilson",
        role: "Co-Founder & COO",
        department: "Operations",
        email: "james.wilson@company.com",
        phone: "+1 (555) 555-6666",
        location: "New York, NY",
        avatar: "/team-member-2.png",
        foundedDate: "2018-01-01",
        equity: "25%",
      },
    ],
    advisors: [
      {
        id: 1,
        name: "Dr. Patricia Kim",
        role: "Strategic Advisor - Go-to-Market Strategy",
        department: "Advisory Board",
        email: "patricia.kim@advisor.com",
        phone: "+1 (555) 777-8888",
        location: "Boston, MA",
        avatar: "/team-member-3.png",
        joinDate: "2019-06-15",
      },
      {
        id: 2,
        name: "Robert Thompson",
        role: "Technology Advisor - AI & Machine Learning",
        department: "Advisory Board",
        email: "robert.thompson@advisor.com",
        phone: "+1 (555) 999-0000",
        location: "Seattle, WA",
        avatar: "/team-john.png",
        joinDate: "2020-02-10",
      },
      {
        id: 3,
        name: "Lisa Chang",
        role: "Financial Advisor - Finance & Investment",
        department: "Advisory Board",
        email: "lisa.chang@advisor.com",
        phone: "+1 (555) 222-3333",
        location: "San Francisco, CA",
        avatar: "/placeholder-wb2g6.png",
        joinDate: "2019-11-20",
      },
    ],
    consultants: [
      {
        id: 1,
        name: "Michael Foster",
        role: "Management Consultant - Organizational Development",
        department: "External Consulting",
        email: "michael.foster@consulting.com",
        phone: "+1 (555) 444-5555",
        location: "Chicago, IL",
        avatar: "/team-mike.png",
        contractStart: "2023-01-15",
        contractEnd: "2024-01-15",
      },
      {
        id: 2,
        name: "Jennifer Park",
        role: "Marketing Consultant - Digital Marketing Strategy",
        department: "External Consulting",
        email: "jennifer.park@consulting.com",
        phone: "+1 (555) 666-7777",
        location: "Los Angeles, CA",
        avatar: "/ceo-headshot.png",
        contractStart: "2023-06-01",
        contractEnd: "2024-06-01",
      },
      {
        id: 3,
        name: "Alex Kumar",
        role: "Technology Consultant - Cloud Migration & DevOps",
        department: "External Consulting",
        email: "alex.kumar@consulting.com",
        phone: "+1 (555) 888-9999",
        location: "Austin, TX",
        avatar: "/professional-headshot.png",
        contractStart: "2023-03-10",
        contractEnd: "2024-03-10",
      },
    ],
  }
}

export function saveTeamDataToStorage(founders: any[], advisors: any[], consultants: any[]) {
  if (typeof window === "undefined") {
    return // Skip saving during SSR
  }

  try {
    const teamData = {
      founders,
      advisors,
      consultants,
    }
    localStorage.setItem("teamManagementData", JSON.stringify(teamData))
  } catch (error) {
    console.error("Error saving team data to storage:", error)
  }
}
