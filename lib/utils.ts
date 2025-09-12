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
          "id": 1,
          "name": "Maria Theresa Ramos",
          "role": "Co-Founder & CEO",
          "department": "Executive",
          "email": "minette@mymunus.com",
          "phone": "+63 (917) 887-0624",
          "location": "BGC, Taguig, Philippines",
          "foundedDate": "2018-01-01",
          "equity": "35%",
          "category": "founder"
      },
      {
          "id": 2,
          "name": "Reda Marie Ricamara-Talusig",
          "role": "Co-Founder & CTO",
          "department": "Technology",
          "email": "reda@mymunus.com",
          "phone": "+1 (780) 884-6198",
          "location": "Edmonton, AB. Canada",
          "foundedDate": "2018-01-01",
          "equity": "30%",
          "category": "founder"
      },
      {
          "id": 3,
          "name": "Gil Somblingo",
          "role": "Co-Founder & CFO",
          "department": "Finance",
          "email": "gil@mymunus.com",
          "phone": "+63 (917) 856-3658",
          "location": "Quezon City, Philippines",
          "foundedDate": "2018-01-01",
          "equity": "25%",
          "category": "founder"
      }
      ],
      advisors: [
        {
          "id": 1,
          "name": "Ernie Guevara",
          "role": "Head, Compliance",
          "department": "Advisory Board",
          "email": "ernie.guevara@mymunus.com",
          "phone": "+63 (917) 886-1661",
          "location": "Makati City, Philippines",
          "joinDate": "2019-06-15",
          "category": "advisor"
      },
      {
          "id": 2,
          "name": "Mary Joy Mamalateo-Jusay",
          "role": "Head, Legal",
          "department": "Advisory Board",
          "email": "joy.jusay@mymunus.com",
          "phone": "+63 (917) 577-1414",
          "location": "Quezon City, Philippines",
          "joinDate": "2020-02-10",
          "category": "advisor"
      },
      {
          "id": 3,
          "name": "Michelle Mendez-Palmares",
          "role": "Head, Community",
          "department": "Advisory Board",
          "email": "michelle.medezpalmares@mymunus.com",
          "phone": "+63 (917) 626-2231",
          "location": "Cebu City, Philippines",
          "joinDate": "2019-11-20",
          "category": "advisor"
      },
      {
          "id": 1757475791874,
          "name": "Lani Billena",
          "role": "Managing Director",
          "department": "",
          "email": "lani.billena@mymunus.com",
          "phone": "+65 (818) 04628",
          "location": "Singapore City, Singapore",
      },
      {
          "id": 1757475881098,
          "name": "Malike Bouaoud",
          "role": "Head, Cybersecurity",
          "department": "",
          "email": "malike.bouaoud@mymunus.com",
          "phone": "",
          "location": "Toronto, ON, Canada",
      },
      {
          "id": 1757475949355,
          "name": "Bryan Kwan",
          "role": "Head, Solutions",
          "department": "",
          "email": "bryan.kwan@mymunus.com",
          "phone": "+1 (780) 953-6464",
          "location": "Edmonton, AB, Canada",
      },
      {
          "id": 1757476026377,
          "name": "Lydia Zheng",
          "role": "Data Scientist",
          "department": "",
          "email": "lydia.zheng@mymunus.com",
          "phone": "+1 (587) 433-5767",
          "location": "Edmonton, AB, Canada",
      },
      {
          "id": 1757476101975,
          "name": "Nessa Dumo",
          "role": "Head, User Experience",
          "department": "",
          "email": "nessa.dumo@mymunus.com",
          "phone": "+1 (780) 238-0916",
          "location": "Vancouver, BC, Canada",
      },
      {
          "id": 1757476170807,
          "name": "Goldie Ricamara",
          "role": "Head, IT Operations",
          "department": "",
          "email": "goldie.ricamara@mymunus.com",
          "phone": "+1 (780) 298-1707",
          "location": "Vancouver, BC, Canada",
      },
      {
          "id": 1757476265551,
          "name": "Nick Gorse",
          "role": "Head, Sales & Strategy",
          "department": "",
          "email": "nick.gorse@mymunus.com",
          "phone": "+1 (778) 772-4806",
          "location": "Vancouver, BC, Canada",
      },
      {
          "id": 1757476360766,
          "name": "Studio After Six",
          "role": "Head, Creative Design",
          "department": "",
          "email": "sa6@mymunus.com",
          "phone": "+63 (908) 879-0518",
          "location": "Quezon City, Philippines",
      },
      {
          "id": 1757476482728,
          "name": "BPLA/LIDSA",
          "role": "Legal Products Advisor",
          "department": "",
          "email": "energyte@bpla.law",
          "phone": "",
          "location": "Makati City, Philippines",
          "category": "advisor"
      }
      ],
      consultants: [
        {
          "id": 1,
          "name": "John Carlo Velasquez",
          "role": "Developer",
          "department": "Consultant",
          "email": "johncarlo.velasquez@mymunus.com",
          "phone": "+63 (977) 440-5218",
          "location": "Calamba, Laguna, Philippines",
          "contractStart": "2023-01-15",
          "contractEnd": "2024-01-15",
          "category": "consultant"
      },
      {
          "id": 2,
          "name": "Roland Rei Espeleta",
          "role": "Developer",
          "department": "External Consultant",
          "email": "roland.espeleta@mymunus.com",
          "phone": "+63 (905) 799-8667",
          "location": "Antipolo City, Philippines",
          "avatar": "/ceo-headshot.png",
          "contractStart": "2023-06-01",
          "contractEnd": "2024-06-01",
          "category": "consultant"
      },
      {
          "id": 3,
          "name": "Jelony Sobremisana",
          "role": "Developer",
          "department": "External Consultant",
          "email": "jelony.sobremisana@mymunus.com",
          "phone": "+63 (926) 081-9150",
          "location": "Taguig City, Philippines",
          "avatar": "/professional-headshot.png",
          "contractStart": "2023-03-10",
          "contractEnd": "2024-03-10",
          "category": "consultant"
      },
      {
          "id": 1757476920188,
          "name": "Juan David Aristizabal",
          "role": "AWS Infrastructure Consultant",
          "department": "External Consultant",
          "email": "jaristizabalc@gmail.com",
          "phone": "",
          "location": "Edmonton, AB, Canada",
      }
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
        "id": 1,
        "name": "Maria Theresa Ramos",
        "role": "Co-Founder & CEO",
        "department": "Executive",
        "email": "minette@mymunus.com",
        "phone": "+63 (917) 887-0624",
        "location": "BGC, Taguig, Philippines",
        "foundedDate": "2018-01-01",
        "equity": "35%",
        "category": "founder",
        "avatar": "/minette.png"
    },
    {
        "id": 2,
        "name": "Reda Marie Ricamara-Talusig",
        "role": "Co-Founder & CTO",
        "department": "Technology",
        "email": "reda@mymunus.com",
        "phone": "+1 (780) 884-6198",
        "location": "Edmonton, AB. Canada",
        "foundedDate": "2018-01-01",
        "equity": "30%",
        "category": "founder",
        "avatar": "/reda.png"
    },
    {
        "id": 3,
        "name": "Gil Somblingo",
        "role": "Co-Founder & CFO",
        "department": "Finance",
        "email": "gil@mymunus.com",
        "phone": "+63 (917) 856-3658",
        "location": "Quezon City, Philippines",
        "foundedDate": "2018-01-01",
        "equity": "25%",
        "category": "founder",
        "avatar": "/gil.png"
    }
    ],
    advisors: [
      {
        "id": 1,
        "name": "Ernie Guevara",
        "role": "Head, Compliance",
        "department": "Advisory Board",
        "email": "ernie.guevara@mymunus.com",
        "phone": "+63 (917) 886-1661",
        "location": "Makati City, Philippines",
        "joinDate": "2019-06-15",
        "category": "advisor",
        "avatar": "/ernie.png"
    },
    {
        "id": 2,
        "name": "Mary Joy Mamalateo-Jusay",
        "role": "Head, Legal",
        "department": "Advisory Board",
        "email": "joy.jusay@mymunus.com",
        "phone": "+63 (917) 577-1414",
        "location": "Quezon City, Philippines",
        "joinDate": "2020-02-10",
        "category": "advisor",
        "avatar": "/joy.png"
    },
    {
        "id": 3,
        "name": "Michelle Mendez-Palmares",
        "role": "Head, Community",
        "department": "Advisory Board",
        "email": "michelle.medezpalmares@mymunus.com",
        "phone": "+63 (917) 626-2231",
        "location": "Cebu City, Philippines",
        "joinDate": "2019-11-20",
        "category": "advisor",
        "avatar": "/mic.png"
    },
    {
        "id": 1757475791874,
        "name": "Lani Billena",
        "role": "Managing Director",
        "department": "",
        "email": "lani.billena@mymunus.com",
        "phone": "+65 (818) 04628",
        "location": "Singapore City, Singapore",
        "avatar": "/lani.png"
    },
    {
        "id": 1757475881098,
        "name": "Malike Bouaoud",
        "role": "Head, Cybersecurity",
        "department": "",
        "email": "malike.bouaoud@mymunus.com",
        "phone": "",
        "location": "Toronto, ON, Canada",
        "avatar": "/malike.png"
    },
    {
        "id": 1757475949355,
        "name": "Bryan Kwan",
        "role": "Head, Solutions",
        "department": "",
        "email": "bryan.kwan@mymunus.com",
        "phone": "+1 (780) 953-6464",
        "location": "Edmonton, AB, Canada",
        "avatar": "/bryan.png"
    },
    {
        "id": 1757476026377,
        "name": "Lydia Zheng",
        "role": "Data Scientist",
        "department": "",
        "email": "lydia.zheng@mymunus.com",
        "phone": "+1 (587) 433-5767",
        "location": "Edmonton, AB, Canada",
        "avatar": "/lydia.png"
    },
    {
        "id": 1757476101975,
        "name": "Nessa Dumo",
        "role": "Head, User Experience",
        "department": "",
        "email": "nessa.dumo@mymunus.com",
        "phone": "+1 (780) 238-0916",
        "location": "Vancouver, BC, Canada",
        "avatar": "/nessa.png"
    },
    {
        "id": 1757476170807,
        "name": "Goldie Ricamara",
        "role": "Head, IT Operations",
        "department": "",
        "email": "goldie.ricamara@mymunus.com",
        "phone": "+1 (780) 298-1707",
        "location": "Vancouver, BC, Canada",
        "avatar": "/goldie.png"
    },
    {
        "id": 1757476265551,
        "name": "Nick Gorse",
        "role": "Head, Sales & Strategy",
        "department": "",
        "email": "nick.gorse@mymunus.com",
        "phone": "+1 (778) 772-4806",
        "location": "Vancouver, BC, Canada",
        "avatar": "/nick.png"
    },
    {
        "id": 1757476360766,
        "name": "Studio After Six",
        "role": "Head, Creative Design",
        "department": "",
        "email": "sa6@mymunus.com",
        "phone": "+63 (908) 879-0518",
        "location": "Quezon City, Philippines",
        "avatar": "/sas.png"
    },
    {
        "id": 1757476482728,
        "name": "BPLA/LIDSA",
        "role": "Legal Products Advisor",
        "department": "",
        "email": "energyte@bpla.law",
        "phone": "",
        "location": "Makati City, Philippines",
        "category": "advisor",
        "avatar": "/blpa.png"
    }
    ],
    consultants: [
      {
        "id": 1,
        "name": "John Carlo Velasquez",
        "role": "Developer",
        "department": "Consultant",
        "email": "johncarlo.velasquez@mymunus.com",
        "phone": "+63 (977) 440-5218",
        "location": "Calamba, Laguna, Philippines",
        "contractStart": "2023-01-15",
        "contractEnd": "2024-01-15",
        "category": "consultant",
        "avatar": "/jc.png"
      },
      {
          "id": 2,
          "name": "Roland Rei Espeleta",
          "role": "Developer",
          "department": "External Consultant",
          "email": "roland.espeleta@mymunus.com",
          "phone": "+63 (905) 799-8667",
          "location": "Antipolo City, Philippines",
          "contractStart": "2023-06-01",
          "contractEnd": "2024-06-01",
          "category": "consultant",
          "avatar": "/roland.png"
      },
      {
          "id": 3,
          "name": "Jelony Sobremisana",
          "role": "Developer",
          "department": "External Consultant",
          "email": "jelony.sobremisana@mymunus.com",
          "phone": "+63 (926) 081-9150",
          "location": "Taguig City, Philippines",
          "contractStart": "2023-03-10",
          "contractEnd": "2024-03-10",
          "category": "consultant",
        "avatar": "/jelo.png"
      },
      {
          "id": 1757476920188,
          "name": "Juan David Aristizabal",
          "role": "AWS Infrastructure Consultant",
          "department": "External Consultant",
          "email": "jaristizabalc@gmail.com",
          "phone": "",
          "location": "Edmonton, AB, Canada",
          "contractStart": "2023-01-15",
          "contractEnd": "2024-01-15",
          "category": "consultant",
        "avatar": "/juan.png"
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
