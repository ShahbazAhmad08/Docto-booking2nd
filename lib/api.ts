const API_BASE = "http://localhost:3001";
// const API_BASE = "https://wtxpr5-3001.csb.app";

// Common server connection error
const SERVER_ERROR =
  "Cannot connect to server. Please run 'npm run json-server' in a separate terminal.";

// ---------- Types ----------
export interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  qualifications: string;
  experience: string;
  clinicAddress: string;
  availability?: TimeSlot[];
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface TimeSlot {
  id: string;
  doctorId: string;
  date: string;
  time: string;
  isBooked: boolean;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed" | "rescheduled";
  doctorName: string;
  patientName: string;
  specialty: string;
  prescriptionId?: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  patient: {
    name: string;
    age: number;
  };
  doctor: {
    name: string;
    specialty: string;
  };
  medications: {
    name: string;
    dosage: string;
    instructions: string;
    duration?: string;
  }[];
  notes: string;
  date: string;
}
export interface Review {
  id: string;
  appointmentId: string;   // Links to a specific appointment
  doctorId: string;        // Doctor who receives the review
  patientId: string;       // Patient who submitted the review
  rating: number;          // 1 to 5
  reviewText: string;      // Textual feedback
  date: string;            // Submission date (YYYY-MM-DD)
}

// Optional: for creating a new review (before server generates id/date)
export interface ReviewInput {
  appointmentId: string;
  doctorId: string;
  patientId: string;
  rating: number;
  reviewText: string;
}

