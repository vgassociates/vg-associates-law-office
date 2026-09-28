"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock, Phone, Mail, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

type Slot = {
  value: string;
  label: string;
};

type SlotCount = {
  appointment_time: string;
  booked_count: number;
  remaining_count: number;
};

const WEEKDAY_SLOTS: Slot[] = [
  { value: "09:00:00", label: "9:00 AM" },
  { value: "09:30:00", label: "9:30 AM" },
  { value: "18:00:00", label: "6:00 PM" },
  { value: "18:30:00", label: "6:30 PM" },
  { value: "19:00:00", label: "7:00 PM" },
  { value: "19:30:00", label: "7:30 PM" },
  { value: "20:00:00", label: "8:00 PM" },
  { value: "20:30:00", label: "8:30 PM" },
];

const SUNDAY_SLOTS: Slot[] = [
  { value: "09:00:00", label: "9:00 AM" },
  { value: "09:30:00", label: "9:30 AM" },
  { value: "10:00:00", label: "10:00 AM" },
  { value: "10:30:00", label: "10:30 AM" },
  { value: "11:00:00", label: "11:00 AM" },
  { value: "11:30:00", label: "11:30 AM" },
  { value: "12:00:00", label: "12:00 PM" },
  { value: "12:30:00", label: "12:30 PM" },
];

function getSlotsForDate(dateString: string): Slot[] {
  if (!dateString) return [];

  const date = new Date(`${dateString}T00:00:00`);
  const day = date.getDay();

  return day === 0 ? SUNDAY_SLOTS : WEEKDAY_SLOTS;
}

