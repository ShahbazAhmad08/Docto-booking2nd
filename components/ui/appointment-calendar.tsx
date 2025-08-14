// components/ui/appointment-calendar.tsx
"use client";

import React, { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useToast } from "@/hooks/use-toast";
import { appointmentsAPI, type Appointment } from "@/lib/api";

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onAppointmentUpdate: (updatedAppointment: Appointment) => void;
}

export function AppointmentCalendar({
  appointments,
  onAppointmentUpdate,
}: AppointmentCalendarProps) {
  const calendarRef = useRef(null);
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const events = appointments.map((a) => ({
    id: a.id,
    start: `${a.date}T${a.time}`,
    extendedProps: { ...a },
  }));

  const getEventClasses = (status: string) => {
    const base = "rounded-md px-1 py-0.5 text-xs";
    return (
      {
        confirmed: `${base} bg-green-500 text-white`,
        pending: `${base} bg-yellow-400 text-black`,
        cancelled: `${base} bg-red-500 text-white`,
        completed: `${base} bg-blue-500 text-white`,
        rescheduled: `${base} bg-purple-500 text-white`,
      }[status] || `${base} bg-gray-300 text-black`
    );
  };

  const handleEventClick = (info: any) => {
    setSelectedAppointment(info.event.extendedProps as Appointment);
    setIsModalOpen(true);
  };

  const handleEventDrop = async (info: any) => {
    const newDate = info.event.startStr.split("T")[0];
    const newTime = info.event.startStr.split("T")[1]?.substring(0, 5);
    try {
      const updated = await appointmentsAPI.updateSchedule(
        info.event.id,
        newDate,
        newTime
      );
      onAppointmentUpdate({ ...updated });
      toast({
        title: "Appointment Rescheduled",
        description: `${updated.patientName} moved to ${newDate} at ${newTime}.`,
      });
    } catch (e) {
      info.revert();
      toast({
        title: "Error",
        description: "Failed to reschedule.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 max-w-6xl mx-auto">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        height="650px"
        slotMinTime="08:00:00"
        slotMaxTime="23:00:00"
        events={events}
        editable={true}
        eventDrop={handleEventDrop}
        eventClick={handleEventClick}
        eventContent={(arg) => {
          const { patientName, specialty, status, time } =
            arg.event.extendedProps;
          const statusClass = getEventClasses(status);

          return (
            <div
              className={`relative group cursor-pointer truncate ${statusClass}`}
            >
              {/* Event text */}
              <div className="font-semibold">
                {time} - {patientName}
              </div>

              {/* ✅ Tailwind Tooltip */}
              <div
                className="absolute top-full left-1/2 mt-2 -translate-x-1/2 w-52 
                   bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg 
                   opacity-0 group-hover:opacity-100 group-hover:translate-y-1 
                   transition-all duration-200 z-[99999] pointer-events-none"
              >
                <div className="absolute left-1/2 -top-1 w-2 h-2 bg-gray-900 rotate-45 -translate-x-1/2"></div>
                <p className="font-bold">{patientName}</p>
                <p className="text-gray-300">{specialty}</p>
                <p>{time}</p>
                <p className="capitalize text-purple-400">{status}</p>
              </div>
            </div>
          );
        }}
      />

      {/* ✅ Details Modal */}
      {isModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50">
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-bold mb-3">Appointment Details</h2>
            <p>
              <b>Patient:</b> {selectedAppointment.patientName}
            </p>
            <p>
              <b>Specialty:</b> {selectedAppointment.specialty}
            </p>
            <p>
              <b>Date:</b> {selectedAppointment.date}
            </p>
            <p>
              <b>Time:</b> {selectedAppointment.time}
            </p>
            <p>
              <b>Status:</b> {selectedAppointment.status}
            </p>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsRescheduleModalOpen(true);
                  setIsModalOpen(false);
                }}
                className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
              >
                Reschedule
              </button>
              {selectedAppointment.status !== "cancelled" && (
                <button
                  onClick={async () => {
                    const updated = await appointmentsAPI.updateStatus(
                      selectedAppointment.id,
                      "cancelled"
                    );
                    onAppointmentUpdate({ ...updated });
                    toast({
                      title: "Cancelled",
                      description: `${updated.patientName}'s appointment was cancelled.`,
                    });
                    setIsModalOpen(false);
                  }}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Reschedule Modal */}
      {isRescheduleModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50">
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-lg font-bold mb-3">Reschedule Appointment</h2>
            <input
              type="date"
              className="border p-2 w-full mb-2"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
            <input
              type="time"
              className="border p-2 w-full mb-3"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsRescheduleModalOpen(false)}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const updated = await appointmentsAPI.updateSchedule(
                    selectedAppointment.id,
                    newDate,
                    newTime
                  );
                  onAppointmentUpdate({ ...updated });
                  toast({
                    title: "Rescheduled",
                    description: `Moved to ${updated.date} at ${updated.time}`,
                  });
                  setIsRescheduleModalOpen(false);
                }}
                className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