// ---------- Helper: Check Server ----------
const checkServerStatus = async () => {
  try {
    const res = await fetch(`${API_BASE}/doctors`, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
};

// ---------- Auth API ----------
export const authAPI = {
  async login(email: string, password: string, role: "doctor" | "patient") {
    try {
      const endpoint = role === "doctor" ? "doctors" : "patients";
      const res = await fetch(`${API_BASE}/${endpoint}`);
      if (!res.ok) throw new Error("Server not responding.");

      const users = await res.json();
      const user = users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (!user) throw new Error("Invalid email or password");
      return { ...user, role };
    } catch (error: any) {
      if (error instanceof TypeError && error.message.includes("fetch"))
        throw new Error(SERVER_ERROR);
      throw error;
    }
  },

  async signup(userData: any, role: "doctor" | "patient") {
    try {
      const endpoint = role === "doctor" ? "doctors" : "patients";
      const res = await fetch(`${API_BASE}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...userData, id: Date.now().toString() }),
      });

      if (!res.ok) throw new Error("Server not responding.");
      const user = await res.json();
      return { ...user, role };
    } catch (error: any) {
      if (error instanceof TypeError && error.message.includes("fetch"))
        throw new Error(SERVER_ERROR);
      throw error;
    }
  },
};
export const patientsAPI = {
  async getByIds(patientIds: string[]): Promise<Record<string, Patient>> {
    const patientsData: Record<string, Patient> = {};
    await Promise.all(
      patientIds.map(async (pid) => {
        try {
          const res = await fetch(`${API_BASE}/patients/${pid}`);
          if (res.ok) {
            const patient = await res.json();
            patientsData[pid] = patient;
          }
        } catch {
          // Ignore if not found
        }
      })
    );
    return patientsData;
  }
};
// ---------- Doctors API ----------
export const doctorsAPI = {
  async getAll(): Promise<Doctor[]> {
    try {
      const res = await fetch(`${API_BASE}/doctors`);
      if (!res.ok) throw new Error("Failed to fetch doctors");
      return res.json();
    } catch (error: any) {
      if (error instanceof TypeError && error.message.includes("fetch"))
        throw new Error(SERVER_ERROR);
      throw error;
    }
  },

  async getById(id: string): Promise<Doctor> {
    try {
      const res = await fetch(`${API_BASE}/doctors/${id}`);
      if (!res.ok) throw new Error("Failed to fetch doctor");
      return res.json();
    } catch (error: any) {
      if (error instanceof TypeError && error.message.includes("fetch"))
        throw new Error(SERVER_ERROR);
      throw error;
    }
  },

  async update(id: string, data: Partial<Doctor>): Promise<Doctor> {
    try {
      const res = await fetch(`${API_BASE}/doctors/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update doctor");
      return res.json();
    } catch (error: any) {
      if (error instanceof TypeError && error.message.includes("fetch"))
        throw new Error(SERVER_ERROR);
      throw error;
    }
  },
};
// ---------- Appointments API ----------
export const appointmentsAPI = {
  // Create appointment
  async create(appointment: Omit<Appointment, "id">): Promise<Appointment> {
    return this._post("appointments", {
      ...appointment,
      id: Date.now().toString(),
    });
  },
  getByDoctorId: async (doctorId: string) => {
  return appointmentsAPI._get(`appointments?doctorId=${doctorId}`, "appointments for doctor");
},

  // Get appointments by user (doctor or patient)
  async getByUser(userId: string, role: "doctor" | "patient"): Promise<Appointment[]> {
    const queryParam = role === "doctor" ? `doctorId=${userId}` : `patientId=${userId}`;
    return this._get(`appointments?${queryParam}`, "appointments");
  },

  // Update appointment status
  async updateStatus(id: string, status: Appointment["status"]) {
    return this._patch(`appointments/${id}`, { status }, "appointment");
  },

  // Cancel appointment
  async cancelAppointment(appointmentId: string) {
    return this._patch(`appointments/${appointmentId}`, { status: "cancelled" }, "appointment");
  },

  // Reschedule appointment
  async updateSchedule(appointmentId: string, newDate: string, newTime: string) {
    return this._patch(
      `appointments/${appointmentId}`,
      { date: newDate, time: newTime, status: "rescheduled" },
      "appointment"
    );
  },

  // ---- Private helpers ----
  async _get(url: string, entity: string) {
    try {
      const res = await fetch(`${API_BASE}/${url}`);
      if (!res.ok) throw new Error(`Failed to fetch ${entity}`);
      return res.json();
    } catch (error: any) {
      if (error instanceof TypeError && error.message.includes("fetch"))
        throw new Error(SERVER_ERROR);
      throw error;
    }
  },

  async _post(url: string, data: any) {
    try {
      const res = await fetch(`${API_BASE}/${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Failed to create ${url}`);
      return res.json();
    } catch (error: any) {
      if (error instanceof TypeError && error.message.includes("fetch"))
        throw new Error(SERVER_ERROR);
      throw error;
    }
  },

  async _patch(url: string, data: any, entity: string) {
    try {
      const res = await fetch(`${API_BASE}/${url}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Failed to update ${entity}`);
      return res.json();
    } catch (error: any) {
      if (error instanceof TypeError && error.message.includes("fetch"))
        throw new Error(SERVER_ERROR);
      throw error;
    }
  },
};
// ---------- Prescriptions API ----------
export const prescriptionsAPI = {
  async getAll(): Promise<Prescription[]> {
    const res = await fetch(`${API_BASE}/prescriptions`);
    if (!res.ok) throw new Error("Failed to fetch prescriptions");
    return res.json();
  },

  async getByDoctorId(doctorId: string): Promise<Prescription[]> {
    const res = await fetch(`${API_BASE}/prescriptions?doctorId=${doctorId}`);
    if (!res.ok) throw new Error("Failed to fetch prescriptions for doctor");
    return res.json();
  },

  async getByAppointment(appointmentId: string): Promise<Prescription[]> {
    const res = await fetch(`${API_BASE}/prescriptions?appointmentId=${appointmentId}`);
    if (!res.ok) throw new Error("Failed to fetch prescriptions for appointment");
    return res.json();
  },

  async getById(id: string): Promise<Prescription> {
    const res = await fetch(`${API_BASE}/prescriptions/${id}`);
    if (!res.ok) throw new Error("Failed to fetch prescription by ID");
    return res.json();
  },

  async create(data: Omit<Prescription, "id" | "date">): Promise<Prescription> {
    const payload = {
      ...data,
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
    };
    const res = await fetch(`${API_BASE}/prescriptions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create prescription");
    return res.json();
  },

  async update(id: string, data: Partial<Prescription>): Promise<Prescription> {
    const res = await fetch(`${API_BASE}/prescriptions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update prescription");
    return res.json();
  },

  async delete(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/prescriptions/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete prescription");
    return true;
  },
};
export const reviewsAPI = {
  async getByDoctorId(doctorId: string) {
    const res = await fetch(`${API_BASE}/reviews?doctorId=${doctorId}`);
    if (!res.ok) throw new Error("Failed to fetch reviews for doctor");
    return res.json();
  },

  async getByPatientId(patientId: string) {
    const res = await fetch(`${API_BASE}/reviews?patientId=${patientId}`);
    if (!res.ok) throw new Error("Failed to fetch reviews for patient");
    return res.json();
  },

  async create(review: Omit<{
    appointmentId: string;
    doctorId: string;
    patientId: string;
    rating: number;
    reviewText: string;
    date: string;
  }, "id" | "date">) {
    const payload = { ...review, id: Date.now().toString(), date: new Date().toISOString().split("T")[0] };
    const res = await fetch(`${API_BASE}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Failed to submit review");
    return res.json();
  },

  async update(id: string, data: Partial<{ rating: number; reviewText: string }>) {
    const res = await fetch(`${API_BASE}/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to update review");
    return res.json();
  },

  async delete(id: string) {
    const res = await fetch(`${API_BASE}/reviews/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete review");
    return true;
  }
};

