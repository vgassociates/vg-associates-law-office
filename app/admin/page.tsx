"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "../../lib/supabase";

type Appointment = {
  id: string;
  client_name: string;
  phone: string;
  appointment_date: string;
  status: string;
};

type CaseRow = {
  id: string;
  case_number: string;
  client_name: string;
  case_title: string;
  status: string;
  assigned_to: string | null;
};

const ADVOCATES = [
  "Advocate M P R V P",
  "Advocate M B V N G S",
  "Advocate M H S S B",
];

export default function Admin() {
  const supabase = supabaseBrowser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<any>(null);
  const [tab, setTab] = useState("dashboard");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingCase, setSavingCase] = useState<string | null>(null);

  const [showCaseForm, setShowCaseForm] = useState(false);
  const [caseNumber, setCaseNumber] = useState("");
  const [caseClient, setCaseClient] = useState("");
  const [caseTitle, setCaseTitle] = useState("");
  const [caseStatus, setCaseStatus] = useState("active");
  const [caseAdvocate, setCaseAdvocate] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
  }, []);

  async function login(e: any) {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      setSession(data.session);
    }
  }

  async function load() {
    const a = await supabase
      .from("appointments")
      .select("*")
      .order("appointment_date", { ascending: true });

    const c = await supabase
      .from("cases")
      .select("*")
      .order("created_at", { ascending: false });

    if (a.data) setAppointments(a.data as Appointment[]);
    if (c.data) setCases(c.data as CaseRow[]);
  }

  useEffect(() => {
    if (session) load();
  }, [session]);

  async function assignAdvocate(caseId: string, advocate: string) {
    setSavingCase(caseId);

    const { error } = await supabase
      .from("cases")
      .update({
        assigned_to: advocate || null,
      })
      .eq("id", caseId);

    setSavingCase(null);

    if (error) {
      alert(error.message);
      return;
    }

    setCases((currentCases) =>
      currentCases.map((c) =>
        c.id === caseId
          ? { ...c, assigned_to: advocate || null }
          : c
      )
    );
  }

  async function addCase(e: any) {
    e.preventDefault();

    const { data, error } = await supabase
      .from("cases")
      .insert({
        case_number: caseNumber,
        client_name: caseClient,
        case_title: caseTitle,
        status: caseStatus,
        assigned_to: caseAdvocate || null,
      })
      .select()
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
    setCaseStatus("active");
    setCaseAdvocate("");
    setShowCaseForm(false);
  }

  if (!session) {
    return (
      <div className="admin-wrap">
        <div
          className="container"
          style={{ maxWidth: 480, paddingTop: 100 }}
        >
          <div className="card">
            <ImageLogo />

            <div className="eyebrow">Secure office portal</div>

            <h2>Admin Login</h2>

            <p className="section-intro">
              Authorized staff only.
            </p>

            <form className="form" onSubmit={login}>
              <input
                className="input"
                type="email"
                placeholder="Admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                className="input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button className="btn gold" disabled={loading}>
                {loading ? "Signing in…" : "Sign in"}
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
          }}
        >
          <b>V G ASSOCIATES · ADMIN</b>

          <button
            className="btn ghost"
            onClick={() => supabase.auth.signOut()}
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="admin-grid">
        <aside className="sidebar">
          <a onClick={() => setTab("dashboard")}>Dashboard</a>
          <a onClick={() => setTab("cases")}>Cases</a>
          <a onClick={() => setTab("appointments")}>
            Appointments
          </a>
          <a onClick={() => setTab("files")}>Client Files</a>
          <a onClick={() => setTab("settings")}>Settings</a>
        </aside>

        <main className="main">
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
                  <div>Pending</div>
                  <b>
                    {
                      appointments.filter(
                        (a) => a.status === "pending"
                      ).length
                    }
                  </b>
                </div>

                <div className="stat">
                  <div>Active cases</div>
                  <b>
                    {
                      cases.filter(
                        (c) => c.status === "active"
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
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <div>
                  <h1>Cases</h1>

                  <p>
                    Create cases and assign them to an advocate.
                  </p>
                </div>

                <button
                  className="btn gold"
                  onClick={() =>
                    setShowCaseForm(!showCaseForm)
                  }
                >
                  {showCaseForm ? "Close" : "Add Case"}
                </button>
              </div>

              {showCaseForm && (
                <div
                  className="card"
                  style={{ marginBottom: 30 }}
                >
                  <h2>Add New Case</h2>

                  <form className="form" onSubmit={addCase}>
                    <input
                      className="input"
                      type="text"
                      placeholder="Case Number"
                      value={caseNumber}
                      onChange={(e) =>
                        setCaseNumber(e.target.value)
                      }
                      required
                    />

                    <input
                      className="input"
                      type="text"
                      placeholder="Client Name"
                      value={caseClient}
                      onChange={(e) =>
                        setCaseClient(e.target.value)
                      }
                      required
                    />

                    <input
                      className="input"
                      type="text"
                      placeholder="Case Title"
                      value={caseTitle}
                      onChange={(e) =>
                        setCaseTitle(e.target.value)
                      }
                      required
                    />

                    <select
                      className="input"
                      value={caseStatus}
                      onChange={(e) =>
                        setCaseStatus(e.target.value)
                      }
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="closed">Closed</option>
                    </select>

                    <select
                      className="input"
                      value={caseAdvocate}
                      onChange={(e) =>
                        setCaseAdvocate(e.target.value)
                      }
                    >
                      <option value="">
                        Unassigned
                      </option>

                      {ADVOCATES.map((advocate) => (
                        <option
                          key={advocate}
                          value={advocate}
                        >
                          {advocate}
                        </option>
                      ))}
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
                    <th>Assigned Advocate</th>
                  </tr>
                </thead>

                <tbody>
                  {cases.map((c) => (
                    <tr key={c.id}>
                      <td>{c.case_number}</td>

                      <td>{c.client_name}</td>

                      <td>{c.case_title}</td>

                      <td>{c.status}</td>

                      <td>
                        <select
                          className="input"
                          value={c.assigned_to || ""}
                          disabled={savingCase === c.id}
                          onChange={(e) =>
                            assignAdvocate(
                              c.id,
                              e.target.value
                            )
                          }
                        >
                          <option value="">
                            Unassigned
                          </option>

                          {ADVOCATES.map((advocate) => (
                            <option
                              key={advocate}
                              value={advocate}
                            >
                              {advocate}
                            </option>
                          ))}
                        </select>

                        {savingCase === c.id && (
                          <small> Saving…</small>
                        )}
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

              <table>
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Phone</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.map((a) => (
                    <tr key={a.id}>
                      <td>{a.client_name}</td>
                      <td>{a.phone}</td>
                      <td>
                        {new Date(
                          a.appointment_date
                        ).toLocaleString()}
                      </td>
                      <td>{a.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {tab === "files" && (
            <>
              <h1>Client Files</h1>

              <p>
                Use Supabase Storage with private buckets for
                pleadings, notices, orders and other case
                documents. Keep access restricted to authorized
                staff.
              </p>
            </>
          )}

          {tab === "settings" && (
            <>
              <h1>Settings</h1>

              <p>
                Recommended next additions: staff
                accounts/roles, case-number generator,
                appointment status workflow, document
                upload/download, audit log and backup policy.
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