function formatDate(dateString: string) {
  if (!dateString) return "";

  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ClientAppointmentPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  const [slotCounts, setSlotCounts] = useState<Record<string, number>>({});

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [success, setSuccess] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const availableSlots = useMemo(
    () => getSlotsForDate(appointmentDate),
    [appointmentDate]
  );

  useEffect(() => {
    async function loadSlotCounts() {
      setSlotCounts({});
      setAppointmentTime("");
      setErrorMessage("");

      if (!appointmentDate) {
        return;
      }

      setLoadingSlots(true);

      const { data, error } = await supabase.rpc(
        "get_appointment_slot_counts",
        {
          p_appointment_date: appointmentDate,
        }
      );

      if (error) {
        console.error("Slot availability error:", error);

        setErrorMessage(
          "Unable to load appointment availability. Please refresh the page and try again."
        );

        setLoadingSlots(false);
        return;
      }

      const counts: Record<string, number> = {};

      (data as SlotCount[] | null)?.forEach((slot) => {
        const time = slot.appointment_time;

        if (time) {
          const normalizedTime =
            time.length === 5 ? `${time}:00` : time;

          counts[normalizedTime] = slot.remaining_count;
        }
      });

      setSlotCounts(counts);
      setLoadingSlots(false);
    }

    loadSlotCounts();
  }, [appointmentDate]);

  async function submitAppointment() {
    setSuccess("");
    setErrorMessage("");

    if (!fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!phone.trim()) {
      alert("Please enter your phone number.");
      return;
    }

    if (!appointmentDate) {
      alert("Please select an appointment date.");
      return;
    }

    if (!appointmentTime) {
      alert("Please select an appointment time.");
      return;
    }

    const remaining = slotCounts[appointmentTime];

    if (remaining !== undefined && remaining <= 0) {
      alert(
        "This appointment slot is fully booked. Please select another slot."
      );
      return;
    }

    setSubmitting(true);

    try {
      const { data, error } = await supabase.rpc("book_appointment", {
        p_full_name: fullName.trim(),
        p_phone: phone.trim(),
        p_email: email.trim() || null,
        p_appointment_date: appointmentDate,
        p_appointment_time: appointmentTime,
      });

      if (error) {
        console.error("Appointment booking error:", error);

        setErrorMessage(
          "Unable to confirm your appointment. Please try again."
        );

        setSubmitting(false);
        return;
      }

      if (!data?.success) {
        setErrorMessage(
          data?.message ||
            "This appointment could not be confirmed. Please select another slot."
        );

        setSubmitting(false);
        return;
      }

            // Send appointment notification email to the office
      try {
        const emailResponse = await fetch("/api/appointments/notify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: fullName.trim(),
            phone: phone.trim(),
            email: email.trim() || "",
            appointmentDate,
            appointmentTime,
          }),
        });

        const emailResult = await emailResponse.json();

        if (!emailResponse.ok || !emailResult.success) {
          console.error(
            "Appointment notification email failed:",
            emailResult
          );
        }
      } catch (emailError) {
        console.error(
          "Appointment notification request failed:",
          emailError
        );
      }

      const selectedSlot = availableSlots.find(
        (slot) => slot.value === appointmentTime
      );

      setSuccess(
        `Your appointment has been confirmed for ${formatDate(
          appointmentDate
        )} at ${selectedSlot?.label || ""}.`
      );

      setFullName("");
      setPhone("");
      setEmail("");
      setAppointmentDate("");
      setAppointmentTime("");
      setSlotCounts({});
    } catch (error) {
      console.error("Unexpected appointment error:", error);

      setErrorMessage(
        "Something went wrong while confirming your appointment."
      );
    }

    setSubmitting(false);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F7F5EF",
        color: "#17202A",
        padding: "40px 20px 70px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "#0B1F33",
            textDecoration: "none",
            fontWeight: 600,
            marginBottom: "30px",
          }}
        >
          <ArrowLeft size={18} />
          Back to V G ASSOCIATES
        </Link>

        <section
          style={{
            background: "#FFFFFF",
            borderRadius: "18px",
            overflow: "hidden",
            boxShadow: "0 12px 40px rgba(11, 31, 51, 0.10)",
            border: "1px solid #E5E7EB",
          }}
        >
          <div
            style={{
              background: "#0B1F33",
              color: "#FFFFFF",
              padding: "38px 35px",
            }}
          >
            <div
              style={{
                color: "#D4AF37",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              V G ASSOCIATES
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "clamp(30px, 5vw, 44px)",
                lineHeight: 1.15,
              }}
            >
              Book an Appointment
            </h1>

            <p
              style={{
                margin: "14px 0 0",
                color: "#D9E1E8",
                fontSize: "16px",
                lineHeight: 1.7,
              }}
            >
              Choose a convenient date and available time slot for your
              consultation.
            </p>
          </div>

          <div style={{ padding: "35px" }}>
            <div
              style={{
                background: "#F7F5EF",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                padding: "18px 20px",
                marginBottom: "28px",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  color: "#0B1F33",
                  marginBottom: "8px",
                }}
              >
                Appointment Hours
              </div>

              <div
                style={{
                  color: "#667085",
                  lineHeight: 1.8,
                  fontSize: "14px",
                }}
              >
                <div>
                  <strong>Monday – Saturday:</strong> 9:00 AM – 10:00 AM and
                  6:00 PM – 9:00 PM
                </div>

                <div>
                  <strong>Sunday:</strong> 9:00 AM – 1:00 PM
                </div>

                <div>
                  Each appointment slot is 30 minutes. Maximum 3 appointments
                  per slot.
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontWeight: 700,
                    marginBottom: "8px",
                    color: "#0B1F33",
                  }}
                >
                  <User size={17} />
                  Full Name *
                </label>

                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  style={inputStyle}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontWeight: 700,
                    marginBottom: "8px",
                    color: "#0B1F33",
                  }}
                >
                  <Phone size={17} />
                  Phone Number *
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  style={inputStyle}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontWeight: 700,
                    marginBottom: "8px",
                    color: "#0B1F33",
                  }}
                >
                  <Mail size={17} />
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Optional"
                  style={inputStyle}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontWeight: 700,
                    marginBottom: "8px",
                    color: "#0B1F33",
                  }}
                >
                  <CalendarDays size={17} />
                  Appointment Date *
                </label>

                <input
                  type="date"
                  min={today}
                  value={appointmentDate}
                  onChange={(e) => {
                    setAppointmentDate(e.target.value);
                    setAppointmentTime("");
                    setSuccess("");
                    setErrorMessage("");
                  }}
                  style={inputStyle}
                />
              </div>
            </div>

            {appointmentDate && (
              <div style={{ marginTop: "30px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "9px",
                    marginBottom: "8px",
                    color: "#0B1F33",
                    fontWeight: 700,
                  }}
                >
                  <Clock size={18} />
                  Available Time Slots
                </div>

                <p
                  style={{
                    margin: "0 0 18px",
                    color: "#667085",
                    fontSize: "14px",
                  }}
                >
                  {formatDate(appointmentDate)}
                </p>

                {loadingSlots ? (
                  <div
                    style={{
                      padding: "20px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "10px",
                      color: "#667085",
                    }}
                  >
                    Checking available slots...
                  </div>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(150px, 1fr))",
                      gap: "12px",
                    }}
                  >
                    {availableSlots.map((slot) => {
                      const remaining = slotCounts[slot.value] ?? 3;
                      const isFull = remaining <= 0;
                      const isSelected =
                        appointmentTime === slot.value;

                      return (
                        <button
                          key={slot.value}
                          type="button"
                          disabled={isFull}
                          onClick={() => {
                            setAppointmentTime(slot.value);
                            setErrorMessage("");
                          }}
                          style={{
                            border: isSelected
                              ? "2px solid #C9A227"
                              : "1px solid #D9DEE5",
                            background: isFull
                              ? "#F1F1F1"
                              : isSelected
                              ? "#FFF9E6"
                              : "#FFFFFF",
                            color: isFull
                              ? "#98A2B3"
                              : "#0B1F33",
                            borderRadius: "10px",
                            padding: "14px 10px",
                            cursor: isFull
                              ? "not-allowed"
                              : "pointer",
                            textAlign: "center",
                            opacity: isFull ? 0.75 : 1,
                          }}
                        >
                          <div
                            style={{
                              fontWeight: 800,
                              fontSize: "15px",
                              marginBottom: "5px",
                            }}
                          >
                            {slot.label}
                          </div>

                          <div
                            style={{
                              fontSize: "12px",
                              color: isFull
                                ? "#98A2B3"
                                : "#667085",
                            }}
                          >
                            {isFull
                              ? "Full"
                              : `${remaining} of 3 available`}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {errorMessage && (
              <div
                style={{
                  marginTop: "25px",
                  padding: "15px 17px",
                  borderRadius: "10px",
                  background: "#FFF1F0",
                  border: "1px solid #F1B5B0",
                  color: "#A4261A",
                  lineHeight: 1.5,
                }}
              >
                {errorMessage}
              </div>
            )}

            {success && (
              <div
                style={{
                  marginTop: "25px",
                  padding: "17px",
                  borderRadius: "10px",
                  background: "#F0F8F1",
                  border: "1px solid #B7D8BA",
                  color: "#216B2A",
                  lineHeight: 1.6,
                  fontWeight: 600,
                }}
              >
                {success}
              </div>
            )}

            <button
              type="button"
              onClick={submitAppointment}
              disabled={submitting}
              style={{
                width: "100%",
                marginTop: "30px",
                border: "none",
                borderRadius: "10px",
                background: submitting
                  ? "#8F7A31"
                  : "#C9A227",
                color: "#FFFFFF",
                padding: "16px 20px",
                fontSize: "16px",
                fontWeight: 800,
                cursor: submitting
                  ? "not-allowed"
                  : "pointer",
                boxShadow:
                  "0 7px 18px rgba(201, 162, 39, 0.20)",
              }}
            >
              {submitting
                ? "Confirming Appointment..."
                : "Confirm Appointment"}
            </button>

            <p
              style={{
                textAlign: "center",
                color: "#667085",
                fontSize: "13px",
                marginTop: "14px",
                lineHeight: 1.6,
              }}
            >
              Your appointment is confirmed immediately after
              successful booking.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #D9DEE5",
  borderRadius: "9px",
  padding: "13px 14px",
  fontSize: "15px",
  color: "#17202A",
  background: "#FFFFFF",
  outline: "none",
};