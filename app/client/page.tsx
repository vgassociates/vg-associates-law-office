"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ClientAppointmentPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  async function submitAppointment() {
    setSuccess("");

    if (!fullName.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!phone.trim()) {
      alert("Please enter your phone number.");
      return;
    }

    if (!appointmentDate) {
      alert("Please select a date.");
      return;
    }

    if (!appointmentTime) {
      alert("Please select a time.");
      return;
    }

    if (!purpose.trim()) {
      alert("Please enter the purpose of the appointment.");
      return;
    }

    setSubmitting(true);

    /*
     * First create/find the client.
     */

    const { data: existingClient, error: clientSearchError } =
      await supabase
        .from("clients")
        .select("id")
        .eq("phone", phone.trim())
        .maybeSingle();

    if (clientSearchError) {
      console.error(
        "Client search error:",
        clientSearchError
      );

      alert(
        "Unable to process client details:\n" +
          clientSearchError.message
      );

      setSubmitting(false);
      return;
    }

    let clientId = existingClient?.id;

    /*
     * Create a new client if one does not already exist.
     */

    if (!clientId) {
  const clientIdForNewClient = crypto.randomUUID();

  const { error: clientInsertError } =
    await supabase
      .from("clients")
      .insert({
        id: clientIdForNewClient,
        full_name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || null,
        address: address.trim() || null,
      });

  if (clientInsertError) {
    console.error(
      "Client creation error:",
      clientInsertError
    );

    alert(
      "Unable to create client record:\n" +
        clientInsertError.message
    );

    setSubmitting(false);
    return;
  }

  clientId = clientIdForNewClient;
}

    /*
     * Create the appointment request.
     */

    const { error: appointmentError } =
      await supabase
        .from("appointments")
        .insert({
          client_id: clientId,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
          purpose: purpose.trim(),
          status: "Pending",
          notes: notes.trim() || null,
        });

    if (appointmentError) {
      console.error(
        "Appointment creation error:",
        appointmentError
      );

      alert(
        "Unable to submit appointment:\n" +
          appointmentError.message
      );

      setSubmitting(false);
      return;
    }

    setSubmitting(false);

    setFullName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setAppointmentDate("");
    setAppointmentTime("");
    setPurpose("");
    setNotes("");

    setSuccess(
      "Your appointment request has been submitted successfully. The office will contact you for confirmation."
    );
  }

  return (
    <main
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <h1>Request an Appointment</h1>

      <p>
        Please provide your details and preferred
        appointment time. The office will contact you
        to confirm the appointment.
      </p>

      <div
        style={{
          display: "grid",
          gap: "14px",
          marginTop: "24px",
        }}
      >
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) =>
            setFullName(e.target.value)
          }
        />

        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
          }
        />

        <input
          type="email"
          placeholder="Email Address (optional)"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <textarea
          placeholder="Address (optional)"
          value={address}
          onChange={(e) =>
            setAddress(e.target.value)
          }
        />

        <label>
          Preferred Date
        </label>

        <input
          type="date"
          value={appointmentDate}
          onChange={(e) =>
            setAppointmentDate(e.target.value)
          }
        />

        <label>
          Preferred Time
        </label>

        <input
          type="time"
          value={appointmentTime}
          onChange={(e) =>
            setAppointmentTime(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Purpose of Appointment"
          value={purpose}
          onChange={(e) =>
            setPurpose(e.target.value)
          }
        />

        <textarea
          placeholder="Additional Notes (optional)"
          value={notes}
          onChange={(e) =>
            setNotes(e.target.value)
          }
        />

        <button
          type="button"
          onClick={submitAppointment}
          disabled={submitting}
        >
          {submitting
            ? "Submitting..."
            : "Request Appointment"}
        </button>

        {success && (
          <p>
            {success}
          </p>
        )}
      </div>
    </main>
  );
}