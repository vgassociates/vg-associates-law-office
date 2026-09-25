"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Appointment = {
  id: string;
  client_id: string | null;
  appointment_date: string;
  appointment_time: string | null;
  purpose: string | null;
  status: string;
  notes: string | null;
  client_name?: string;
  client_phone?: string;
};

type CaseRow = {
  id: string;
  case_number: string;
  client_id: string | null;
  title: string;
  status: string;
  assigned_advocate: string | null;
};

const ADVOCATES = [
  "Advocate M P R V P",
  "Advocate M B V N G S",
  "Advocate M H S S B",
  "Advocate SK.B.A",
];

export default function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<any>(null);

  const [tab, setTab] = useState("dashboard");

  const [clients, setClients] = useState<
  {
    id: string;
    full_name: string;
    phone: string;
  }[]
>([]);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentClientId, setAppointmentClientId] =
  useState("");

const [appointmentDate, setAppointmentDate] =
  useState("");

const [appointmentTime, setAppointmentTime] =
  useState("");

const [appointmentPurpose, setAppointmentPurpose] =
  useState("");

const [appointmentNotes, setAppointmentNotes] =
  useState("");

const [appointmentStatus, setAppointmentStatus] =
  useState("Pending");

const [savingAppointment, setSavingAppointment] =
  useState(false);
  const [cases, setCases] = useState<CaseRow[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const [savingCase, setSavingCase] = useState<string | null>(null);
  const [savingAdvocate, setSavingAdvocate] = useState<string | null>(null);

  const [showCaseForm, setShowCaseForm] = useState(false);

  const [caseNumber, setCaseNumber] = useState("");
  const [caseClient, setCaseClient] = useState("");
  const [caseTitle, setCaseTitle] = useState("");
  const [caseStatus, setCaseStatus] = useState("unassigned");
  const [caseAdvocate, setCaseAdvocate] = useState("");

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
      setSession(data.session);

console.log("NEW LOGIN SESSION:", data.session);
console.log(
  "JWT EXPIRES AT:",
  data.session?.expires_at
    ? new Date(
        data.session.expires_at * 1000
      ).toString()
    : "NO EXPIRY"
);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (mounted) {
        setSession(newSession);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
  alert(error.message);
  return;
}

setSession(data.session);

  }

  async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
      return;
    }

    setSession(null);
    setEmail("");
    setPassword("");
  }

  async function load() {
  setLoadingData(true);

  /*
   * LOAD APPOINTMENTS
   */
    const appointmentsResult = await supabase
      .from("appointments")
      .select(
        `
        id,
        client_id,
        appointment_date,
        appointment_time,
        purpose,
        status,
        notes
        `
      )
      .order("appointment_date", {
        ascending: true,
      })
      .order("appointment_time", {
        ascending: true,
      });

    if (appointmentsResult.error) {
  console.error(
    "Appointments error:",
    JSON.stringify(
      appointmentsResult.error,
      null,
      2
    )
  );

  alert(
    "Appointments error:\n" +
      JSON.stringify(
        appointmentsResult.error,
        null,
        2
      )
  );
}

    let loadedAppointments: Appointment[] = [];

    if (appointmentsResult.data) {
      loadedAppointments =
        appointmentsResult.data as Appointment[];

      /*
       * Get the client IDs used by the appointments.
       */
      const clientIds = Array.from(
        new Set(
          loadedAppointments
            .map((appointment) => appointment.client_id)
            .filter(
              (clientId): clientId is string =>
                Boolean(clientId)
            )
        )
      );

      /*
       * Load client names and phone numbers separately.
       *
       * This avoids relying on Supabase's automatic
       * foreign-key relationship syntax.
       */
      if (clientIds.length > 0) {
        const clientsResult = await supabase
          .from("clients")
          .select("id, full_name, phone")
          .in("id", clientIds);

        if (clientsResult.error) {
          console.error(
            "Clients error:",
            clientsResult.error
          );
        } else if (clientsResult.data) {
          const clientsMap = new Map<
            string,
            {
              full_name: string;
              phone: string;
            }
          >();

          clientsResult.data.forEach((client) => {
            clientsMap.set(client.id, {
              full_name: client.full_name,
              phone: client.phone,
            });
          });

          loadedAppointments =
            loadedAppointments.map((appointment) => {
              const client = appointment.client_id
                ? clientsMap.get(appointment.client_id)
                : undefined;

              return {
                ...appointment,
                client_name:
                  client?.full_name || "Unknown client",
                client_phone:
                  client?.phone || "—",
              };
            });
        }
      } else {
        loadedAppointments =
          loadedAppointments.map((appointment) => ({
            ...appointment,
            client_name: "Not linked",
            client_phone: "—",
          }));
      }
    }

    const clientsResult = await supabase
  .from("clients")
  .select("id, full_name, phone")
  .order("full_name", {
    ascending: true,
  });

if (clientsResult.error) {
  console.error(
    "Clients loading error:",
    clientsResult.error
  );
} else if (clientsResult.data) {
  setClients(clientsResult.data);
}

    setAppointments(loadedAppointments);

    /*
     * LOAD CASES
     */
    const casesResult = await supabase
      .from("cases")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (casesResult.error) {
  console.error(
    "Cases error message:",
    casesResult.error?.message
  );

  console.error(
    "Cases error details:",
    casesResult.error?.details
  );

  console.error(
    "Cases error hint:",
    casesResult.error?.hint
  );

  console.error(
    "Cases error code:",
    casesResult.error?.code
  );

  alert(
    `Cases error:

code: ${casesResult.error?.code ?? "unknown"}

message: ${casesResult.error?.message ?? "unknown"}

details: ${casesResult.error?.details ?? "none"}

hint: ${casesResult.error?.hint ?? "none"}`
  );
} else if (casesResult.data) {
  setCases(casesResult.data as CaseRow[]);
}

    setLoadingData(false);
  }

  useEffect(() => {
    if (session) {
      load();
    }
  }, [session]);
