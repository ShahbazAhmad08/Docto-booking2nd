const API_BASE = "https://doctor-appointment-api-1.onrender.com"
// const API_BASE = "https://m4pc9y-3001.csb.app";//used for sandbox

export interface Doctor {
  id: string
  name: string
  email: string
  phone: string
  specialty: string
  qualifications: string
  experience: string
  clinicAddress: string
  availability?: TimeSlot[]
}

export interface Patient {
  id: string
  name: string
  email: string
  phone: string
}

export interface TimeSlot {
  id: string
  doctorId: string
  date: string
  time: string
  isBooked: boolean
}

export interface Appointment {
  id: string
  doctorId: string
  patientId: string
  date: string
  time: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  doctorName: string
  patientName: string
  specialty: string
}

// Check if JSON Server is running
const checkServerStatus = async () => {
  try {
    const response = await fetch(`${API_BASE}/doctors`, { method: "HEAD" })
    return response.ok
  } catch (error) {
    return false
  }
}

// Auth API
export const authAPI = {
  async login(email: string, password: string, role: "doctor" | "patient") {
    try {
      const endpoint = role === "doctor" ? "doctors" : "patients"
      const response = await fetch(`${API_BASE}/${endpoint}`)

      if (!response.ok) {
        throw new Error("Server not responding. Please make sure JSON Server is running on port 3001.")
      }

      const users = await response.json()
      const user = users.find((u: any) => u.email === email && u.password === password)

      if (!user) {
        throw new Error("Invalid email or password")
      }

      return { ...user, role }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Cannot connect to server. Please run 'npm run json-server' in a separate terminal.")
      }
      throw error
    }
  },

  async signup(userData: any, role: "doctor" | "patient") {
    try {
      const endpoint = role === "doctor" ? "doctors" : "patients"
      const response = await fetch(`${API_BASE}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...userData, id: Date.now().toString() }),
      })

      if (!response.ok) {
        throw new Error("Server not responding. Please make sure JSON Server is running on port 3001.")
      }

      const user = await response.json()
      return { ...user, role }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Cannot connect to server. Please run 'npm run json-server' in a separate terminal.")
      }
      throw error
    }
  },
}



// Doctors API
export const doctorsAPI = {
  async getAll(): Promise<Doctor[]> {
    try {
      const response = await fetch(`${API_BASE}/doctors`)
      if (!response.ok) {
        throw new Error("Failed to fetch doctors")
      }
      return response.json()
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Cannot connect to server. Please run 'npm run json-server' in a separate terminal.")
      }
      throw error
    }
  },

  async getById(id: string): Promise<Doctor> {
    try {
      const response = await fetch(`${API_BASE}/doctors/${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch doctor")
      }
      return response.json()
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Cannot connect to server. Please run 'npm run json-server' in a separate terminal.")
      }
      throw error
    }
  },

  async update(id: string, data: Partial<Doctor>): Promise<Doctor> {
    try {
      const response = await fetch(`${API_BASE}/doctors/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error("Failed to update doctor")
      }
      return response.json()
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Cannot connect to server. Please run 'npm run json-server' in a separate terminal.")
      }
      throw error
    }
  },
}

// Appointments API
export const appointmentsAPI = {
  async create(appointment: Omit<Appointment, "id">): Promise<Appointment> {
    try {
      const response = await fetch(`${API_BASE}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...appointment, id: Date.now().toString() }),
      })
      if (!response.ok) {
        throw new Error("Failed to create appointment")
      }
      return response.json()
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Cannot connect to server. Please run 'npm run json-server' in a separate terminal.")
      }
      throw error
    }
  },

  async getByDoctorId(doctorId: string): Promise<Appointment[]> {
    try {
      const response = await fetch(`${API_BASE}/appointments?doctorId=${doctorId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch appointments")
      }
      return response.json()
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Cannot connect to server. Please run 'npm run json-server' in a separate terminal.")
      }
      throw error
    }
  },

  async getByPatientId(patientId: string): Promise<Appointment[]> {
    try {
      const response = await fetch(`${API_BASE}/appointments?patientId=${patientId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch appointments")
      }
      return response.json()
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Cannot connect to server. Please run 'npm run json-server' in a separate terminal.")
      }
      throw error
    }
  },

  async updateStatus(id: string, status: Appointment["status"]): Promise<Appointment> {
    try {
      const response = await fetch(`${API_BASE}/appointments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })
      if (!response.ok) {
        throw new Error("Failed to update appointment")
      }
      return response.json()
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Cannot connect to server. Please run 'npm run json-server' in a separate terminal.")
      }
      throw error
    }
  },
  cancelAppointment: async (appointmentId: string): Promise<void> => {
    // Change '/api/appointments/' to '/appointments/'
    const response = await fetch(`/appointments/${appointmentId}`, { // <--- CHANGE THIS LINE
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.message || `Failed to cancel: ${response.statusText}`);
      } catch {
        throw new Error(`Failed to cancel: ${response.statusText} - ${errorText || 'No specific error message from server'}`);
      }
    }
  },
}