async function createAppointment() {
  if (!appointmentClientId) {
    alert("Please select a client.");
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

  if (!appointmentPurpose.trim()) {
    alert("Please enter the purpose.");
    return;
  }

  setSavingAppointment(true);

  const { data, error } = await supabase
    .from("appointments")
    .insert({
      client_id: appointmentClientId,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      purpose: appointmentPurpose.trim(),
      status: appointmentStatus,
      notes: appointmentNotes.trim() || null,
    })
    .select()
    .single();

  setSavingAppointment(false);

  if (error) {
    console.error(
      "Create appointment error:",
      error
    );

    alert(
      "Unable to create appointment:\n" +
        error.message
    );

    return;
  }

  const selectedClient = clients.find(
    (client) =>
      client.id === appointmentClientId
  );

  const newAppointment: Appointment = {
    ...data,
    client_name:
      selectedClient?.full_name ||
      "Unknown client",
    client_phone:
      selectedClient?.phone || "—",
  };

  setAppointments((previousAppointments) => [
    ...previousAppointments,
    newAppointment,
  ]);

  setAppointmentClientId("");
  setAppointmentDate("");
  setAppointmentTime("");
  setAppointmentPurpose("");
  setAppointmentNotes("");
  setAppointmentStatus("Pending");

  alert("Appointment created successfully.");
}
  async function updateCaseStatus(
    caseId: string,
    status: string
  ) {
    setSavingCase(caseId);

    const { error } = await supabase
      .from("cases")
      .update({
        status,
      })
      .eq("id", caseId);

    setSavingCase(null);

    if (error) {
      alert(error.message);
      return;
    }

    setCases((previousCases) =>
      previousCases.map((currentCase) =>
        currentCase.id === caseId
          ? {
              ...currentCase,
              status,
            }
          : currentCase
      )
    );
  }

  async function updateCaseAdvocate(
    caseId: string,
    assignedAdvocate: string
  ) {
    setSavingAdvocate(caseId);

    const advocateValue =
      assignedAdvocate.trim() === ""
        ? null
        : assignedAdvocate;

    const { error } = await supabase
      .from("cases")
      .update({
        assigned_advocate: advocateValue,
      })
      .eq("id", caseId);

    setSavingAdvocate(null);

    if (error) {
      alert(error.message);
      return;
    }

    setCases((previousCases) =>
      previousCases.map((currentCase) =>
        currentCase.id === caseId
          ? {
              ...currentCase,
              assigned_advocate: advocateValue,
            }
          : currentCase
      )
    );
  }

  async function addCase(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const { data, error } = await supabase
      .from("cases")
      .insert({
        case_number: caseNumber.trim(),
        title: caseTitle.trim(),
        status: caseStatus,
        assigned_advocate:
          caseAdvocate.trim() === ""
            ? null
            : caseAdvocate,
      })
      .select("*")
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    if (data) {
      setCases((currentCases) => [
        data as CaseRow,
        ...currentCases,
      ]);
    }

    setCaseNumber("");
    setCaseClient("");
    setCaseTitle("");
    setCaseStatus("unassigned");
    setCaseAdvocate("");
    setShowCaseForm(false);
  }

  if (!session) {
    return (
      <div className="admin-wrap">
        <div
          className="container"
          style={{
            maxWidth: 480,
            paddingTop: 100,
          }}
        >
          <div className="card">
            <ImageLogo />

            <div className="eyebrow">
              Secure office portal
            </div>

            <h2>Admin Login</h2>

            <p className="section-intro">
              Authorized staff only.
            </p>

            <form
              className="form"
              onSubmit={login}
            >
              <input
                className="input"
                type="email"
                placeholder="Admin email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

              <input
                className="input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

              <button
                className="btn gold"
                disabled={loading}
                type="submit"
              >
                {loading
                  ? "Signing in…"
                  : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-wrap">
      <div className="admin-nav">
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <b>V G ASSOCIATES · ADMIN</b>

          <button
            className="btn ghost"
            onClick={logout}
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="admin-grid">
        <aside className="sidebar">
          <a
            onClick={() =>
              setTab("dashboard")
            }
          >
            Dashboard
          </a>

          <a
            onClick={() =>
              setTab("cases")
            }
          >
            Cases
          </a>

          <a
            onClick={() =>
              setTab("appointments")
            }
          >
            Appointments
          </a>

          <a
            onClick={() =>
              setTab("files")
            }
          >
            Client Files
          </a>

          <a
            onClick={() =>
              setTab("settings")
            }
          >
            Settings
          </a>
        </aside>

        <main className="main">
          {loadingData && (
            <p>Loading office data…</p>
          )}

          {tab === "dashboard" && (
            <>
              <h1>Dashboard</h1>

              <div className="stat-grid">
                <div className="stat">
                  <div>Cases</div>
                  <b>{cases.length}</b>
                </div>

                <div className="stat">
                  <div>Appointments</div>
                  <b>{appointments.length}</b>
                </div>

                <div className="stat">
                  <div>Completed</div>
                  <b>
                    {
                      appointments.filter(
                        (appointment) =>
                          appointment.status ===
                          "completed"
                      ).length
                    }
                  </b>
                </div>

                <div className="stat">
                  <div>Active cases</div>
                  <b>
                    {
                      cases.filter(
                        (currentCase) =>
                          currentCase.status ===
                          "active"
                      ).length
                    }
                  </b>
                </div>
              </div>
            </>
          )}

          {tab === "cases" && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <div>
                  <h1>Cases</h1>

                  <p>
                    Create cases and assign
                    them to an advocate.
                  </p>
                </div>

                <button
                  className="btn gold"
                  onClick={() =>
                    setShowCaseForm(
                      !showCaseForm
                    )
                  }
                >
                  {showCaseForm
                    ? "Close"
                    : "Add Case"}
                </button>
              </div>

              {showCaseForm && (
                <div
                  className="card"
                  style={{
                    marginBottom: 30,
                  }}
                >
                  <h2>Add New Case</h2>

                  <form
                    className="form"
                    onSubmit={addCase}
                  >
                    <input
                      className="input"
                      type="text"
                      placeholder="Case Number"
                      value={caseNumber}
                      onChange={(e) =>
                        setCaseNumber(
                          e.target.value
                        )
                      }
                      required
                    />

                    <input
                      className="input"
                      type="text"
                      placeholder="Client ID"
                      value={caseClient}
                      onChange={(e) =>
                        setCaseClient(
                          e.target.value
                        )
                      }
                    />

                    <input
                      className="input"
                      type="text"
                      placeholder="Case Title"
                      value={caseTitle}
                      onChange={(e) =>
                        setCaseTitle(
                          e.target.value
                        )
                      }
                      required
                    />

                    <select
                      className="input"
                      value={caseStatus}
                      onChange={(e) =>
                        setCaseStatus(
                          e.target.value
                        )
                      }
                    >
                      <option value="unassigned">
                        Unassigned
                      </option>

                      <option value="active">
                        Active
                      </option>

                      <option value="completed">
                        Completed
                      </option>
                    </select>

                    <select
                      className="input"
                      value={caseAdvocate}
                      onChange={(e) =>
                        setCaseAdvocate(
                          e.target.value
                        )
                      }
                    >
                      <option value="">
                        Unassigned
                      </option>

                      {ADVOCATES.map(
                        (advocate) => (
                          <option
                            key={advocate}
                            value={advocate}
                          >
                            {advocate}
                          </option>
                        )
                      )}
                    </select>

                    <button
                      className="btn gold"
                      type="submit"
                    >
                      Create Case
                    </button>
                  </form>
                </div>
              )}

              <table>
                <thead>
                  <tr>
                    <th>Case No.</th>
                    <th>Client</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>
                      Assigned Advocate
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {cases.map((currentCase) => (
                    <tr
                      key={currentCase.id}
                    >
                      <td>
                        {
                          currentCase.case_number
                        }
                      </td>

                      <td>
                        {
                          currentCase.client_id ||
                          "Not linked"
                        }
                      </td>

                      <td>
                        {currentCase.title}
                      </td>

                      <td>
                        <select
                          className="input"
                          value={
                            currentCase.status ||
                            "unassigned"
                          }
                          disabled={
                            savingCase ===
                            currentCase.id
                          }
                          onChange={(e) =>
                            updateCaseStatus(
                              currentCase.id,
                              e.target.value
                            )
                          }
                        >
                          <option value="unassigned">
                            Unassigned
                          </option>

                          <option value="active">
                            Active
                          </option>

                          <option value="completed">
                            Completed
                          </option>
                        </select>
                      </td>

                      <td>
                        <select
                          className="input"
                          value={
                            currentCase.assigned_advocate ||
                            ""
                          }
                          disabled={
                            savingAdvocate ===
                            currentCase.id
                          }
                          onChange={(e) =>
                            updateCaseAdvocate(
                              currentCase.id,
                              e.target.value
                            )
                          }
                        >
                          <option value="">
                            Unassigned
                          </option>

                          {ADVOCATES.map(
                            (advocate) => (
                              <option
                                key={advocate}
                                value={advocate}
                              >
                                {advocate}
                              </option>
                            )
                          )}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {tab === "appointments" && (
            <>
              <h1>Appointments</h1>
              <div
  style={{
    marginBottom: "24px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
  }}
>
  <h2>New Appointment</h2>

  <div
    style={{
      display: "grid",
      gap: "12px",
      maxWidth: "600px",
    }}
  >
    <select
      value={appointmentClientId}
      onChange={(e) =>
        setAppointmentClientId(e.target.value)
      }
    >
      <option value="">Select client</option>

      {clients.map((client) => (
        <option
          key={client.id}
          value={client.id}
        >
          {client.full_name} — {client.phone}
        </option>
      ))}
    </select>

    <input
      type="date"
      value={appointmentDate}
      onChange={(e) =>
        setAppointmentDate(e.target.value)
      }
    />

    <input
      type="time"
      value={appointmentTime}
      onChange={(e) =>
        setAppointmentTime(e.target.value)
      }
    />

    <input
      type="text"
      placeholder="Purpose"
      value={appointmentPurpose}
      onChange={(e) =>
        setAppointmentPurpose(e.target.value)
      }
    />

    <textarea
      placeholder="Notes"
      value={appointmentNotes}
      onChange={(e) =>
        setAppointmentNotes(e.target.value)
      }
    />

    <select
      value={appointmentStatus}
      onChange={(e) =>
        setAppointmentStatus(e.target.value)
      }
    >
      <option value="Pending">Pending</option>
      <option value="Confirmed">Confirmed</option>
      <option value="Completed">Completed</option>
      <option value="Cancelled">Cancelled</option>
    </select>

    <button
  type="button"
  disabled={savingAppointment}
  onClick={createAppointment}
>
      {savingAppointment
        ? "Saving..."
        : "Create Appointment"}
    </button>
  </div>
</div>

              <table>
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Phone</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Purpose</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.map(
                    (appointment) => (
                      <tr
                        key={appointment.id}
                      >
                        <td>
                          {appointment.client_name ||
                            appointment.client_id ||
                            "Not linked"}
                        </td>

                        <td>
                          {appointment.client_phone ||
                            "—"}
                        </td>

                        <td>
                          {
                            appointment.appointment_date
                          }
                        </td>

                        <td>
                          {
                            appointment.appointment_time ||
                            "—"
                          }
                        </td>

                        <td>
                          {appointment.purpose ||
                            "—"}
                        </td>

                        <td>
                          {appointment.status ||
                            "—"}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </>
          )}

          {tab === "files" && (
            <>
              <h1>Client Files</h1>

              <p>
                Use Supabase Storage with
                private buckets for pleadings,
                notices, orders and other case
                documents. Keep access restricted
                to authorized staff.
              </p>
            </>
          )}

          {tab === "settings" && (
            <>
              <h1>Settings</h1>

              <p>
                Recommended next additions:
                staff accounts/roles,
                case-number generator,
                appointment status workflow,
                document upload/download,
                audit log and backup policy.
              </p>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function ImageLogo() {
  return (
    <img
      src="/logo.svg"
      alt="VG Associates"
      style={{
        width: 72,
        height: 72,
        marginBottom: 18,
      }}
    />
  );
}